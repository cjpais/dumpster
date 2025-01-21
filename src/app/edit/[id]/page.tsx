import React from "react";
import TldrawCanvas from "./TldrawCanvas";
import "tldraw/tldraw.css";
import LocalPageProvider from "./LocalPageProvider";
import { db } from "@/lib/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LocalPage } from "@/lib/types";

const getPageFromEditId = async (editId: string): Promise<null | LocalPage> => {
  const result = await db
    .select({
      id: pages.id,
      editId: pages.editId,
      slug: pages.slug,
    })
    .from(pages)
    .where(eq(pages.editId, editId))
    .limit(1)
    .get();

  if (!result) {
    return null;
  }

  const page: LocalPage = {
    id: result.id,
    editId: result.editId,
    slug: result.slug,
    lastVisited: Date.now(),
  };

  return page;
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const roomId = (await params).id;
  const page = await getPageFromEditId(roomId);

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <LocalPageProvider page={page}>
        <TldrawCanvas roomId={roomId} />
      </LocalPageProvider>
    </div>
  );
};

export default Page;
