import { z } from "zod";

export const createBookingSchema = z.object({
  serviceId: z.string().uuid("Valid service ID is required"),
  startTime: z.string().datetime("Valid ISO 8601 datetime is required"),
  notes: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
