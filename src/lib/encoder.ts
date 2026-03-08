/**
 * エンコーダ: 通常文 → ベル文字
 * §8.1 に基づく
 */

import { charToCode } from "./table";
import { normalize } from "./normalize";

export interface EncodeSuccess {
  ok: true;
  result: string;
}

export interface EncodeError {
  ok: false;
  /** 元テキスト上での未対応文字の位置（0始まり） */
  errorIndex: number;
  /** 未対応の文字 */
  errorChar: string;
}

export type EncodeResult = EncodeSuccess | EncodeError;

export function encode(
  text: string,
  separator: "" | " " = ""
): EncodeResult {
  if (text.length === 0) {
    return { ok: true, result: "" };
  }

  const normalized = normalize(text);
  const codes: string[] = [];

  for (const { char, originalIndex } of normalized) {
    const code = charToCode.get(char);
    if (code === undefined) {
      return {
        ok: false,
        errorIndex: originalIndex,
        errorChar: text[originalIndex],
      };
    }
    codes.push(code);
  }

  return { ok: true, result: codes.join(separator) };
}
