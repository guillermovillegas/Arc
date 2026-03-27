import { z } from "zod";

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const updateProviderProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  businessName: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  serviceRadius: z.number().min(1).max(100).optional(), // miles
});

export const createPortfolioItemSchema = z.object({
  imageUrl: z.string().url("Valid image URL is required"),
  caption: z.string().max(200).optional(),
  serviceId: z.string().uuid().optional(),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type UpdateProviderProfileInput = z.infer<typeof updateProviderProfileSchema>;
export type CreatePortfolioItemInput = z.infer<typeof createPortfolioItemSchema>;
