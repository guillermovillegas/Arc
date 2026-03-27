import { z } from "zod";

const SERVICE_CATEGORIES = [
  "HAIRCUT", "FADE", "BEARD", "BRAIDS", "LOCS", "COLOR",
  "NAILS", "BROWS", "LASHES", "MAKEUP", "FACIAL", "WAXING", "OTHER",
] as const;

export const createServiceSchema = z.object({
  name: z.string().min(1, "Service name is required").max(100),
  description: z.string().max(500).optional(),
  category: z.enum(SERVICE_CATEGORIES),
  durationMinutes: z.number().int().min(15).max(480),
  priceInCents: z.number().int().min(0),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
