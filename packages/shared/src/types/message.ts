export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageAt: string | null;
  createdAt: string;
}

export interface ConversationWithPreview extends Conversation {
  lastMessage: Message | null;
  otherParticipant: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  imageUrl: string | null;
  readAt: string | null;
  createdAt: string;
}
