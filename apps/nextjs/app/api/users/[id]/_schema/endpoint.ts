import { HttpStatus } from "@/utilities";

import {
  DeleteUserPathParameter,
  GetUserPathParameter,
  PatchUserBody,
  PatchUserPathParameter,
} from "./request";
import {
  DeleteUserResponse,
  GetUserResponse,
  PatchUserResponse,
} from "./response";
import { zodocs } from "zodocs";
import { Tags } from "@/zodocs.config";

zodocs.generator.get({
  name: "/users/{id}",
  summary: "ユーザーを取得する",
  description: "指定されたIDと紐づくユーザーを取得する",
  operationName: "get-user",
  tags: [Tags.User],
  request: {
    parameters: {
      path: {
        schema: GetUserPathParameter,
      },
    },
  },
  response: {
    [HttpStatus.Ok]: {
      schema: GetUserResponse,
    },
  },
});

zodocs.generator.patch({
  name: "/users/{id}",
  summary: "ユーザーを更新する",
  description: "指定されたIDと紐づくユーザーを更新する",
  operationName: "patch-user",
  tags: [Tags.User],
  request: {
    parameters: {
      path: {
        schema: PatchUserPathParameter,
      },
    },
    body: {
      schema: PatchUserBody,
    },
  },
  response: {
    [HttpStatus.Ok]: {
      schema: PatchUserResponse,
    },
  },
});

zodocs.generator.delete({
  name: "/users/{id}",
  summary: "ユーザーを削除する",
  description: "指定されたIDと紐づくユーザーを削除する",
  operationName: "deleteUser",
  tags: [Tags.User],
  request: {
    parameters: {
      path: {
        schema: DeleteUserPathParameter,
      },
    },
  },
  response: {
    [HttpStatus.Ok]: {
      schema: DeleteUserResponse,
    },
  },
});
