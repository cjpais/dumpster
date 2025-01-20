import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import React from "react";
import "tldraw/tldraw.css";
import StaticTldrawCanvas from "./StaticTldrawCanvas";

const getEditIdBySlug = async (slug: string) => {
  const result = await db
    .select({
      id: pages.id,
      editId: pages.editId,
    })
    .from(pages)
    .where(eq(pages.slug, slug));

  if (result.length === 0) {
    return null;
  }

  return result[0].editId;
};

const getSnapshotByEditId = async (editId: string) => {
  const result = (
    await fetch(
      `${process.env.NEXT_PUBLIC_TLDRAW_WORKER_URL}/snapshot/${editId}`
    )
  ).json();
  return result;
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const pageId = await getEditIdBySlug(slug);

  if (!pageId) {
    return <div>Page not found</div>;
  }

  const snapshot = await getSnapshotByEditId(pageId);

  console.log(snapshot);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <StaticTldrawCanvas snapshot={snapshot} />
    </div>
  );
};

export default Page;
