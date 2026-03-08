import { useState, useMemo, useCallback } from "react";
import { encode } from "./lib/encoder";
import { decode } from "./lib/decoder";
import { Toast } from "./components/Toast";
import { ErrorDisplay } from "./components/ErrorDisplay";

type Direction = "encode" | "decode";

function App() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState<"" | " ">("");
  const [toastVisible, setToastVisible] = useState(false);

  // リアルタイム変換
  const { output, error } = useMemo(() => {
    if (input.length === 0) {
      return { output: "", error: "" };
    }

    if (direction === "encode") {
      const result = encode(input, separator);
      if (result.ok) {
        return { output: result.result, error: "" };
      }
      return {
        output: "",
        error: `${result.errorIndex + 1}文字目「${result.errorChar}」は未対応です`,
      };
    } else {
      const result = decode(input);
      if (result.ok) {
        return { output: result.result, error: "" };
      }
      return {
        output: "",
        error: `位置 ${result.errorPosition + 1} のコード「${result.errorCode}」が不正です`,
      };
    }
  }, [input, direction, separator]);

  const handleSwapDirection = useCallback(() => {
    setInput(output);
    setDirection((d) => (d === "encode" ? "decode" : "encode"));
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      setToastVisible(true);
    } catch {
      // clipboard API が使えない環境
    }
  }, [output]);

  const placeholder =
    direction === "encode"
      ? "ひらがな・カタカナを入力"
      : "数字列を入力";

  return (
    <div className="min-h-dvh bg-gray-100 flex flex-col">
      <main className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        {/* カード */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col">
          {/* 入力エリア */}
          <div className="relative flex-1 min-h-[120px]">
            <textarea
              className={`w-full h-full p-4 pr-10 text-base resize-none focus:outline-none bg-transparent rounded-t-2xl ${
                direction === "decode" ? "font-mono placeholder:font-sans" : ""
              }`}
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="クリア"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* 出力エリア（入力がある時のみ表示） */}
          {input && (
            <>
              <div className="border-t border-gray-100" />

              <div className="relative flex-1 min-h-[120px]">
                <div
                  className={`w-full h-full p-4 pr-10 text-base whitespace-pre-wrap break-all ${
                    direction === "encode" ? "font-mono" : ""
                  } ${output ? "text-gray-900" : "text-gray-400"}`}
                >
                  {output}
                </div>
                {output && (
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    aria-label="コピー"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  </button>
                )}

                {/* 区切りトグル（encode時のみ） */}
                {direction === "encode" && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-gray-400">
                    <button
                      onClick={() => setSeparator("")}
                      className={`px-2 py-0.5 rounded ${
                        separator === ""
                          ? "bg-gray-200 text-gray-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      なし
                    </button>
                    <button
                      onClick={() => setSeparator(" ")}
                      className={`px-2 py-0.5 rounded ${
                        separator === " "
                          ? "bg-gray-200 text-gray-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      スペース
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* エラー表示 */}
        <div className="mt-2">
          <ErrorDisplay message={error} />
        </div>

        {/* 方向切替（カード下部） */}
        <div className="flex items-center justify-center gap-2 py-3">
          <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${
            direction === "encode" ? "bg-gray-700 text-white" : "text-gray-600"
          }`}>
            通常文
          </span>
          <button
            onClick={handleSwapDirection}
            className="p-2 text-gray-500 active:text-gray-700"
            aria-label="変換方向を切り替え"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${
            direction === "decode" ? "bg-gray-700 text-white" : "text-gray-600"
          }`}>
            ベル文字
          </span>
        </div>

        {/* 注意書き */}
        <p className="text-xs text-gray-400 text-center mt-4">
          ※ これは暗号化ではなく難読化です。重要情報のやりとりには使わないでください
        </p>
      </main>

      <Toast
        message="コピーしました"
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}

export default App;
