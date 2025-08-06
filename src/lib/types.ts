// types.ts
import { z } from "zod";

export const UploadMetadataSchema = z.object({
  editId: z.string(),
  position: z
    .object({
      x: z.number().nullable(),
      y: z.number().nullable(),
      z: z.number().nullable(),
    })
    .nullable(),
});

export type UploadMetadata = z.infer<typeof UploadMetadataSchema>;

export const CanvasPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export const ElementTypeSchema = z.enum([
  "image",
  "video",
  "audio",
  "text",
  "html",
]);

export const CanvasElementSchema = z.object({
  id: z.string(),
  contentId: z.string(),
  type: ElementTypeSchema,
  content: z.string().optional(),
  url: z.string().optional(),
  position: CanvasPositionSchema,
  width: z.number(),
  height: z.number(),
  isSelected: z.boolean().optional(),
  isEditing: z.boolean().optional(),
});

export type CanvasPosition = z.infer<typeof CanvasPositionSchema>;
export type ElementType = z.infer<typeof ElementTypeSchema>;
export type CanvasElement = z.infer<typeof CanvasElementSchema>;

export interface LocalPage {
  id: number;
  editId?: string;
  slug: string;
  lastVisited: number;
}
