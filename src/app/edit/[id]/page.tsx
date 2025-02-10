import React from "react";
import TldrawCanvas from "./TldrawCanvas";
import "tldraw/tldraw.css";
import LocalPageProvider from "./LocalPageProvider";
import { db } from "@/lib/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LocalPage } from "@/lib/types";
import { redirect } from "next/navigation";

const getPageFromEditId = async (editId: string) => {
  const result = await db
    .select({
      slug: pages.slug,
      editId: pages.editId,
    })
    .from(pages)
    .where(eq(pages.editId, editId))
    .limit(1)
    .get();

  return result;
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const page = await getPageFromEditId(id);

  if (!page) {
    return <div>Page not found</div>;
  }

  redirect(`/${page.slug}/edit?key=${page.editId}`);
};

export default Page;
