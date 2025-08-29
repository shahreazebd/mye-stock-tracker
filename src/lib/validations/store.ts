import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  url: z.string().url("Please enter a valid URL"),
  platform: z.string().cuid(),
  description: z.string().optional(),
});

export type StoreFormData = z.infer<typeof storeSchema>;
