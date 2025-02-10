import React from "react";
import TldrawCanvas from "@/app/edit/[id]/TldrawCanvas";
import "tldraw/tldraw.css";
import LocalPageProvider from "@/app/edit/[id]/LocalPageProvider";
import { db } from "@/lib/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LocalPage } from "@/lib/types";
import { redirect } from "next/navigation";

const getPageFromSlugAndKey = async (
  slug: string,
  key: string
): Promise<null | LocalPage> => {
  const result = await db
    .select({
      id: pages.id,
      editId: pages.editId,
      slug: pages.slug,
    })
    .from(pages)
    .where(eq(pages.slug, slug))
    .limit(1)
    .get();

  if (!result || result.editId !== key) {
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

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const key = searchParams.key;

  if (!key) {
    return { notFound: true };
  }

  const page = await getPageFromSlugAndKey(slug, key);

  if (!page) {
    return { notFound: true };
  }

  return {
    title: `Edit ${page.slug}`,
    description: `Edit ${page.slug}`,
  };
}

const Page = async (props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) => {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const key = searchParams.key;

  if (!key) {
    return <div>Missing edit key</div>;
  }

  const page = await getPageFromSlugAndKey(slug, key);

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
      }}
    >
      <LocalPageProvider page={page}>
        <TldrawCanvas roomId={key} />
      </LocalPageProvider>
    </div>
  );
};

export default Page;
