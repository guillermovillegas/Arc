import { palette } from "./palette";

// Role-based tokens. Components should prefer these over raw palette refs
// so the brand can be reskinned without touching every component.
//
// On web these mirror the CSS vars in apps/web/src/styles/globals.css —
// keep the two in sync. The CSS vars are still the runtime source for
// Tailwind utilities like `bg-background`; this object is for non-Tailwind
// consumers (charts, emails, PDFs, native).
export const semantic = {
  surface: {
    canvas: palette.smoke[900],
    raised: palette.smoke[800],
    sunken: palette.smoke[950],
    sidebar: palette.smoke[950],
  },
  text: {
    primary: palette.bone[100],
    secondary: palette.bone[200],
    muted: palette.taupe[300],
    inverse: palette.smoke[900],
  },
  border: {
    subtle: palette.smoke[700],
    warm: palette.taupe[500],
    strong: palette.bone[100],
  },
  accent: {
    DEFAULT: palette.champagne[400],
    hover: palette.champagne[500],
    soft: palette.champagne[300],
  },
  destructive: palette.oxblood[500],
} as const;

export type SemanticToken = typeof semantic;
