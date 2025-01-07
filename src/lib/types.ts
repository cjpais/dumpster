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

export type CanvasPosition = {
  x: number;
  y: number;
  z: number;
};

export type ElementType = "image" | "video" | "audio" | "text" | "html";

export type CanvasElement = {
  id: string;
  type: ElementType;
  content?: string;
  url?: string;
  position: CanvasPosition;
  width: number;
  height: number;
  isSelected: boolean;
  isEditing: boolean;
};
