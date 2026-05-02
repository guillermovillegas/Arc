import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254),
  source: z.string().max(64).optional(),
  referrer: z.string().max(512).optional(),
  // Honeypot: bots fill this; real users never see it. Must be empty.
  website: z.string().max(0).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
