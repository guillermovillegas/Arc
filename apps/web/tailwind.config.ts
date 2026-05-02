import type { Config } from "tailwindcss";
import {
  palette,
  fontSize as sharedFontSize,
  radius,
  spacingExtensions,
  easing,
  duration,
} from "@faineant/shared";

// Adapt shared font-size objects → Tailwind's tuple format.
const fontSize = Object.fromEntries(
  Object.entries(sharedFontSize).map(([key, v]) => [
    key,
    [
      v.size,
      {
        lineHeight: String(v.lineHeight),
        letterSpacing: v.letterSpacing,
        fontWeight: String(v.weight),
      },
    ],
  ]),
) as Config["theme"] extends infer T ? T extends { fontSize?: infer F } ? F : never : never;

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ...palette,
        // shadcn variable shims (read CSS vars from globals.css)
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Bricolage Grotesque", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        editorial: ["var(--font-editorial)", "Cormorant Garamond", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Geist Mono", "ui-monospace", "monospace"],
      },
      fontSize,
      borderRadius: radius,
      spacing: spacingExtensions,
      transitionTimingFunction: {
        "fai-smooth": easing.smooth,
      },
      transitionDuration: {
        fast: `${duration.fast}ms`,
        normal: `${duration.normal}ms`,
        slow: `${duration.slow}ms`,
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "sheet-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "sheet-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "sheet-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "sheet-out-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "sheet-in-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "sheet-out-bottom": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        "sheet-in-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "sheet-out-top": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        "overlay-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "overlay-out": { "0%": { opacity: "1" }, "100%": { opacity: "0" } },
      },
      animation: {
        "fade-in": `fadeIn ${duration.slow}ms ${easing.smooth} forwards`,
        "fade-up": `fadeUp ${duration.slow}ms ${easing.smooth} forwards`,
        "sheet-in-right": `sheet-in-right ${duration.normal}ms ${easing.smooth} forwards`,
        "sheet-out-right": `sheet-out-right ${duration.fast}ms ease-in forwards`,
        "sheet-in-left": `sheet-in-left ${duration.normal}ms ${easing.smooth} forwards`,
        "sheet-out-left": `sheet-out-left ${duration.fast}ms ease-in forwards`,
        "sheet-in-bottom": `sheet-in-bottom ${duration.normal}ms ${easing.smooth} forwards`,
        "sheet-out-bottom": `sheet-out-bottom ${duration.fast}ms ease-in forwards`,
        "sheet-in-top": `sheet-in-top ${duration.normal}ms ${easing.smooth} forwards`,
        "sheet-out-top": `sheet-out-top ${duration.fast}ms ease-in forwards`,
        "overlay-in": `overlay-in ${duration.normal}ms ease-out forwards`,
        "overlay-out": "overlay-out 200ms ease-in forwards",
      },
    },
  },
  plugins: [],
};

export default config;
