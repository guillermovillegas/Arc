import { z } from "zod";

const POST_CATEGORIES = [
  "GENERAL", "FOR_SALE", "TIPS", "COLLABORATION", "RECOMMENDATION",
] as const;

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  body: z.string().min(1, "Body is required").max(5000),
  category: z.enum(POST_CATEGORIES),
  imageUrl: z.string().url().optional(),
});

export const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty").max(2000),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
