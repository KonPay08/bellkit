# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bellkit is a single-page web app for encoding/decoding Japanese text to/from "bell characters" (numeric sequences using the standard pager 2-touch encoding). This is an obfuscation tool, not encryption.

The full specification is in `requirement.md` (Japanese). The conversion table is in `docs/conversion-table.md`. The functional spec is in `docs/functional-spec.md`.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Type-check + production build
npm run test       # Run all tests (vitest)
npm run test:watch # Run tests in watch mode
npm run lint       # ESLint
```

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- Vitest for testing

## Architecture

```
src/
├── lib/           # Core logic (no React dependencies)
│   ├── table.ts   # Conversion table (char↔code maps)
│   ├── normalize.ts # Hiragana→Katakana, small→large, dakuten decomposition
│   ├── encoder.ts # Normal text → bell digits
│   └── decoder.ts # Bell digits → normal text (with dakuten recomposition)
├── components/    # React UI components
│   ├── Toast.tsx
│   └── ErrorDisplay.tsx
├── App.tsx        # Main app (state management + layout)
└── __tests__/     # Unit tests for lib/
```

Key separation: `src/lib/` is pure TypeScript with no React dependency. All encoding/decoding logic lives there and is independently testable.

## Key Design Decisions

- **Encoding:** Standard pager 2-touch — dakuten/handakuten are decomposed (ガ→カ+゛)
- **MVP scope:** Katakana only (hiragana input auto-converts). Numbers/symbols are future additions.
- **Unsupported characters:** Stop and show error position
- **Output separator default:** No separator
- **Decode output:** Katakana (dakuten marks are recomposed back into full characters)
- **Mobile-first:** Designed for smartphone as primary device
- **UI pattern:** DeepL mobile-style — single input area with real-time conversion, read-only output, inline icon buttons (⇄ swap, ✕ clear, 📋 copy)

## Language

The specification and target audience are Japanese. UI text and error messages should be in Japanese.
