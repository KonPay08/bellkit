import { describe, it, expect } from "vitest";
import { encode } from "../lib/encoder";

describe("encode", () => {
  it("カタカナ入力を変換", () => {
    expect(encode("アイウ")).toEqual({ ok: true, result: "111213" });
  });

  it("ひらがな入力を変換", () => {
    expect(encode("あいう")).toEqual({ ok: true, result: "111213" });
  });

  it("濁音の変換", () => {
    expect(encode("ガキ")).toEqual({ ok: true, result: "210422" });
  });

  it("半濁音の変換", () => {
    expect(encode("パン")).toEqual({ ok: true, result: "610503" });
  });

  it("小文字の正規化", () => {
    expect(encode("ッツ")).toEqual({ ok: true, result: "4343" });
  });

  it("スペース区切り", () => {
    expect(encode("アイ", " ")).toEqual({ ok: true, result: "11 12" });
  });

  it("濁音のスペース区切り", () => {
    expect(encode("ガ", " ")).toEqual({ ok: true, result: "21 04" });
  });

  it("空文字列", () => {
    expect(encode("")).toEqual({ ok: true, result: "" });
  });

  it("未対応文字でエラー", () => {
    const result = encode("ア漢字");
    expect(result).toEqual({
      ok: false,
      errorIndex: 1,
      errorChar: "漢",
    });
  });

  it("先頭の未対応文字", () => {
    const result = encode("Aア");
    expect(result).toEqual({
      ok: false,
      errorIndex: 0,
      errorChar: "A",
    });
  });
});
