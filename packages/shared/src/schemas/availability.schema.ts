import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const setAvailabilitySchema = z.object({
  slots: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      startTime: z.string().regex(timeRegex, "Time must be in HH:mm format"),
      endTime: z.string().regex(timeRegex, "Time must be in HH:mm format"),
    }),
  ),
});

export const createOverrideSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  isBlocked: z.boolean(),
  startTime: z.string().regex(timeRegex).optional(),
  endTime: z.string().regex(timeRegex).optional(),
  reason: z.string().max(200).optional(),
});

export type SetAvailabilityInput = z.infer<typeof setAvailabilitySchema>;
export type CreateOverrideInput = z.infer<typeof createOverrideSchema>;
