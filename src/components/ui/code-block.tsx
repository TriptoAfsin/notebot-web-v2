import { useTheme } from "@/components/theme-provider";
import {
  getHighlighter,
  resolveLanguage,
  THEMES,
} from "@/lib/highlighter";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-clip",
        "rounded-card border border-rule bg-paper-2 text-card-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type CodeBlockCodeProps = {
  code: string;
  language?: string;
  theme?: string;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlockCode({
  code,
  language = "plaintext",
  theme,
  className,
  ...props
}: CodeBlockCodeProps) {
  const { resolvedTheme } = useTheme();
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const activeTheme = theme ?? THEMES[resolvedTheme];

  useEffect(() => {
    // Guards against a late resolve overwriting a newer render — the previous
    // version had no cancellation, so fast prop changes could race.
    let cancelled = false;

    if (!code) {
      setHighlightedHtml(null);
      return;
    }

    (async () => {
      try {
        const highlighter = await getHighlighter();
        const html = highlighter.codeToHtml(code, {
          lang: resolveLanguage(language),
          theme: activeTheme,
        });
        if (!cancelled) setHighlightedHtml(html);
      } catch {
        // Highlighting is a nicety — the plain <pre> below is a fine result.
        if (!cancelled) setHighlightedHtml(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, language, activeTheme]);

  const classNames = cn(
    "w-full overflow-x-auto font-mono text-[13px] [&>pre]:px-4 [&>pre]:py-4",
    className
  );

  // Unhighlighted fallback: rendered immediately, and kept if Shiki fails.
  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...props}
    />
  ) : (
    <div className={classNames} {...props}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>;

function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { CodeBlockGroup, CodeBlockCode, CodeBlock };
