// Tailwind defaults — declared here so non-web consumers (emails, PDFs,
// container queries) have a single source of truth.
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export type BreakpointKey = keyof typeof breakpoints;
