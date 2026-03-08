import { describe, it, expect } from "vitest";
import { encode } from "../lib/encoder";
import { decode } from "../lib/decoder";

describe("ラウンドトリップ", () => {
  const cases = [
    "アイウエオ",
    "カキクケコ",
    "サシスセソ",
    "タチツテト",
    "ナニヌネノ",
    "ハヒフヘホ",
    "マミムメモ",
    "ヤユヨ",
    "ラリルレロ",
    "ワヲン",
    "ガギグゲゴ",
    "ザジズゼゾ",
    "ダヂヅデド",
    "バビブベボ",
    "パピプペポ",
    "ヴ",
  ];

  for (const input of cases) {
    it(`${input} → encode → decode で元に戻る`, () => {
      const encoded = encode(input);
      expect(encoded.ok).toBe(true);
      if (!encoded.ok) return;

      const decoded = decode(encoded.result);
      expect(decoded.ok).toBe(true);
      if (!decoded.ok) return;

      expect(decoded.result).toBe(input);
    });
  }

  it("ひらがな入力はカタカナで復元される", () => {
    const encoded = encode("こんにちは");
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const decoded = decode(encoded.result);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    expect(decoded.result).toBe("コンニチハ");
  });

  it("スペース区切りでもラウンドトリップ", () => {
    const encoded = encode("ガンバレ", " ");
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const decoded = decode(encoded.result);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    expect(decoded.result).toBe("ガンバレ");
  });
});
