import { describe, expect, it } from "vitest";

describe("toDescription", async () => {
  const subject = await import("./formatter");

  const EXPECTED_NEW_LINE = `\n${subject.DESCRIPTION_NEW_LINE}`;

  it("文字列の前後の空白を削除すること", () => {
    expect(subject.toDescription("  hello  ")).toBe("hello");
  });

  it("改行コードを<br>タグに変換すること", () => {
    const description = "line1\nline2\nline3";

    const expected = `line1${EXPECTED_NEW_LINE}line2${EXPECTED_NEW_LINE}line3`;

    expect(subject.toDescription(description)).toBe(expected);
  });

  it("空文字列の場合はそのまま返すこと", () => {
    expect(subject.toDescription("")).toBe("");
  });

  it("2つ以上の改行を<br>タグに変換すること", () => {
    const description = "line1\n\nline2\n\n\nline3";

    const expected = `line1${EXPECTED_NEW_LINE}${EXPECTED_NEW_LINE}line2${EXPECTED_NEW_LINE}${EXPECTED_NEW_LINE}${EXPECTED_NEW_LINE}line3`;

    expect(subject.toDescription(description)).toBe(expected);
  });
});
