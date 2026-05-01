import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        smoke: {
          950: "#0a0908",
          900: "#0e0d0c",
          800: "#15130f",
          700: "#1f1c18",
          600: "#2a2620",
        },
        taupe: {
          500: "#3a342a",
          400: "#5a5240",
          300: "#8a7e64",
        },
        champagne: {
          500: "#b8a780",
          400: "#c9b896",
          300: "#dccfb1",
        },
        bone: {
          200: "#e8dfc9",
          100: "#f3ede1",
          50: "#faf6ec",
        },
        oxblood: {
          500: "#6e2424",
        },
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
      fontSize: {
        "display-xl": ["7rem", { lineHeight: "0.92", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-lg": ["5rem", { lineHeight: "0.94", letterSpacing: "-0.04em", fontWeight: "700" }],
        display: ["3.5rem", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "700" }],
        "editorial-xl": ["5rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "300" }],
        "editorial-lg": ["3rem", { lineHeight: "1.10", letterSpacing: "-0.02em", fontWeight: "300" }],
        editorial: ["1.5rem", { lineHeight: "1.40", letterSpacing: "-0.005em", fontWeight: "300" }],
        heading: ["2rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        subheading: ["1.25rem", { lineHeight: "1.30", letterSpacing: "-0.02em", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.55" }],
        body: ["1rem", { lineHeight: "1.55" }],
        "body-sm": ["0.875rem", { lineHeight: "1.50" }],
        caption: ["0.75rem", { lineHeight: "1.50", letterSpacing: "0.04em" }],
        label: ["0.6875rem", { lineHeight: "1.40", letterSpacing: "0.32em", fontWeight: "500" }],
        mono: ["0.8125rem", { lineHeight: "1.55", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.125rem",
        md: "0.25rem",
        lg: "0.375rem",
        xl: "0.5rem",
        "2xl": "0.75rem",
      },
      spacing: {
        "18": "4.5rem",
        "30": "7.5rem",
      },
      transitionTimingFunction: {
        "fai-smooth": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        slow: "600ms",
        normal: "400ms",
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
        "fade-in": "fadeIn 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "sheet-in-right": "sheet-in-right 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "sheet-out-right": "sheet-out-right 250ms ease-in forwards",
        "sheet-in-left": "sheet-in-left 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "sheet-out-left": "sheet-out-left 250ms ease-in forwards",
        "sheet-in-bottom": "sheet-in-bottom 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "sheet-out-bottom": "sheet-out-bottom 250ms ease-in forwards",
        "sheet-in-top": "sheet-in-top 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "sheet-out-top": "sheet-out-top 250ms ease-in forwards",
        "overlay-in": "overlay-in 400ms ease-out forwards",
        "overlay-out": "overlay-out 200ms ease-in forwards",
      },
    },
  },
  plugins: [],
};

export default config;
