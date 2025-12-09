import { z } from "zodocs";

export const User = z.object({
  id: z.number(),
  name: z.string(),
});
export type User = z.infer<typeof User>;
