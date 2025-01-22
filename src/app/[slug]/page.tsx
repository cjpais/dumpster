import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import React from "react";
import "tldraw/tldraw.css";
import StaticTldrawCanvas from "./StaticTldrawCanvas";

const getPageBySlug = async (slug: string) => {
  const result = await db.select().from(pages).where(eq(pages.slug, slug));

  if (result.length === 0) {
    return null;
  }

  return result[0];
};

const getSnapshotByEditId = async (editId: string) => {
  const result = (
    await fetch(
      `${process.env.NEXT_PUBLIC_TLDRAW_WORKER_URL}/snapshot/${editId}`
    )
  ).json();
  return result;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const roomId = params.slug;
  const page = await getPageBySlug(roomId);

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    title: `${page.slug}`,
    description: `${page.slug}`,
  };
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const page = await getPageBySlug(slug);

  if (!page) {
    return <div>Page not found</div>;
  }

  const snapshot = await getSnapshotByEditId(page.editId);

  console.log(snapshot);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <StaticTldrawCanvas snapshot={snapshot} />
    </div>
  );
};

export default Page;
