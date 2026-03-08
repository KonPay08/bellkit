/**
 * 正規化処理
 * §7.2 に基づく: ひらがな→カタカナ、小文字→大文字、濁音・半濁音の分解
 */

// 小文字→大文字のマッピング
const smallToLarge: Record<string, string> = {
  "ァ": "ア", "ィ": "イ", "ゥ": "ウ", "ェ": "エ", "ォ": "オ",
  "ッ": "ツ", "ャ": "ヤ", "ュ": "ユ", "ョ": "ヨ", "ヮ": "ワ",
};

// 濁音→清音＋゛
const dakutenMap: Record<string, string> = {
  "ガ": "カ", "ギ": "キ", "グ": "ク", "ゲ": "ケ", "ゴ": "コ",
  "ザ": "サ", "ジ": "シ", "ズ": "ス", "ゼ": "セ", "ゾ": "ソ",
  "ダ": "タ", "ヂ": "チ", "ヅ": "ツ", "デ": "テ", "ド": "ト",
  "バ": "ハ", "ビ": "ヒ", "ブ": "フ", "ベ": "ヘ", "ボ": "ホ",
  "ヴ": "ウ",
};

// 半濁音→清音＋゜
const handakutenMap: Record<string, string> = {
  "パ": "ハ", "ピ": "ヒ", "プ": "フ", "ペ": "ヘ", "ポ": "ホ",
};

/** ひらがな→カタカナ変換 */
function hiraganaToKatakana(text: string): string {
  return text.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

/** 1文字を正規化して配列で返す（分解結果は複数文字になりうる） */
function normalizeChar(ch: string): string[] {
  if (ch in dakutenMap) {
    return [dakutenMap[ch], "゛"];
  }
  if (ch in handakutenMap) {
    return [handakutenMap[ch], "゜"];
  }
  if (ch in smallToLarge) {
    return [smallToLarge[ch]];
  }
  return [ch];
}

/** テキスト全体を正規化する。元の文字位置を追跡するため、各正規化文字に元のインデックスを付与 */
export interface NormalizedChar {
  char: string;
  originalIndex: number;
}

export function normalize(text: string): NormalizedChar[] {
  const katakana = hiraganaToKatakana(text);
  const result: NormalizedChar[] = [];

  for (let i = 0; i < katakana.length; i++) {
    const chars = normalizeChar(katakana[i]);
    for (const ch of chars) {
      result.push({ char: ch, originalIndex: i });
    }
  }

  return result;
}
