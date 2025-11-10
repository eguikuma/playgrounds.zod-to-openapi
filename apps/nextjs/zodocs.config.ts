import type { ZodocsConfig, ZodocsTags } from "zodocs";

export const Tags = {
  User: {
    name: "users",
    description: "ユーザー情報に関連するエンドポイント",
  },
} as const satisfies ZodocsTags;

const config: ZodocsConfig = {
  version: "1.0.0",
  title: "Next.js",
  description: "Next.jsのサンプル",
  servers: [
    {
      url: `http://localhost:{port}/api`,
      description: "ローカル環境",
      variables: {
        port: {
          default: "3000",
        },
      },
    },
  ],
  input: {
    directories: ["_schema"],
    endpointFileName: "endpoint.ts",
    requestFileName: "request.ts",
    responseFileName: "response.ts",
    tags: Tags,
  },
  output: {
    fileName: "nextjs-docs.yml",
  },
};

export default config;
