import type { Request } from "@/utilities";
import { db, response } from "@/utilities";

import { PostUserBody } from "./_schema";

import type {
  GetUsersQueryParameter,
  GetUsersResponse,
  PostUserResponse,
} from "./_schema";

export const GET = async (request: Request<GetUsersQueryParameter>) => {
  const queries = {
    page: request.nextUrl.searchParams.has("page")
      ? Number(request.nextUrl.searchParams.get("page"))
      : 1,
    limit: request.nextUrl.searchParams.has("limit")
      ? Number(request.nextUrl.searchParams.get("limit"))
      : 10,
  };

  return response.ok<GetUsersResponse>(
    await db.user.findMany({
      skip: (queries.page - 1) * queries.limit,
      take: queries.limit,
    }),
  );
};

export const POST = async (request: Request) => {
  const body = await response.body<PostUserBody>(request);

  if (!body) {
    return response.badRequest();
  }

  const { success, data, error } = PostUserBody.safeParse(body);

  if (!success) {
    return response.unprocessableEntity(error);
  }

  return response.ok<PostUserResponse>(await db.user.create({ data }));
};
