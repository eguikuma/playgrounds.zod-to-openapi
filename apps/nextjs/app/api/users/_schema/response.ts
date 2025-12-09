import { User } from "@/features/users";
import { z } from "zodocs";

export const GetUsersResponse = z.array(User).openapi({
  example: [
    {
      id: 1,
      name: "佐藤 太郎",
    },
    {
      id: 2,
      name: "佐藤 次郎",
    },
    {
      id: 3,
      name: "佐藤 三郎",
    },
  ],
});
export type GetUsersResponse = z.infer<typeof GetUsersResponse>;

export const PostUserResponse = User.openapi({
  example: {
    id: 1,
    name: "佐藤 太郎",
  },
});
export type PostUserResponse = z.infer<typeof PostUserResponse>;
