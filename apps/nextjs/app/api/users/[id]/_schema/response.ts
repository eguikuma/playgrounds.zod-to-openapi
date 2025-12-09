import { User } from "@/features/users";
import { z } from "zodocs";

export const GetUserResponse = User.openapi({
  example: {
    id: 1,
    name: "佐藤 太郎",
  },
});
export type GetUserResponse = z.infer<typeof GetUserResponse>;

export const PatchUserResponse = z
  .object({
    id: z.number().describe("ユーザーID"),
    name: z.string().describe("名前"),
  })
  .openapi({
    example: {
      id: 1,
      name: "田中 太郎",
    },
  });
export type PatchUserResponse = z.infer<typeof PatchUserResponse>;

export const DeleteUserResponse = User.openapi({
  example: {
    id: 1,
    name: "佐藤 太郎",
  },
});
export type DeleteUserResponse = z.infer<typeof DeleteUserResponse>;
