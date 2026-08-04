"use client";

import { getCookie, setCookie } from "@/utils/cookie-utils";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  /** The theme actually painted — `system` resolved against the OS preference. */
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/** Length of the colour crossfade — must match the CSS rule in index.css. */
const SWITCH_MS = 320;

function systemTheme(): "dark" | "light" {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function paint(next: "dark" | "light") {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(next);
  // keeps native controls and scrollbars in step with the theme
  root.style.colorScheme = next;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (getCookie(storageKey) as Theme) || defaultTheme
  );
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() =>
    theme === "system" ? systemTheme() : theme
  );
  const switchTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const next = theme === "system" ? systemTheme() : theme;
    paint(next);
    setResolvedTheme(next);
  }, [theme]);

  /* Follow the OS while the preference is `system`. The previous version read
   * the OS setting once on mount and then ignored it for the rest of the
   * session, so a system flip left the app on the stale theme. */
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = () => {
      const next = systemTheme();
      paint(next);
      setResolvedTheme(next);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  useEffect(() => () => window.clearTimeout(switchTimer.current), []);

  const setTheme = useCallback(
    (next: Theme) => {
      const root = window.document.documentElement;
      const reduced = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      /* Enable the colour crossfade for the duration of the flip only, then
       * remove it — leaving it on permanently would slow every hover state to
       * 320ms and make the whole UI feel laggy. */
      if (!reduced) {
        root.setAttribute("data-theme-switching", "");
        window.clearTimeout(switchTimer.current);
        switchTimer.current = window.setTimeout(() => {
          root.removeAttribute("data-theme-switching");
        }, SWITCH_MS);
      }

      setCookie(storageKey, next);
      setThemeState(next);
    },
    [storageKey]
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
