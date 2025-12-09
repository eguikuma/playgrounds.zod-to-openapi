import type { HttpStatus } from "@/utilities/http";

import type { RouteConfig } from "@asteasolutions/zod-to-openapi";
import type {
  ZodMediaType,
  ZodMediaTypeObject,
} from "@asteasolutions/zod-to-openapi/dist/openapi-registry";
import type {
  OpenApiGeneratorV3,
  OpenAPIObjectConfig,
} from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
import type { RequireAtLeastOne } from "type-fest";
import type { ZodArray, ZodNull, ZodObject, ZodRawShape } from "zod";

export type ZodocsArgs = {
  name: RouteConfig["path"];
  media?: ZodMediaType;
  summary: string;
  description: string;
  operationName: string;
  tags: ZodocsTags[keyof ZodocsTags][];
  request?: {
    body?: {
      schema: ZodMediaTypeObject["schema"];
      description?: string;
      encoding?: ZodMediaTypeObject["encoding"];
    };
    parameters?: {
      path?: {
        schema: ZodObject<ZodRawShape>;
      };
      query?: {
        schema: ZodObject<ZodRawShape>;
      };
    };
  };
  response: RequireAtLeastOne<{
    [key in HttpStatus]: {
      schema:
        | ZodObject<ZodRawShape>
        | ZodArray<ZodObject<ZodRawShape>>
        | ZodNull;
      description?: string;
      encoding?: ZodMediaTypeObject["encoding"];
    };
  }>;
};

export type ZodocsMethods = {
  generator: {
    get(args: ZodocsArgs): void;
    post(args: ZodocsArgs): void;
    put(args: ZodocsArgs): void;
    patch(args: ZodocsArgs): void;
    delete(args: ZodocsArgs): void;
  };
  generate(
    config: ZodocsConfig,
  ): ReturnType<OpenApiGeneratorV3["generateDocument"]>;
};

export type ZodocsConfig = {
  version: string;
  title: string;
  description: string;
  servers: OpenAPIObjectConfig["servers"];
  input?: {
    directories?: string[];
    endpointFileName?: string;
    requestFileName?: string;
    responseFileName?: string;
    tags?: ZodocsTags;
  };
  output?: {
    directory?: string;
    fileName?: string;
  };
};

export type ZodocsTags = Record<
  string,
  NonNullable<OpenAPIObjectConfig["tags"]>[number]
>;
