import { sql } from "drizzle-orm";
import {
  integer,
  text,
  sqliteTable,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const pages = sqliteTable(
  "pages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    editId: text("edit_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("slug_idx").on(table.slug),
    uniqueIndex("edit_id_idx").on(table.editId),
  ]
);

export const contents = sqliteTable("contents", {
  id: text("id").primaryKey().notNull(),
  type: text("type", {
    enum: ["image", "video", "audio", "text", "html"],
  }).notNull(),
  content: text("content"),
  mediaUrl: text("media_url"),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Combined table for library and placement
export const pageContents = sqliteTable(
  "page_contents",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pageId: integer("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    contentId: text("content_id")
      .notNull()
      .references(() => contents.id, { onDelete: "cascade" }),
    positionX: integer("position_x"),
    positionY: integer("position_y"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("page_contents_page_id_idx").on(table.pageId),
    index("page_contents_content_id_idx").on(table.contentId),
    uniqueIndex("page_content_unique_idx").on(table.pageId, table.contentId),
  ]
);
