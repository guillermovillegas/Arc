export const palette = {
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
} as const;

export type PaletteScale = keyof typeof palette;
