import fs from "fs";

import { beforeEach, describe, expect, it, vi } from "vitest";
import yaml from "yaml";

import { DocumentError } from "../errors";
import { zodocs } from "./document-generator";

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
  },
}));

vi.mock("path", () => ({
  default: {
    join: vi.fn((...args) => args.join("/")),
  },
}));

vi.mock("./document-generator", () => ({
  zodocs: {
    generate: vi.fn(),
  },
}));

describe("DocumentWriter", async () => {
  const { DocumentWriter } = await import("./document-writer");
  const subject = new DocumentWriter();

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe("write", () => {
    it("ドキュメントをYAML形式で出力すること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(zodocs.generate).mockReturnValue({
        openapi: "3.0.0",
        info: { title: "Zodocs", version: "1.0.0" },
        paths: {},
      });

      const toPath = await subject.write({
        version: "1.0.0",
        title: "Zodocs",
        description: "Generated API Document Description",
        servers: [],
        input: {
          directories: ["schema"],
          endpointFileName: "endpoint.ts",
          requestFileName: "request.ts",
          responseFileName: "response.ts",
          tags: {},
        },
        output: {
          directory: "docs",
          fileName: "openapi.yml",
        },
      });

      expect(toPath).toBe("docs/openapi.yml");
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        toPath,
        yaml.stringify({
          openapi: "3.0.0",
          info: { title: "Zodocs", version: "1.0.0" },
          paths: {},
        }),
        { encoding: "utf-8" },
      );
    });

    it("出力ディレクトリが存在しない場合は作成すること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      await subject.write({
        version: "1.0.0",
        title: "Zodocs",
        description: "Generated API Document Description",
        servers: [],
        input: {
          directories: ["schema"],
          endpointFileName: "endpoint.ts",
          requestFileName: "request.ts",
          responseFileName: "response.ts",
          tags: {},
        },
        output: {
          directory: "does-not-exist",
          fileName: "openapi.yml",
        },
      });

      expect(fs.mkdirSync).toHaveBeenCalledWith("does-not-exist", {
        recursive: true,
      });
    });

    it("出力ディレクトリの作成に失敗した場合はDocumentErrorを投げること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      vi.mocked(fs.mkdirSync).mockImplementation(() => {
        throw new Error();
      });

      await expect(
        subject.write({
          version: "1.0.0",
          title: "Zodocs",
          description: "Generated API Document Description",
          servers: [],
          input: {
            directories: ["schema"],
            endpointFileName: "endpoint.ts",
            requestFileName: "request.ts",
            responseFileName: "response.ts",
            tags: {},
          },
          output: {
            directory: "failed-to-create",
            fileName: "openapi.yml",
          },
        }),
      ).rejects.toThrow(DocumentError);
    });

    it("ドキュメントの書き込みに失敗した場合はDocumentErrorを投げること", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {
        throw new Error();
      });

      await expect(
        subject.write({
          version: "1.0.0",
          title: "Zodocs",
          description: "Generated API Document Description",
          servers: [],
          input: {
            directories: ["schema"],
            endpointFileName: "endpoint.ts",
            requestFileName: "request.ts",
            responseFileName: "response.ts",
            tags: {},
          },
          output: {
            directory: "docs",
            fileName: "openapi.yml",
          },
        }),
      ).rejects.toThrow(DocumentError);
    });
  });
});
