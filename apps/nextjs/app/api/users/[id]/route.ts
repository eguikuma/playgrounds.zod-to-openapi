import type { Request, RequestPath } from "@/utilities";
import { db, response } from "@/utilities";
import {
  DeleteUserPathParameter,
  DeleteUserResponse,
  GetUserPathParameter,
  GetUserResponse,
  PatchUserBody,
  PatchUserPathParameter,
  PatchUserResponse,
} from "./_schema";

export const GET = async (
  _request: Request,
  { params }: RequestPath<GetUserPathParameter>,
) => {
  const id = Number((await params).id);

  if (!id) {
    return response.badRequest();
  }

  const user = await db.user.findUnique({ where: { id } });

  if (!user) {
    return response.notFound();
  }

  return response.ok<GetUserResponse>(user);
};

export const PATCH = async (
  request: Request,
  { params }: RequestPath<PatchUserPathParameter>,
) => {
  const id = Number((await params).id);

  if (!id) {
    return response.badRequest();
  }

  const user = await db.user.findUnique({ where: { id } });

  if (!user) {
    return response.notFound();
  }

  const body = await response.body<PatchUserBody>(request);

  if (!body) {
    return response.badRequest();
  }

  const { success, data, error } = PatchUserBody.safeParse(body);

  if (!success) {
    return response.unprocessableEntity(error);
  }

  return response.ok<PatchUserResponse>(
    await db.user.update({ where: { id }, data }),
  );
};

export const DELETE = async (
  _request: Request,
  { params }: RequestPath<DeleteUserPathParameter>,
) => {
  const id = Number((await params).id);

  if (!id) {
    return response.badRequest();
  }

  const user = await db.user.findUnique({ where: { id } });

  if (!user) {
    return response.notFound();
  }

  return response.ok<DeleteUserResponse>(
    await db.user.delete({ where: { id } }),
  );
};
