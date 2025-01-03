import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/db";
import { contents } from "@/db/schema";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const pageId = formData.get("pageId") as string;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const key = `uploads/${Date.now()}-${file.name}`;
    
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const imageUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

    // Store in database
    const [content] = await db.insert(contents).values({
      type: "image",
      mediaUrl: imageUrl,
      metadata: JSON.stringify({
        originalName: file.name,
        size: file.size,
        type: file.type
      })
    }).returning();

    return NextResponse.json({ 
      url: imageUrl,
      contentId: content.id
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}