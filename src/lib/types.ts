// types.ts
import { z } from "zod";

export const UploadMetadataSchema = z.object({
  editId: z.string(),
  position: z
    .object({
      x: z.number().nullable(),
      y: z.number().nullable(),
    })
    .nullable(),
});

export type UploadMetadata = z.infer<typeof UploadMetadataSchema>;
