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

    // Look up the page using editId
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

    // Get file extension from original filename
    const extension = file.name.split(".").pop() || "";

    // Compute file hash
    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    const newFilename = `${hash}.${extension}`;
    let contentType: "image" | "video" | "audio" = "image";
    if (file.type.startsWith("video/")) contentType = "video";
    if (file.type.startsWith("audio/")) contentType = "audio";

    // Check if file already exists
    let existed = false;

    // Check if file exists in R2
    try {
      await r2Client.send(
        new HeadObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: newFilename,
        })
      );
      existed = true;
    } catch {
      // Upload if doesn't exist
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

    const result = await db.transaction(async (tx) => {
      // Insert or ignore content
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

      // Insert page content relationship with position
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
      existed: false,
    });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
