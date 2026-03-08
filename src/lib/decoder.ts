/**
 * デコーダ: ベル文字 → 通常文
 * §8.2 に基づく: 区切りなし・スペース区切り両対応
 */

import { codeToChar } from "./table";

export interface DecodeSuccess {
  ok: true;
  result: string;
}

export interface DecodeError {
  ok: false;
  /** ベル文字列上でのエラー位置（0始まり） */
  errorPosition: number;
  /** 不正なコード */
  errorCode: string;
}

export type DecodeResult = DecodeSuccess | DecodeError;

export function decode(bellText: string): DecodeResult {
  if (bellText.length === 0) {
    return { ok: true, result: "" };
  }

  // スペースを除去して数字列のみにする
  const digits = bellText.replace(/ /g, "");

  // 数字以外が含まれていないかチェック
  if (!/^\d+$/.test(digits)) {
    const pos = digits.search(/[^\d]/);
    return { ok: false, errorPosition: pos, errorCode: digits[pos] };
  }

  // 桁数が奇数ならエラー
  if (digits.length % 2 !== 0) {
    return {
      ok: false,
      errorPosition: digits.length - 1,
      errorCode: digits.slice(-1),
    };
  }

  const chars: string[] = [];

  for (let i = 0; i < digits.length; i += 2) {
    const code = digits.slice(i, i + 2);
    const char = codeToChar.get(code);
    if (char === undefined) {
      return { ok: false, errorPosition: i, errorCode: code };
    }
    chars.push(char);
  }

  // 濁点・半濁点を前の文字と合成する
  return { ok: true, result: composeDakuten(chars) };
}

/** 濁点・半濁点記号を前の文字と合成してUnicode合成文字に戻す */
function composeDakuten(chars: string[]): string {
  const result: string[] = [];

  for (const ch of chars) {
    if (ch === "゛" && result.length > 0) {
      const prev = result[result.length - 1];
      const composed = addDakuten(prev);
      if (composed) {
        result[result.length - 1] = composed;
        continue;
      }
    }
    if (ch === "゜" && result.length > 0) {
      const prev = result[result.length - 1];
      const composed = addHandakuten(prev);
      if (composed) {
        result[result.length - 1] = composed;
        continue;
      }
    }
    result.push(ch);
  }

  return result.join("");
}

const dakutenPairs: Record<string, string> = {
  "カ": "ガ", "キ": "ギ", "ク": "グ", "ケ": "ゲ", "コ": "ゴ",
  "サ": "ザ", "シ": "ジ", "ス": "ズ", "セ": "ゼ", "ソ": "ゾ",
  "タ": "ダ", "チ": "ヂ", "ツ": "ヅ", "テ": "デ", "ト": "ド",
  "ハ": "バ", "ヒ": "ビ", "フ": "ブ", "ヘ": "ベ", "ホ": "ボ",
  "ウ": "ヴ",
};

const handakutenPairs: Record<string, string> = {
  "ハ": "パ", "ヒ": "ピ", "フ": "プ", "ヘ": "ペ", "ホ": "ポ",
};

function addDakuten(ch: string): string | null {
  return dakutenPairs[ch] ?? null;
}

function addHandakuten(ch: string): string | null {
  return handakutenPairs[ch] ?? null;
}
