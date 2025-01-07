import { contents, pageContents, pages } from "@/db/schema";
import { db } from "@/lib/db";
import { CanvasElementSchema } from "@/lib/types";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

const requestSchema = z.object({
  elements: CanvasElementSchema.array(),
  editId: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { elements, editId } = requestSchema.parse(body);

    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.editId, editId))
      .limit(1);

    if (!page) {
      return NextResponse.json(
        { error: "Page not found for given editId" },
        { status: 404 }
      );
    }

    // Prepare batch values
    const contentValues = elements.map((element) => ({
      id: element.contentId,
      type: element.type,
      content: element.content,
      mediaUrl: element.url,
      metadata: JSON.stringify({}),
    }));

    const pageContentValues = elements.map((element) => ({
      pageId: page.id,
      editId: editId,
      id: element.id,
      contentId: element.contentId,
      x: element.position.x,
      y: element.position.y,
      z: element.position.z,
      width: element.width,
      height: element.height,
    }));

    // Upsert contents
    await db
      .insert(contents)
      .values(contentValues)
      .onConflictDoUpdate({
        target: contents.id,
        set: {
          type: sql`excluded.type`,
          content: sql`excluded.content`,
          mediaUrl: sql`excluded.media_url`,
        },
      });

    // Upsert page contents
    await db
      .insert(pageContents)
      .values(pageContentValues)
      .onConflictDoUpdate({
        target: [pageContents.pageId, pageContents.contentId],
        set: {
          x: sql`excluded.x`,
          y: sql`excluded.y`,
          z: sql`excluded.z`,
          width: sql`excluded.width`,
          height: sql`excluded.height`,
        },
      });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error saving page:", error);
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
}
