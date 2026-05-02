// Numeric scale (rem) for web (extends Tailwind's default scale)
// and a named scale for native callers.
export const spacingExtensions = {
  "18": "4.5rem",
  "30": "7.5rem",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type SpacingKey = keyof typeof spacing;
