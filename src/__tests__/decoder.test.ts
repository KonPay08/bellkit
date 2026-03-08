import { describe, it, expect } from "vitest";
import { decode } from "../lib/decoder";

describe("decode", () => {
  it("基本的な復号", () => {
    expect(decode("111213")).toEqual({ ok: true, result: "アイウ" });
  });

  it("スペース区切りの復号", () => {
    expect(decode("11 12 13")).toEqual({ ok: true, result: "アイウ" });
  });

  it("濁音の復号（合成）", () => {
    expect(decode("2104")).toEqual({ ok: true, result: "ガ" });
  });

  it("半濁音の復号（合成）", () => {
    expect(decode("6105")).toEqual({ ok: true, result: "パ" });
  });

  it("濁音を含む文の復号", () => {
    expect(decode("210403610494")).toEqual({ ok: true, result: "ガンバレ" });
  });

  it("スペース区切り濁音の復号", () => {
    expect(decode("21 04 03 61 04 94")).toEqual({ ok: true, result: "ガンバレ" });
  });

  it("空文字列", () => {
    expect(decode("")).toEqual({ ok: true, result: "" });
  });

  it("奇数桁でエラー", () => {
    const result = decode("1");
    expect(result.ok).toBe(false);
  });

  it("未知コードでエラー", () => {
    const result = decode("99");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorCode).toBe("99");
    }
  });

  it("数字以外でエラー", () => {
    const result = decode("11a2");
    expect(result.ok).toBe(false);
  });
});
