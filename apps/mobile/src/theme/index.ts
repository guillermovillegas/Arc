import { palette, fontFamily, fontWeight } from "@arc/shared";

// Re-export shared tokens so callers can use them directly when needed.
export { palette, fontFamily, fontWeight };

export const colors = {
  background: palette.smoke[900],
  card: palette.smoke[800],
  border: palette.smoke[700],
  hairlineWarm: palette.taupe[500],
  mutedFg: palette.taupe[300],
  primaryFg: palette.bone[100],
  secondaryFg: palette.bone[200],
  accent: palette.champagne[400],
  ...palette,
} as const;

export const fonts = {
  display: "BricolageGrotesque_700Bold",
  displayBlack: "BricolageGrotesque_800ExtraBold",
  displayMedium: "BricolageGrotesque_500Medium",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodyLight: "Inter_300Light",
  editorial: "CormorantGaramond_400Regular_Italic",
  editorialLight: "CormorantGaramond_300Light_Italic",
  mono: "Courier", // Geist Mono fallback
} as const;

export const sizes = {
  display: 32,
  heading: 26,
  subheading: 18,
  bodyLg: 16,
  body: 15,
  bodySm: 13,
  caption: 12,
  label: 11,
  mono: 12,
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
