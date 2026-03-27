"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

interface ConversationItem {
  id: string;
  otherParticipant: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  lastMessage: { text: string; createdAt: string } | null;
}

export default function ClientMessagesPage() {
  const { accessToken } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  useEffect(() => {
    if (accessToken) loadConversations();
  }, [accessToken]);

  async function loadConversations() {
    try {
      const res = await api.get<{ data: ConversationItem[] }>("/messages/conversations", {
        token: accessToken!,
      });
      setConversations(res.data);
    } catch {
      // Handle error
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>

      <div className="mt-6 space-y-3">
        {conversations.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No conversations yet. Start one by messaging a provider!
          </p>
        ) : (
          conversations.map((conv) => (
            <Card key={conv.id} padding="sm" className="cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
                  {conv.otherParticipant.firstName[0]}{conv.otherParticipant.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">
                    {conv.otherParticipant.firstName} {conv.otherParticipant.lastName}
                  </h3>
                  {conv.lastMessage && (
                    <p className="truncate text-sm text-gray-500">{conv.lastMessage.text}</p>
                  )}
                </div>
                {conv.lastMessage && (
                  <span className="text-xs text-gray-400">
                    {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
