import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { camelCase, flow, upperFirst } from "es-toolkit";
import * as z from "zod";

import { DESCRIPTION_NEW_LINE, toDescription } from "@/utilities/formatter";
import { HttpMethod } from "@/utilities/http";

import type { ZodocsArgs, ZodocsConfig, ZodocsMethods } from "../definitions";
import type {
  ZodMediaTypeObject,
  ZodOpenAPIMetadata,
} from "@asteasolutions/zod-to-openapi";
import type { ZodObject, ZodRawShape, ZodTypeAny } from "zod";

declare const global: { zodocs?: Zodocs };

class Zodocs implements ZodocsMethods {
  private static state: OpenAPIRegistry;

  private constructor() {}

  static get() {
    if (!global.zodocs) {
      global.zodocs = new Zodocs();

      Zodocs.state = new OpenAPIRegistry();
    }

    return global.zodocs!;
  }

  get generator() {
    return {
      get: (args: ZodocsArgs) => this.add({ method: HttpMethod.Get, ...args }),
      post: (args: ZodocsArgs) =>
        this.add({ method: HttpMethod.Post, ...args }),
      put: (args: ZodocsArgs) => this.add({ method: HttpMethod.Put, ...args }),
      patch: (args: ZodocsArgs) =>
        this.add({ method: HttpMethod.Patch, ...args }),
      delete: (args: ZodocsArgs) =>
        this.add({ method: HttpMethod.Delete, ...args }),
    };
  }

  generate(config: ZodocsConfig) {
    const generator = new OpenApiGeneratorV3(Zodocs.state.definitions);

    const document = generator.generateDocument({
      openapi: "3.0.0",
      info: {
        version: config.version,
        title: config.title,
        ...(config.description
          ? { description: toDescription(config.description) }
          : {}),
      },
      ...(config.servers ? { servers: config.servers } : {}),
      tags: config.input?.tags ? Object.values(config.input.tags) : [],
    });

    return document;
  }

  private add({
    media = "application/json",
    ...args
  }: ZodocsArgs & {
    method: HttpMethod;
  }) {
    this.schemas({
      operationName: args.operationName,
      request: args.request,
      response: args.response,
    });

    Zodocs.state.registerPath({
      method: args.method,
      path: args.name,
      operationId: args.operationName,
      tags: Object.values(args.tags).map(({ name }) => name),
      ...(args.description
        ? { description: toDescription(args.description) }
        : {}),
      ...(args.summary ? { summary: args.summary } : {}),
      ...(args.request
        ? {
            request: {
              ...(args.request.parameters?.path
                ? {
                    params: args.request.parameters.path.schema,
                  }
                : {}),
              ...(args.request.parameters?.query
                ? {
                    query: args.request.parameters.query.schema,
                  }
                : {}),
              ...(args.request.body
                ? {
                    body: {
                      ...(args.request.body.description
                        ? {
                            description: toDescription(
                              args.request.body.description,
                            ),
                          }
                        : {}),
                      content: {
                        [media]: {
                          schema: args.request.body.schema,
                          ...(args.request.body.encoding
                            ? { encoding: args.request.body.encoding }
                            : {}),
                        },
                      },
                    },
                  }
                : {}),
            },
          }
        : {}),
      responses: Object.entries(args.response).reduce(
        (response, [status, args]) => ({
          ...response,
          [status]: {
            description: args.description
              ? toDescription(args.description)
              : status,
            content: {
              [media]: {
                schema: args.schema,
                ...(args.encoding ? { encoding: args.encoding } : {}),
              },
            },
          },
        }),
        {},
      ),
    });
  }

  private schemas({
    operationName,
    request,
    response,
  }: {
    operationName: string;
    request: ZodocsArgs["request"];
    response: ZodocsArgs["response"];
  }) {
    const add = ({
      name,
      schema,
    }: {
      name: string;
      schema: ZodObject<ZodRawShape> | ZodMediaTypeObject["schema"];
    }) => {
      Zodocs.state.register(name, schema as ZodTypeAny);
    };

    const baseOperationName = flow(camelCase, upperFirst)(operationName);

    if (request) {
      if (request.body) {
        add({
          name: `📦 ${baseOperationName}Body`,
          schema: request.body.schema,
        });
      }
      if (request.parameters && request.parameters.path) {
        add({
          name: `🛤️ ${baseOperationName}Path`,
          schema: request.parameters.path.schema,
        });
      }
      if (request.parameters && request.parameters.query) {
        add({
          name: `🔍 ${baseOperationName}Query`,
          schema: request.parameters.query.schema,
        });
      }
    }

    Object.entries(response).forEach(([status, { schema }]) => {
      add({
        name: `💬 ${baseOperationName}Response ${status}`,
        schema,
      });
    });
  }
}

extendZodWithOpenApi(z.z);

const describe = z.ZodType.prototype.describe;
z.ZodType.prototype.describe = function (description: string) {
  return describe.call(
    this,
    toDescription(description) +
      "\n" +
      DESCRIPTION_NEW_LINE +
      DESCRIPTION_NEW_LINE,
  );
};

const openapi = z.ZodType.prototype.openapi;
z.ZodType.prototype.openapi = function <T extends z.ZodTypeAny>(
  this: T,
  _args1: string | Partial<ZodOpenAPIMetadata<z.input<T>>>,
  _args2?: Partial<ZodOpenAPIMetadata<z.input<T>>>,
) {
  if (typeof _args1 === "string") {
    return openapi.call(this, _args1, _args2);
  } else {
    /**
     * We need to convert 'examples' to 'example' to conform to the spec.
     *
     * responses:
     *   "200":
     *     description: "200"
     *     content:
     *       application/json:
     *         schema:
     *           type: object
     *           properties:
     *             id:
     *               type: number
     *             name:
     *               type: string
     *           required:
     *             - id
     *             - name
     *           examples: *a5 <<< Property examples is not allowed.
     */
    const { examples, ...args1 } = _args1;

    return openapi.call(
      this,
      {
        ...args1,
        ...(examples ? { example: examples } : {}),
      } as unknown as string,
      _args2,
    );
  }
};

export { z };

export const zodocs = Zodocs.get();
