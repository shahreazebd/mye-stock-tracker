import { z } from "zod";

export const platformSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Platform name is required"),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export type PlatformFormData = z.infer<typeof platformSchema>;
