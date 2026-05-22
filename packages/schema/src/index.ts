import { z } from "zod";

export const helloSchema = z.object({
  name: z.string().min(1)
});

export type Hello = z.infer<typeof helloSchema>;
