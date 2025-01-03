import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { pages } from "@/db/schema";
import CreatePageForm from "@/components/CreatePageForm";

async function checkSlug(slug: string) {
  "use server";

  const existingPage = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, slug))
    .get();

  return !existingPage;
}

async function createPage(slug: string) {
  "use server";

  try {
    const editId = uuidv4();
    await db.insert(pages).values({
      slug,
      editId,
    });

    return {
      success: true,
      editId,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to create page",
    };
  }
}

export default function Create() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Create a New Page
          </h1>
          <CreatePageForm checkSlug={checkSlug} createPage={createPage} />
        </div>
      </div>
    </div>
  );
}
