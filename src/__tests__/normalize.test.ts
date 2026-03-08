import { describe, it, expect } from "vitest";
import { normalize } from "../lib/normalize";

function chars(text: string): string[] {
  return normalize(text).map((n) => n.char);
}

describe("normalize", () => {
  it("ひらがな→カタカナ変換", () => {
    expect(chars("あいう")).toEqual(["ア", "イ", "ウ"]);
  });

  it("カタカナはそのまま", () => {
    expect(chars("アイウ")).toEqual(["ア", "イ", "ウ"]);
  });

  it("小文字→大文字", () => {
    expect(chars("ッャュョ")).toEqual(["ツ", "ヤ", "ユ", "ヨ"]);
  });

  it("ひらがな小文字→カタカナ大文字", () => {
    expect(chars("っゃ")).toEqual(["ツ", "ヤ"]);
  });

  it("濁音を分解", () => {
    expect(chars("ガ")).toEqual(["カ", "゛"]);
    expect(chars("ザジズゼゾ")).toEqual(["サ", "゛", "シ", "゛", "ス", "゛", "セ", "゛", "ソ", "゛"]);
  });

  it("半濁音を分解", () => {
    expect(chars("パ")).toEqual(["ハ", "゜"]);
    expect(chars("ピプペポ")).toEqual(["ヒ", "゜", "フ", "゜", "ヘ", "゜", "ホ", "゜"]);
  });

  it("ひらがな濁音の分解", () => {
    expect(chars("が")).toEqual(["カ", "゛"]);
    expect(chars("ぱ")).toEqual(["ハ", "゜"]);
  });

  it("元の位置を追跡", () => {
    const result = normalize("ガキ");
    expect(result).toEqual([
      { char: "カ", originalIndex: 0 },
      { char: "゛", originalIndex: 0 },
      { char: "キ", originalIndex: 1 },
    ]);
  });
});
