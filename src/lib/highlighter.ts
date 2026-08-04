/* Scoped Shiki highlighter.
 *
 * `import { codeToHtml } from "shiki"` pulls in the *full* bundle — every
 * grammar and every theme Shiki ships. In this app that produced ~300 extra
 * chunks (racket, blade, wolfram, emacs-lisp, objective-cpp, a 622 KB wasm
 * engine…) and left the service worker precaching 11 MB, all so a textile Q&A
 * bot could occasionally render a fenced code block.
 *
 * This builds a core highlighter with:
 *   - only the grammars a Tex-GPT answer plausibly contains
 *   - both light and dark themes, so code follows the app theme
 *   - the JavaScript RegExp engine instead of the Oniguruma wasm build
 *
 * It's a lazily-created singleton, so the cost is paid once and only if a code
 * block actually appears.
 */

import type { HighlighterCore } from "shiki/core";

/** Grammars we ship. Anything else falls back to plaintext.
 * `plaintext` needs no grammar — Shiki treats it as a built-in. */
export const SUPPORTED_LANGUAGES = [
  "plaintext",
  "bash",
  "css",
  "html",
  "javascript",
  "json",
  "markdown",
  "python",
  "sql",
  "typescript",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const ALIASES: Record<string, SupportedLanguage> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  py: "python",
  md: "markdown",
  text: "plaintext",
  txt: "plaintext",
  "": "plaintext",
};

/** Map an arbitrary fence label onto a grammar we actually loaded. */
export function resolveLanguage(language?: string): SupportedLanguage {
  const key = (language ?? "").toLowerCase();
  if ((SUPPORTED_LANGUAGES as readonly string[]).includes(key)) {
    return key as SupportedLanguage;
  }
  return ALIASES[key] ?? "plaintext";
}

export const THEMES = {
  light: "github-light",
  dark: "github-dark",
} as const;

let instance: Promise<HighlighterCore> | null = null;

export function getHighlighter(): Promise<HighlighterCore> {
  instance ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
      await Promise.all([
        import("shiki/core"),
        import("shiki/engine/javascript"),
      ]);

    /* Imported from `@shikijs/langs` / `@shikijs/themes` rather than
     * `shiki/langs/*` — the `shiki` package only exports those as barrels, so
     * a subpath import fails to resolve and a barrel import defeats the whole
     * point by pulling every grammar back in. */
    return createHighlighterCore({
      themes: [
        import("@shikijs/themes/github-light"),
        import("@shikijs/themes/github-dark"),
      ],
      langs: [
        import("@shikijs/langs/bash"),
        import("@shikijs/langs/css"),
        import("@shikijs/langs/html"),
        import("@shikijs/langs/javascript"),
        import("@shikijs/langs/json"),
        import("@shikijs/langs/markdown"),
        import("@shikijs/langs/python"),
        import("@shikijs/langs/sql"),
        import("@shikijs/langs/typescript"),
      ],
      // the JS engine avoids shipping the 622 KB Oniguruma wasm binary
      engine: createJavaScriptRegexEngine(),
    });
  })();

  return instance;
}
