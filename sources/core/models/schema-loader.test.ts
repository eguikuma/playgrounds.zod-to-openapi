import fs from "fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { SchemaError } from "../errors";

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    promises: {
      readdir: vi.fn(),
    },
  },
}));

vi.mock("path", () => ({
  default: {
    join: vi.fn((...args) => args.join("/")),
    resolve: vi.fn((path) => path),
  },
}));

describe("SchemaLoader", async () => {
  const { SchemaLoader } = await import("./schema-loader");
  const subject = new SchemaLoader("/zodocs/root");

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe("load", () => {
    it("指定されたディレクトリからスキーマを読み込むこと", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValueOnce([
        { name: "schema", isDirectory: () => true },
      ]);
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.doMock("/zodocs/root/schema/endpoint.ts", () => ({}));

      await subject.load("endpoint.ts", ["schema"]);

      expect(fs.promises.readdir).toHaveBeenCalledWith(
        "/zodocs/root",
        expect.any(Object),
      );
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("schema/endpoint.ts"),
      );
    });

    it("サブディレクトリを再帰的に検索すること", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValueOnce([
        { name: "parent", isDirectory: () => true },
      ]);
      vi.mocked(fs.promises.readdir).mockResolvedValueOnce([
        { name: "schema", isDirectory: () => true },
      ]);
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.doMock("/zodocs/root/parent/schema/endpoint.ts", () => ({}));

      await subject.load("endpoint.ts", ["schema"]);

      expect(fs.promises.readdir).toHaveBeenCalledTimes(2);
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("parent/schema/endpoint.ts"),
      );
    });

    it("スキーマファイルが存在しない場合はスキップすること", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValueOnce([
        { name: "schema", isDirectory: () => true },
      ]);
      vi.mocked(fs.existsSync).mockReturnValue(false);

      await subject.load("endpoint.ts", ["schema"]);

      expect(fs.existsSync).toHaveBeenCalled();
    });

    it("スキーマファイルの読み込みに失敗した場合はSchemaErrorを投げること", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValueOnce([
        { name: "schema", isDirectory: () => true },
      ]);
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.doMock("/zodocs/root/schema/endpoint.ts", () => {
        throw new Error();
      });

      await expect(subject.load("endpoint.ts", ["schema"])).rejects.toThrow(
        SchemaError,
      );
    });

    it("ディレクトリ検索に失敗した場合はSchemaErrorを投げること", async () => {
      vi.mocked(fs.promises.readdir).mockRejectedValueOnce(new Error());

      await expect(subject.load("endpoint.ts", ["schema"])).rejects.toThrow(
        SchemaError,
      );
    });
  });
});
