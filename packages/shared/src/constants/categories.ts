export const ServiceCategory = {
  HAIRCUT: "HAIRCUT",
  FADE: "FADE",
  BEARD: "BEARD",
  BRAIDS: "BRAIDS",
  LOCS: "LOCS",
  COLOR: "COLOR",
  NAILS: "NAILS",
  BROWS: "BROWS",
  LASHES: "LASHES",
  MAKEUP: "MAKEUP",
  FACIAL: "FACIAL",
  WAXING: "WAXING",
  OTHER: "OTHER",
} as const;

export type ServiceCategory = (typeof ServiceCategory)[keyof typeof ServiceCategory];

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  HAIRCUT: "Haircut",
  FADE: "Fade",
  BEARD: "Beard Trim",
  BRAIDS: "Braids",
  LOCS: "Locs",
  COLOR: "Color",
  NAILS: "Nails",
  BROWS: "Brows",
  LASHES: "Lashes",
  MAKEUP: "Makeup",
  FACIAL: "Facial",
  WAXING: "Waxing",
  OTHER: "Other",
};
