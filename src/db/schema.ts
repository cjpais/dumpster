import { desc, sql } from "drizzle-orm";
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
    title: text("title"),
    description: text("description"),
    backgroundColor: text("background_color"),
  },
  (table) => [
    uniqueIndex("slug_idx").on(table.slug),
    uniqueIndex("edit_id_idx").on(table.editId),
  ]
);
