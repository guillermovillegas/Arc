export const fontFamily = {
  display: "Bricolage Grotesque, sans-serif",
  body: "Inter, system-ui, sans-serif",
  editorial: "Cormorant Garamond, Georgia, serif",
  mono: "Geist Mono, ui-monospace, monospace",
} as const;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 800,
} as const;

export const fontSize = {
  "display-xl": { size: "7rem", lineHeight: 0.92, letterSpacing: "-0.04em", weight: 700 },
  "display-lg": { size: "5rem", lineHeight: 0.94, letterSpacing: "-0.04em", weight: 700 },
  display: { size: "3.5rem", lineHeight: 0.95, letterSpacing: "-0.04em", weight: 700 },
  "editorial-xl": { size: "5rem", lineHeight: 1.05, letterSpacing: "-0.02em", weight: 300 },
  "editorial-lg": { size: "3rem", lineHeight: 1.10, letterSpacing: "-0.02em", weight: 300 },
  editorial: { size: "1.5rem", lineHeight: 1.40, letterSpacing: "-0.005em", weight: 300 },
  heading: { size: "2rem", lineHeight: 1.05, letterSpacing: "-0.03em", weight: 700 },
  subheading: { size: "1.25rem", lineHeight: 1.30, letterSpacing: "-0.02em", weight: 500 },
  "body-lg": { size: "1.125rem", lineHeight: 1.55, letterSpacing: "0", weight: 400 },
  body: { size: "1rem", lineHeight: 1.55, letterSpacing: "0", weight: 400 },
  "body-sm": { size: "0.875rem", lineHeight: 1.50, letterSpacing: "0", weight: 400 },
  caption: { size: "0.75rem", lineHeight: 1.50, letterSpacing: "0.04em", weight: 400 },
  label: { size: "0.6875rem", lineHeight: 1.40, letterSpacing: "0.32em", weight: 500 },
  mono: { size: "0.8125rem", lineHeight: 1.55, letterSpacing: "0.04em", weight: 400 },
} as const;

export type FontSizeKey = keyof typeof fontSize;
