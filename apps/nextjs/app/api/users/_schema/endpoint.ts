import { HttpStatus } from "@/utilities";

import { GetUsersQueryParameter, PostUserBody } from "./request";
import { GetUsersResponse, PostUserResponse } from "./response";
import { Tags } from "@/zodocs.config";
import { zodocs } from "zodocs";

zodocs.generator.get({
  name: "/users",
  summary: "ユーザー一覧を取得する",
  description: "ページネーションされたユーザー一覧を取得する",
  operationName: "get-users",
  tags: [Tags.User],
  request: {
    parameters: {
      query: {
        schema: GetUsersQueryParameter,
      },
    },
  },
  response: {
    [HttpStatus.Ok]: {
      schema: GetUsersResponse,
    },
  },
});

zodocs.generator.post({
  name: "/users",
  summary: "ユーザーを作成する",
  description: "新規にユーザーを作成する",
  operationName: "post-user",
  tags: [Tags.User],
  request: {
    body: {
      schema: PostUserBody,
    },
  },
  response: {
    [HttpStatus.Ok]: {
      schema: PostUserResponse,
    },
  },
});
