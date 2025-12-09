import { z } from "zodocs";

export const GetUsersQueryParameter = z.object({
  page: z.number().describe("ページ番号").openapi({
    example: 1,
  }),
  limit: z.number().describe("取得件数").openapi({
    example: 10,
  }),
});
export type GetUsersQueryParameter = z.infer<typeof GetUsersQueryParameter>;

export const PostUserBody = z
  .object({
    name: z
      .string()
      .max(100, "名前は100文字以内で入力してください")
      .describe("名前"),
  })
  .openapi({
    example: {
      name: "佐藤 太郎",
    },
  });
export type PostUserBody = z.infer<typeof PostUserBody>;
