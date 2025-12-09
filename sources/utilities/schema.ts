import { z } from "@/core/models";

export const NullResponse = z.null().openapi({
  example: null,
});

export const EmptyResponse = z.object({}).openapi({
  example: [],
});
