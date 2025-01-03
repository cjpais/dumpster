import { sql } from "drizzle-orm";
import {
  integer,
  text,
  sqliteTable,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// Table for web pages
export const pages = sqliteTable(
  "pages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    editId: text("edit_id").notNull(), // UUID for editing
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    // Changed from object to array syntax
    uniqueIndex("slug_idx").on(table.slug),
    uniqueIndex("edit_id_idx").on(table.editId),
  ]
);

// Table for reusable content
export const contents = sqliteTable("contents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", {
    enum: ["image", "video", "audio", "text", "html"],
  }).notNull(),
  content: text("content"), // For text/HTML content
  mediaUrl: text("media_url"), // For media content (R2 URL)
  metadata: text("metadata"), // JSON string for arbitrary metadata
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Junction table for pages and content
export const pageContents = sqliteTable(
  "page_contents",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pageId: integer("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    contentId: integer("content_id")
      .notNull()
      .references(() => contents.id, { onDelete: "cascade" }),
    positionX: integer("position_x").notNull(),
    positionY: integer("position_y").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    // Adding indexes for foreign keys for better performance
    index("page_content_page_id_idx").on(table.pageId),
    index("page_content_content_id_idx").on(table.contentId),
  ]
);
