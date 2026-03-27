import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid().optional(), // omit to start new conversation
  recipientId: z.string().uuid().optional(), // required if no conversationId
  text: z.string().min(1, "Message cannot be empty").max(2000),
  imageUrl: z.string().url().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
