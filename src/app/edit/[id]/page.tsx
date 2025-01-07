import React, { ElementType } from "react";
import EditCanvas from "./EditCanvas";
import UploadFile from "./UploadFile";
import Toolbar from "./Toolbar";
import CanvasProvider from "./CanvasProvider";

import { eq } from "drizzle-orm";
import { contents, pageContents } from "@/db/schema";
import { db } from "@/lib/db";
import { CanvasElement } from "@/lib/types";

async function getPageContentsByEditId(
  editId: string
): Promise<CanvasElement[]> {
  try {
    const result = await db
      .select({
        content: {
          id: contents.id,
          type: contents.type,
          content: contents.content,
          mediaUrl: contents.mediaUrl,
          metadata: contents.metadata,
          createdAt: contents.createdAt,
        },
        placement: {
          id: pageContents.id,
          x: pageContents.x,
          y: pageContents.y,
          z: pageContents.z,
          width: pageContents.width,
          height: pageContents.height,
        },
      })
      .from(pageContents)
      .innerJoin(contents, eq(pageContents.contentId, contents.id))
      .where(eq(pageContents.editId, editId));

    if (!result.length) {
      return [];
    }

    // Transform the result into CanvasElement[]
    const canvasElements: CanvasElement[] = result.map((row) => {
      return {
        id: row.placement.id,
        contentId: row.content.id,
        type: row.content.type,
        content: row.content.content || undefined,
        url: row.content.mediaUrl || undefined,
        position: {
          x: row.placement.x ?? 0, // Default to 0 if null
          y: row.placement.y ?? 0, // Default to 0 if null
          z: row.placement.z ?? 0, // Default to 0 if null
        },
        width: row?.placement?.width || 100,
        height: row?.placement?.height || 100,
        isSelected: false,
        isEditing: false,
      };
    });

    return canvasElements;
  } catch (error) {
    console.error("Error fetching page contents:", error);
    throw error;
  }
}

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const contents = await getPageContentsByEditId(id);

  console.log("Contents:", contents);
  return (
    <CanvasProvider data={contents}>
      <UploadFile page={id} />
      <EditCanvas />
      <Toolbar editId={id} />
    </CanvasProvider>
  );
};

export default EditPage;
