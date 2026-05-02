// Sharp by design — see CLAUDE.md "Design System".
export const radius = {
  sm: "0.125rem",
  DEFAULT: "0.125rem",
  md: "0.25rem",
  lg: "0.375rem",
  xl: "0.5rem",
  "2xl": "0.75rem",
} as const;

export type RadiusKey = keyof typeof radius;
