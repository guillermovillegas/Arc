import { prisma } from "../config/database";
import { AppError } from "../middleware/error-handler";

export async function getOrCreateConversation(userId: string, otherUserId: string) {
  // Normalize order to prevent duplicates
  const [participantAId, participantBId] =
    userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

  let conversation = await prisma.conversation.findUnique({
    where: { participantAId_participantBId: { participantAId, participantBId } },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { participantAId, participantBId },
    });
  }

  return conversation;
}

export async function sendMessage(
  userId: string,
  conversationId: string,
  text: string,
  imageUrl?: string,
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) throw new AppError(404, "NOT_FOUND", "Conversation not found");

  const isParticipant =
    conversation.participantAId === userId || conversation.participantBId === userId;
  if (!isParticipant) throw new AppError(403, "FORBIDDEN", "Not a participant");

  const message = await prisma.message.create({
    data: { conversationId, senderId: userId, text, imageUrl },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  return message;
}

export async function getConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participantAId: userId }, { participantBId: userId }],
    },
    include: {
      participantA: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      participantB: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return conversations.map((conv) => {
    const otherParticipant =
      conv.participantAId === userId ? conv.participantB : conv.participantA;
    return {
      id: conv.id,
      otherParticipant,
      lastMessage: conv.messages[0] || null,
      lastMessageAt: conv.lastMessageAt,
    };
  });
}

export async function getMessages(userId: string, conversationId: string, limit = 50, before?: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) throw new AppError(404, "NOT_FOUND", "Conversation not found");
  const isParticipant =
    conversation.participantAId === userId || conversation.participantBId === userId;
  if (!isParticipant) throw new AppError(403, "FORBIDDEN", "Not a participant");

  return prisma.message.findMany({
    where: {
      conversationId,
      ...(before && { createdAt: { lt: new Date(before) } }),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
    },
  });
}
