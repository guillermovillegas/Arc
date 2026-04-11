import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          150: "#ededed",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        // Arc brand palette — warm editorial luxury
        ivory: {
          50: "#fdfcf8",
          100: "#faf8f3",
          200: "#f5f1e8",
          300: "#ede6d4",
          400: "#dfd3b4",
          500: "#c9b890",
          600: "#a89772",
          700: "#83735a",
          800: "#5a4e3d",
          900: "#3a3228",
          950: "#1a1512",
        },
        espresso: {
          50: "#f6f4f0",
          100: "#e8e3d9",
          200: "#cdc3b0",
          300: "#a8997d",
          400: "#827259",
          500: "#5f5340",
          600: "#463c2e",
          700: "#2f271d",
          800: "#1c1712",
          900: "#120e0a",
          950: "#0a0806",
        },
        brass: {
          50: "#fbf8f0",
          100: "#f5eeda",
          200: "#ead9ad",
          300: "#dcc07d",
          400: "#cca656",
          500: "#b8935a",
          600: "#9c7a45",
          700: "#7a5e37",
          800: "#5c4829",
          900: "#3f311c",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        // Editorial serif display sizes — tighter leading, lighter weight
        "editorial-xl": ["5rem", { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "400" }],
        "editorial-lg": ["4rem", { lineHeight: "0.98", letterSpacing: "-0.03em", fontWeight: "400" }],
        "editorial": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "400" }],
        "heading": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "subheading": ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
        "label": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.18em", fontWeight: "500" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Sheet overlay
        "overlay-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "overlay-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // Sheet slide: right
        "sheet-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "sheet-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        // Sheet slide: left
        "sheet-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "sheet-out-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        // Sheet slide: top
        "sheet-in-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "sheet-out-top": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        // Sheet slide: bottom
        "sheet-in-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "sheet-out-bottom": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
        // Sheet animations
        "overlay-in": "overlay-in 0.3s ease-out forwards",
        "overlay-out": "overlay-out 0.2s ease-in forwards",
        "sheet-in-right": "sheet-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "sheet-out-right": "sheet-out-right 0.3s ease-in forwards",
        "sheet-in-left": "sheet-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "sheet-out-left": "sheet-out-left 0.3s ease-in forwards",
        "sheet-in-top": "sheet-in-top 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "sheet-out-top": "sheet-out-top 0.3s ease-in forwards",
        "sheet-in-bottom": "sheet-in-bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "sheet-out-bottom": "sheet-out-bottom 0.3s ease-in forwards",
      },
    },
  },
  plugins: [],
};

export default config;
