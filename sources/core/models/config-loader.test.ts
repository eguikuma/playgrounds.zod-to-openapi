import fs from "fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConfigError } from "../errors";

import type { ZodocsConfig } from "../definitions";

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

vi.mock("path", () => ({
  default: {
    join: vi.fn((...args) => args.join("/")),
  },
}));

describe("ConfigLoader", async () => {
  const { ConfigLoader } = await import("./config-loader");
  const subject = new ConfigLoader("/zodocs/root");

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  describe("load", () => {
    it("設定ファイルが存在しない場合はデフォルトのファイルを作成すること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const config = await subject.load();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "/zodocs/root/zodocs.config.ts",
        `import type { ZodocsConfig, ZodocsTags } from "zodocs";

export const Tags = {} as const satisfies ZodocsTags;

const config: ZodocsConfig = {
  version: "1.0.0",
  title: "Generated API Document Title",
  description: "Generated API Document Description",
  servers: [],
  input: {
    directories: ["schema"],
    endpointFileName: "endpoint.ts",
    requestFileName: "request.ts",
    responseFileName: "response.ts",
    tags: Tags,
  },
  output: {
    directory: "",
    fileName: "openapi-docs.yml",
  },
};

export default config;
`,
        "utf-8",
      );
      expect(config).toMatchObject({
        version: "1.0.0",
        title: "Generated API Document Title",
        description: "Generated API Document Description",
        input: {
          directories: ["schema"],
          endpointFileName: "endpoint.ts",
          requestFileName: "request.ts",
          responseFileName: "response.ts",
        },
        output: {
          directory: "",
          fileName: "openapi-docs.yml",
        },
      });
    });

    it("設定ファイルが存在する場合は読み込んでマージすること", async () => {
      const myConfig: Partial<ZodocsConfig> = {
        version: "2.0.0",
        title: "My Zodocs Config Title",
        input: {
          directories: ["my-schema"],
        },
        output: {
          directory: "zodocs-output",
          fileName: "my-zodocs.yml",
        },
      };
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.doMock("/zodocs/root/zodocs.config.ts", () => ({
        default: myConfig,
      }));

      const config = await subject.load();

      expect(config).toMatchObject({
        ...myConfig,
        description: "Generated API Document Description",
        input: {
          ...myConfig.input,
          endpointFileName: "endpoint.ts",
          requestFileName: "request.ts",
          responseFileName: "response.ts",
        },
        output: {
          directory: "zodocs-output",
          fileName: "my-zodocs.yml",
        },
      });
    });

    it("スキーマディレクトリ名が空の場合はConfigErrorを投げること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.doMock("/zodocs/root/zodocs.config.ts", () => ({
        default: {
          input: {
            directories: [],
          },
        },
      }));

      await expect(subject.load()).rejects.toThrow(ConfigError);
    });

    it("スキーマファイル名が設定されていない場合はConfigErrorを投げること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.doMock("/zodocs/root/zodocs.config.ts", () => ({
        default: {
          input: {
            endpointFileName: "",
          },
        },
      }));

      await expect(subject.load()).rejects.toThrow(ConfigError);
    });

    it("出力ファイル名が設定されていない場合はConfigErrorを投げること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.doMock("/zodocs/root/zodocs.config.ts", () => ({
        default: {
          output: {
            fileName: "",
          },
        },
      }));

      await expect(subject.load()).rejects.toThrow(ConfigError);
    });

    it("デフォルトの設定ファイルの書き込みに失敗した場合はDocumentErrorを投げること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {
        throw new Error();
      });

      await expect(subject.load()).rejects.toThrow(ConfigError);
    });

    it("設定ファイルの読み込みに失敗した場合はConfigErrorを投げること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.doMock("/zodocs/root/zodocs.config.ts", () => {
        throw new Error();
      });

      await expect(subject.load()).rejects.toThrow(ConfigError);
    });
  });
});
