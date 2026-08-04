/* Hallmark · theme: Cobalt (brand-anchored, hue 252) · design-system: design.md
 * Colour values live in src/index.css as bare OKLCH components so the
 * `<alpha-value>` slot below keeps `bg-muted/50`-style modifiers working.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },

        /* Semantic ramp — prefer these in new code over the shadcn aliases */
        paper: {
          DEFAULT: "oklch(var(--c-paper) / <alpha-value>)",
          2: "oklch(var(--c-paper-2) / <alpha-value>)",
          3: "oklch(var(--c-paper-3) / <alpha-value>)",
        },
        rule: {
          DEFAULT: "oklch(var(--c-rule) / <alpha-value>)",
          2: "oklch(var(--c-rule-2) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "oklch(var(--c-ink) / <alpha-value>)",
          2: "oklch(var(--c-ink-2) / <alpha-value>)",
        },
        signal: {
          DEFAULT: "oklch(var(--c-accent) / <alpha-value>)",
          hover: "oklch(var(--c-accent-hover) / <alpha-value>)",
          ink: "oklch(var(--c-accent-ink) / <alpha-value>)",
        },
        danger: "oklch(var(--c-danger) / <alpha-value>)",
        success: "oklch(var(--c-success) / <alpha-value>)",
      },

      fontFamily: {
        display: "var(--font-display)",
        sans: "var(--font-body)",
        mono: "var(--font-mono)",
      },

      /* Tailwind's default size scale is left intact on purpose — the existing
       * pages are written against it, and redefining `text-xl` / `text-2xl`
       * resizes every one of them at once. Only additive steps here. */
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        title: ["1.25rem", { lineHeight: "1.35" }],
        "title-lg": ["1.5rem", { lineHeight: "1.25" }],
      },

      /* Named 4pt scale, mirrored from the CSS tokens */
      spacing: {
        "3xs": "var(--space-3xs)",
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "var(--radius-card)",
        control: "var(--radius-control)",
      },

      boxShadow: {
        whisper: "var(--shadow-whisper)",
        float: "var(--shadow-float)",
      },

      transitionTimingFunction: {
        out: "var(--ease-out)",
        in: "var(--ease-in)",
        "in-out": "var(--ease-in-out)",
      },

      transitionDuration: {
        micro: "var(--dur-micro)",
        short: "var(--dur-short)",
        long: "var(--dur-long)",
      },

      /* Six named levels — no ad-hoc z values */
      zIndex: {
        base: "1",
        raised: "10",
        dropdown: "100",
        sticky: "200",
        modal: "400",
        toast: "500",
        tooltip: "600",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        reveal: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
        "skeleton-sweep": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
        /* --- Tex-GPT loaders. These were previously declared outside
           `extend` and silently dead; they now actually compile. ---------- */
        typing: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(-2px)", opacity: "1" },
        },
        "loading-dots": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.6)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "text-blink": {
          "0%, 100%": { color: "oklch(var(--c-accent))" },
          "50%": { color: "oklch(var(--c-muted))" },
        },
        "bounce-dots": {
          "0%, 100%": { transform: "scale(0.8)", opacity: "0.5" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
        },
        "thin-pulse": {
          "0%, 100%": { transform: "scale(0.95)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "0.4" },
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.5)", opacity: "1" },
        },
        "shimmer-text": {
          "0%": { backgroundPosition: "150% center" },
          "100%": { backgroundPosition: "-150% center" },
        },
        "wave-bars": {
          "0%, 100%": { transform: "scaleY(1)", opacity: "0.5" },
          "50%": { transform: "scaleY(0.6)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 50%" },
          "100%": { backgroundPosition: "-200% 50%" },
        },
        "spinner-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },

      animation: {
        "accordion-down":
          "accordion-down var(--dur-short) var(--ease-in-out)",
        "accordion-up": "accordion-up var(--dur-short) var(--ease-in-out)",
        reveal: "reveal var(--dur-long) var(--ease-out) forwards",
        "skeleton-sweep":
          "skeleton-sweep 1.4s var(--ease-in-out) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
