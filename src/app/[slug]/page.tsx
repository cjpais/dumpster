import {
  CanvasElement,
  CanvasElementSchema,
  CanvasPositionSchema,
  ElementTypeSchema,
} from "@/lib/types";
import { contents, pageContents, pages } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import React from "react";
import StaticBlocks from "./StaticBlocks";

async function getPageContentsBySlug(slug: string) {
  const result = await db
    .select({
      page: {
        id: pages.id,
        slug: pages.slug,
        createdAt: pages.createdAt,
        updatedAt: pages.updatedAt,
      },
      content: {
        id: contents.id,
        type: contents.type,
        content: contents.content,
        mediaUrl: contents.mediaUrl,
        metadata: contents.metadata,
        createdAt: contents.createdAt,
      },
      pageContent: {
        id: pageContents.id,
        x: pageContents.x,
        y: pageContents.y,
        z: pageContents.z,
        width: pageContents.width,
        height: pageContents.height,
        createdAt: pageContents.createdAt,
      },
    })
    .from(pages)
    .leftJoin(pageContents, eq(pages.id, pageContents.pageId))
    .leftJoin(contents, eq(pageContents.contentId, contents.id))
    .where(eq(pages.slug, slug));

  if (result.length === 0) {
    return null;
  }

  const page = result[0].page;
  const pageContentsData = result
    .filter((row) => row.content !== null && row.pageContent !== null)
    .map((row) => ({
      id: row.pageContent!.id,
      contentId: row.content!.id,
      type: row.content!.type,
      content: row.content!.content,
      url: row.content!.mediaUrl,
      position: {
        x: row.pageContent!.x,
        y: row.pageContent!.y,
        z: row.pageContent!.z,
      },
      width: row.pageContent!.width,
      height: row.pageContent!.height,
      isSelected: false,
      isEditing: false,
    }));

  return {
    page,
    contents: CanvasElementSchema.array().parse(pageContentsData),
  };
}

const ItemComponent = ({ element }: { element: CanvasElement }) => {
  const style = {
    "--x": `${element.position.x}px`,
    "--y": `${element.position.y}px`,
  } as React.CSSProperties;

  return (
    <div className="draggable-item" style={style}>
      <StaticBlocks canvasElement={element} />
    </div>
  );
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const page = await getPageContentsBySlug(slug);

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute left-1/2 h-full w-[1px] bg-gray-300" />
      <div className="absolute mx-auto min-h-screen">
        {page.contents.map((item) => (
          <ItemComponent key={item.id} element={item} />
        ))}
      </div>
    </div>
  );
};

export default Page;
