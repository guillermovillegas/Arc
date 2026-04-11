import { z } from "zod";

export const addIcsFeedSchema = z.object({
  feedUrl: z.string().url("Must be a valid URL").refine(
    (url) => url.startsWith("https://") || url.startsWith("http://") || url.startsWith("webcal://"),
    "Must be an HTTP, HTTPS, or webcal:// URL"
  ),
});

export type AddIcsFeedInput = z.infer<typeof addIcsFeedSchema>;

export const triggerSyncSchema = z.object({
  connectionId: z.string().uuid(),
});

export type TriggerSyncInput = z.infer<typeof triggerSyncSchema>;
