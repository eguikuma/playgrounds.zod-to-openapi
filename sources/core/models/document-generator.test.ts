import { beforeEach, describe, expect, it } from "vitest";

describe("Zodocs", async () => {
  const { zodocs: subject, z } = await import("./document-generator");

  beforeEach(() => {
    // @ts-expect-error: シングルトンインスタンスのクリア
    global.zodocs = undefined;
  });

  describe("generate", () => {
    it("設定内容を反映したOpenAPIドキュメントを生成すること", () => {
      const document = subject.generate({
        version: "2.0.0",
        title: "My Document Title",
        description: "My Document Description",
        servers: [
          {
            url: "http://localhost:9999",
            description: "My Server Description",
            variables: {
              port: {
                enum: ["9999", "8888"],
                default: "9999",
                description: "My Server Port",
              },
            },
          },
        ],
        input: {
          directories: ["my-schema"],
          endpointFileName: "my-endpoint.ts",
          requestFileName: "my-request.ts",
          responseFileName: "my-response.ts",
          tags: {},
        },
        output: {
          directory: "docs",
          fileName: "my-subject.yml",
        },
      });

      expect(document).toEqual({
        openapi: "3.0.0",
        info: {
          version: "2.0.0",
          title: "My Document Title",
          description: "My Document Description",
        },
        servers: [
          {
            url: "http://localhost:9999",
            description: "My Server Description",
            variables: {
              port: {
                enum: ["9999", "8888"],
                default: "9999",
                description: "My Server Port",
              },
            },
          },
        ],
        tags: [],
        paths: {},
        components: {
          parameters: {},
          schemas: {},
        },
      });
    });

    it("登録したエンドポイントに基づいてドキュメントを生成すること", () => {
      subject.generator.get({
        name: "/api/tests",
        summary: "Get Tests Summary",
        description: "Get Tests Description",
        operationName: "getTests",
        tags: [
          {
            name: "Test Tag",
            description: "Test Tag Description",
          },
        ],
        request: {
          parameters: {
            query: {
              schema: z.object({
                name: z.string(),
              }),
            },
          },
        },
        response: {
          200: {
            schema: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
              }),
            ),
          },
          400: {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      });
      subject.generator.get({
        name: "/api/tests/{id}",
        summary: "Get Test Summary",
        description: "Get Test Description",
        operationName: "getTest",
        tags: [
          {
            name: "Test Tag",
            description: "Test Tag Description",
          },
        ],
        request: {
          parameters: {
            path: {
              schema: z.object({
                id: z.string(),
              }),
            },
          },
        },
        response: {
          200: {
            schema: z.object({
              id: z.number(),
              name: z.string(),
            }),
          },
          400: {
            schema: z.object({
              message: z.string(),
            }),
          },
          404: {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      });
      subject.generator.post({
        name: "/api/tests",
        summary: "Post Test Summary",
        description: "Post Test Description",
        operationName: "postTest",
        tags: [
          {
            name: "Test Tag",
            description: "Test Tag Description",
          },
        ],
        request: {
          body: {
            schema: z.object({
              name: z.string(),
            }),
          },
        },
        response: {
          200: {
            schema: z.object({
              id: z.number(),
              name: z.string(),
            }),
          },
          400: {
            schema: z.object({
              message: z.string(),
            }),
          },
          422: {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      });
      subject.generator.put({
        name: "/api/tests/{id}",
        summary: "Put Test Summary",
        description: "Put Test Description",
        operationName: "putTest",
        tags: [
          {
            name: "Test Tag",
            description: "Test Tag Description",
          },
        ],
        request: {
          parameters: {
            path: {
              schema: z.object({
                id: z.string(),
              }),
            },
          },
          body: {
            schema: z.object({
              name: z.string(),
            }),
          },
        },
        response: {
          200: {
            schema: z.object({
              id: z.number(),
              name: z.string(),
            }),
          },
          400: {
            schema: z.object({
              message: z.string(),
            }),
          },
          404: {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      });
      subject.generator.patch({
        name: "/api/tests/{id}",
        summary: "Patch Test Summary",
        description: "Patch Test Description",
        operationName: "patchTest",
        tags: [
          {
            name: "Test Tag",
            description: "Test Tag Description",
          },
        ],
        request: {
          parameters: {
            path: {
              schema: z.object({
                id: z.string(),
              }),
            },
          },
          body: {
            schema: z.object({
              name: z.string(),
            }),
          },
        },
        response: {
          200: {
            schema: z.object({
              id: z.number(),
              name: z.string(),
            }),
          },
          400: {
            schema: z.object({
              message: z.string(),
            }),
          },
          404: {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      });
      subject.generator.delete({
        name: "/api/tests/{id}",
        summary: "Delete Test Summary",
        description: "Delete Test Description",
        operationName: "deleteTest",
        tags: [
          {
            name: "Test Tag",
            description: "Test Tag Description",
          },
        ],
        request: {
          parameters: {
            path: {
              schema: z.object({
                id: z.string(),
              }),
            },
          },
        },
        response: {
          200: {
            schema: z.object({
              id: z.number(),
              name: z.string(),
            }),
          },
          400: {
            schema: z.object({
              message: z.string(),
            }),
          },
          404: {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      });

      const document = subject.generate({
        version: "3.0.0",
        title: "Test Title",
        description: "Test Description",
        servers: [
          {
            url: "http://localhost:9999",
            description: "Test Server Description",
          },
        ],
        input: {
          directories: ["my-schema"],
          endpointFileName: "my-endpoint.ts",
          requestFileName: "my-request.ts",
          responseFileName: "my-response.ts",
          tags: {
            Test: {
              name: "Test Tag",
              description: "Test Tag Description",
            },
          },
        },
        output: {
          directory: "my-docs",
          fileName: "my-docs.yml",
        },
      });

      expect(document).toEqual({
        openapi: "3.0.0",
        info: {
          version: "3.0.0",
          title: "Test Title",
          description: "Test Description",
        },
        servers: [
          {
            url: "http://localhost:9999",
            description: "Test Server Description",
          },
        ],
        tags: [
          {
            name: "Test Tag",
            description: "Test Tag Description",
          },
        ],
        paths: {
          "/api/tests": {
            get: {
              operationId: "getTests",
              tags: ["Test Tag"],
              description: "Get Tests Description",
              summary: "Get Tests Summary",
              parameters: [
                {
                  schema: { type: "string" },
                  required: true,
                  name: "name",
                  in: "query",
                },
              ],
              responses: {
                "200": {
                  description: "200",
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "number" },
                            name: { type: "string" },
                          },
                          required: ["id", "name"],
                        },
                      },
                    },
                  },
                },
                "400": {
                  description: "400",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
              },
            },
            post: {
              operationId: "postTest",
              tags: ["Test Tag"],
              description: "Post Test Description",
              summary: "Post Test Summary",
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { name: { type: "string" } },
                      required: ["name"],
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "200",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          name: { type: "string" },
                        },
                        required: ["id", "name"],
                      },
                    },
                  },
                },
                "400": {
                  description: "400",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
                "422": {
                  description: "422",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
              },
            },
          },
          "/api/tests/{id}": {
            get: {
              operationId: "getTest",
              tags: ["Test Tag"],
              description: "Get Test Description",
              summary: "Get Test Summary",
              parameters: [
                {
                  schema: { type: "string" },
                  required: true,
                  name: "id",
                  in: "path",
                },
              ],
              responses: {
                "200": {
                  description: "200",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          name: { type: "string" },
                        },
                        required: ["id", "name"],
                      },
                    },
                  },
                },
                "400": {
                  description: "400",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
                "404": {
                  description: "404",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
              },
            },
            put: {
              operationId: "putTest",
              tags: ["Test Tag"],
              description: "Put Test Description",
              summary: "Put Test Summary",
              parameters: [
                {
                  schema: { type: "string" },
                  required: true,
                  name: "id",
                  in: "path",
                },
              ],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { name: { type: "string" } },
                      required: ["name"],
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "200",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          name: { type: "string" },
                        },
                        required: ["id", "name"],
                      },
                    },
                  },
                },
                "400": {
                  description: "400",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
                "404": {
                  description: "404",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
              },
            },
            patch: {
              operationId: "patchTest",
              tags: ["Test Tag"],
              description: "Patch Test Description",
              summary: "Patch Test Summary",
              parameters: [
                {
                  schema: { type: "string" },
                  required: true,
                  name: "id",
                  in: "path",
                },
              ],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { name: { type: "string" } },
                      required: ["name"],
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "200",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          name: { type: "string" },
                        },
                        required: ["id", "name"],
                      },
                    },
                  },
                },
                "400": {
                  description: "400",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
                "404": {
                  description: "404",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
              },
            },
            delete: {
              operationId: "deleteTest",
              tags: ["Test Tag"],
              description: "Delete Test Description",
              summary: "Delete Test Summary",
              parameters: [
                {
                  schema: { type: "string" },
                  required: true,
                  name: "id",
                  in: "path",
                },
              ],
              responses: {
                "200": {
                  description: "200",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          name: { type: "string" },
                        },
                        required: ["id", "name"],
                      },
                    },
                  },
                },
                "400": {
                  description: "400",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
                "404": {
                  description: "404",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: { message: { type: "string" } },
                        required: ["message"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            "🔍 GetTestsQuery": {
              type: "object",
              properties: { name: { type: "string" } },
              required: ["name"],
            },
            "💬 GetTestsResponse 200": {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                },
                required: ["id", "name"],
              },
            },
            "💬 GetTestsResponse 400": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "🛤️ GetTestPath": {
              type: "object",
              properties: { id: { type: "string" } },
              required: ["id"],
            },
            "💬 GetTestResponse 200": {
              type: "object",
              properties: { id: { type: "number" }, name: { type: "string" } },
              required: ["id", "name"],
            },
            "💬 GetTestResponse 400": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "💬 GetTestResponse 404": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "📦 PostTestBody": {
              type: "object",
              properties: { name: { type: "string" } },
              required: ["name"],
            },
            "💬 PostTestResponse 200": {
              type: "object",
              properties: { id: { type: "number" }, name: { type: "string" } },
              required: ["id", "name"],
            },
            "💬 PostTestResponse 400": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "💬 PostTestResponse 422": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "📦 PutTestBody": {
              type: "object",
              properties: { name: { type: "string" } },
              required: ["name"],
            },
            "🛤️ PutTestPath": {
              type: "object",
              properties: { id: { type: "string" } },
              required: ["id"],
            },
            "💬 PutTestResponse 200": {
              type: "object",
              properties: { id: { type: "number" }, name: { type: "string" } },
              required: ["id", "name"],
            },
            "💬 PutTestResponse 400": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "💬 PutTestResponse 404": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "📦 PatchTestBody": {
              type: "object",
              properties: { name: { type: "string" } },
              required: ["name"],
            },
            "🛤️ PatchTestPath": {
              type: "object",
              properties: { id: { type: "string" } },
              required: ["id"],
            },
            "💬 PatchTestResponse 200": {
              type: "object",
              properties: { id: { type: "number" }, name: { type: "string" } },
              required: ["id", "name"],
            },
            "💬 PatchTestResponse 400": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "💬 PatchTestResponse 404": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "🛤️ DeleteTestPath": {
              type: "object",
              properties: { id: { type: "string" } },
              required: ["id"],
            },
            "💬 DeleteTestResponse 200": {
              type: "object",
              properties: { id: { type: "number" }, name: { type: "string" } },
              required: ["id", "name"],
            },
            "💬 DeleteTestResponse 400": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
            "💬 DeleteTestResponse 404": {
              type: "object",
              properties: { message: { type: "string" } },
              required: ["message"],
            },
          },
          parameters: {},
        },
      });
    });
  });
});
