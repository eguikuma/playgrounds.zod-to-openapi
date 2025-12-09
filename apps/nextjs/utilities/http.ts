import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ErrorFormat, toErrors } from "./error";
import { hasProperty } from "./helpers";

import type { NextRequest } from "next/server";
import type { ScreamingSnakeCase } from "type-fest";

const HttpSuccessStatus = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
} as const;
export type HttpSuccessStatus =
  (typeof HttpSuccessStatus)[keyof typeof HttpSuccessStatus];

export const HttpSuccessCode = {
  [HttpSuccessStatus.Ok]: "OK",
  [HttpSuccessStatus.Created]: "CREATED",
  [HttpSuccessStatus.NoContent]: "NO_CONTENT",
} as const satisfies Record<
  HttpSuccessStatus,
  ScreamingSnakeCase<keyof typeof HttpSuccessStatus>
>;
export type HttpSuccessCode =
  (typeof HttpSuccessCode)[keyof typeof HttpSuccessCode];

const HttpFailureStatus = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  Conflict: 409,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
} as const;
export type HttpFailureStatus =
  (typeof HttpFailureStatus)[keyof typeof HttpFailureStatus];

export const HttpFailureCode = {
  [HttpFailureStatus.BadRequest]: "BAD_REQUEST",
  [HttpFailureStatus.Unauthorized]: "UNAUTHORIZED",
  [HttpFailureStatus.Forbidden]: "FORBIDDEN",
  [HttpFailureStatus.NotFound]: "NOT_FOUND",
  [HttpFailureStatus.MethodNotAllowed]: "METHOD_NOT_ALLOWED",
  [HttpFailureStatus.Conflict]: "CONFLICT",
  [HttpFailureStatus.UnprocessableEntity]: "UNPROCESSABLE_ENTITY",
  [HttpFailureStatus.TooManyRequests]: "TOO_MANY_REQUESTS",
  [HttpFailureStatus.InternalServerError]: "INTERNAL_SERVER_ERROR",
} as const satisfies Record<
  HttpFailureStatus,
  ScreamingSnakeCase<keyof typeof HttpFailureStatus>
>;
export type HttpFailureCode =
  (typeof HttpFailureCode)[keyof typeof HttpFailureCode];

export const HttpStatus = {
  ...HttpSuccessStatus,
  ...HttpFailureStatus,
} as const;
export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];

export const HttpCode = {
  ...HttpSuccessCode,
  ...HttpFailureCode,
} as const;
export type HttpCode = (typeof HttpCode)[keyof typeof HttpCode];

export type Request<QueryParameters extends object | string = object> = Omit<
  NextRequest,
  "nextUrl"
> & {
  nextUrl: {
    searchParams: Omit<URLSearchParams, "has" | "get" | "getAll"> & {
      has(
        name: QueryParameters extends string
          ? QueryParameters
          : keyof QueryParameters,
      ): boolean;
      get(
        name: QueryParameters extends string
          ? QueryParameters
          : keyof QueryParameters,
      ): string | null;
      getAll(
        name: QueryParameters extends string
          ? QueryParameters
          : keyof QueryParameters,
      ): string[];
    };
  };
};

export type RequestPath<T extends object> = {
  params: Promise<Partial<{ [K in keyof T]: string }>>;
};

const toBody = async <T extends object>(
  request: Request,
): Promise<
  | (T & {
      has(name: keyof T): boolean;
    })
  | null
> => {
  try {
    const body: T = await request.json();
    return {
      ...body,
      has: (name: keyof T) => hasProperty(body, name),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

const toSuccess = (status: HttpSuccessStatus) => {
  return <T>(data: T, code = HttpSuccessCode[status]) =>
    NextResponse.json({ status, code, data, success: true });
};

const toFailure = (status: HttpFailureStatus) => {
  return <T extends object = object>(
    error:
      | ZodError<T>
      | string
      | string[]
      | Record<string, unknown>
      | object
      | null = null,
    code = HttpFailureCode[status],
  ) => {
    let messages;

    if (typeof error === "string") {
      messages = { 0: error };
    } else if (Array.isArray(error)) {
      messages = error.reduce(
        (acc, message, index) => ({ ...acc, [index]: message }),
        {},
      );
    } else if (error instanceof ZodError) {
      messages = toErrors(error, ErrorFormat.UNIQUE);
    } else {
      messages = error;
    }

    return NextResponse.json(
      { status, code, messages, success: false },
      { status },
    );
  };
};

export const response = {
  body: toBody,
  ok: toSuccess(HttpStatus.Ok),
  created: toSuccess(HttpStatus.Created),
  noContent: toSuccess(HttpStatus.NoContent),
  badRequest: toFailure(HttpStatus.BadRequest),
  unauthorized: toFailure(HttpStatus.Unauthorized),
  forbidden: toFailure(HttpStatus.Forbidden),
  notFound: toFailure(HttpStatus.NotFound),
  methodNotAllowed: toFailure(HttpStatus.MethodNotAllowed),
  conflict: toFailure(HttpStatus.Conflict),
  unprocessableEntity: toFailure(HttpStatus.UnprocessableEntity),
  tooManyRequests: toFailure(HttpStatus.TooManyRequests),
  internalServerError: toFailure(HttpStatus.InternalServerError),
};
