import { z } from "zodocs";

export const GetUserPathParameter = z.object({
  id: z.number().describe("ユーザーID").openapi({
    example: 1,
  }),
});
export type GetUserPathParameter = z.infer<typeof GetUserPathParameter>;

export const PatchUserPathParameter = z.object({
  id: z.number().describe("ユーザーID").openapi({
    example: 1,
  }),
});
export type PatchUserPathParameter = z.infer<typeof PatchUserPathParameter>;
export const PatchUserBody = z
  .object({
    name: z
      .string()
      .max(100, "名前は100文字以内で入力してください")
      .describe("名前"),
  })
  .openapi({
    example: {
      name: "田中 太郎",
    },
  });
export type PatchUserBody = z.infer<typeof PatchUserBody>;

export const DeleteUserPathParameter = z.object({
  id: z.number().describe("ユーザーID").openapi({
    example: 1,
  }),
});
export type DeleteUserPathParameter = z.infer<typeof DeleteUserPathParameter>;
