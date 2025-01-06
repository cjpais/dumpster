import { NextResponse } from "next/server";
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";
import crypto from "crypto";
import { UploadMetadata, UploadMetadataSchema } from "@/lib/types";
import { contents, pageContents, pages } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const metadataStr = formData.get("metadata") as string;

    let metadata: UploadMetadata;
    try {
      const parsedMetadata = JSON.parse(metadataStr);
      metadata = UploadMetadataSchema.parse(parsedMetadata);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid metadata format" },
        { status: 400 }
      );
    }

    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.editId, metadata.editId))
      .limit(1);

    if (!page) {
      return NextResponse.json(
        { error: "Page not found for given editId" },
        { status: 404 }
      );
    }

    const extension = file.name.split(".").pop() || "";
    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    const newFilename = `${hash}.${extension}`;
    let contentType: "image" | "video" | "audio" = "image";
    if (file.type.startsWith("video/")) contentType = "video";
    if (file.type.startsWith("audio/")) contentType = "audio";

    let existed = false;
    try {
      await r2Client.send(
        new HeadObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: newFilename,
        })
      );
      existed = true;
    } catch {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: newFilename,
          Body: buffer,
          ContentType: file.type,
        })
      );
    }
    const fileUrl = `https://files.dumpster.page/${newFilename}`;

    try {
      const result = await db.transaction(async (tx) => {
        await tx
          .insert(contents)
          .values({
            id: hash,
            type: contentType,
            mediaUrl: fileUrl,
            metadata: JSON.stringify({
              originalName: file.name,
              mimeType: file.type,
              size: file.size,
            }),
          })
          .onConflictDoNothing();

        const [pageContent] = await tx
          .insert(pageContents)
          .values({
            pageId: page.id,
            contentId: hash,
            positionX: metadata.position?.x ?? null,
            positionY: metadata.position?.y ?? null,
          })
          .returning();

        return pageContent;
      });

      return NextResponse.json({
        success: true,
        filename: newFilename,
        url: `https://files.dumpster.page/${newFilename}`,
        existed: existed,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("unique constraint")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Content already exists on this page",
            existed: true,
          },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
