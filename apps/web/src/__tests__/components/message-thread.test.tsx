import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const messagingMocks = vi.hoisted(() => ({
  getConversationMessages: vi.fn(),
  sendMessage: vi.fn(),
  markConversationRead: vi.fn(),
}));

vi.mock("@/lib/data-client", () => ({
  ...messagingMocks,
}));

vi.mock("@/lib/auth", () => ({
  useAuth: () => ({
    user: { id: "user-self", role: "CLIENT" },
    accessToken: "test-token",
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
  }),
  AuthContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

import { MessageThread } from "@/components/messages/message-thread";

const CONVERSATION_ID = "11111111-1111-4111-8111-111111111111";
const RECIPIENT_ID = "22222222-2222-4222-8222-222222222222";

function message(overrides: Record<string, unknown> = {}) {
  return {
    id: `m-${Math.random().toString(36).slice(2)}`,
    conversationId: CONVERSATION_ID,
    senderId: "user-self",
    text: "hello",
    imageUrl: null,
    readAt: null,
    createdAt: "2026-09-01T12:00:00Z",
    ...overrides,
  };
}

describe("MessageThread", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders loading, then messages with participant name", async () => {
    messagingMocks.getConversationMessages.mockResolvedValue([
      message({ id: "m1", text: "first", senderId: "user-self" }),
      message({ id: "m2", text: "second", senderId: RECIPIENT_ID }),
    ]);
    messagingMocks.markConversationRead.mockResolvedValue(0);

    render(
      <MessageThread
        conversationId={CONVERSATION_ID}
        recipientId={RECIPIENT_ID}
        recipientName="Rita Receiver"
        backHref="/dashboard/client/messages"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("first")).toBeTruthy();
    });
    expect(screen.getByText("second")).toBeTruthy();
    expect(screen.getByText(/Rita Receiver/)).toBeTruthy();
  });

  it("renders own and other messages with distinguishing alignment", async () => {
    messagingMocks.getConversationMessages.mockResolvedValue([
      message({ id: "m1", text: "mine", senderId: "user-self" }),
      message({ id: "m2", text: "theirs", senderId: RECIPIENT_ID }),
    ]);
    messagingMocks.markConversationRead.mockResolvedValue(0);

    render(
      <MessageThread
        conversationId={CONVERSATION_ID}
        recipientId={RECIPIENT_ID}
        recipientName="Rita Receiver"
        backHref="/dashboard/client/messages"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("theirs")).toBeTruthy();
    });
    const own = screen.getByText("mine").closest("[data-alignment]");
    const other = screen.getByText("theirs").closest("[data-alignment]");
    expect(own?.getAttribute("data-alignment")).toBe("self");
    expect(other?.getAttribute("data-alignment")).toBe("other");
  });

  it("calls mark_conversation_read when the thread opens", async () => {
    messagingMocks.getConversationMessages.mockResolvedValue([]);
    messagingMocks.markConversationRead.mockResolvedValue(0);

    render(
      <MessageThread
        conversationId={CONVERSATION_ID}
        recipientId={RECIPIENT_ID}
        recipientName="Rita Receiver"
        backHref="/dashboard/client/messages"
      />,
    );

    await waitFor(() => {
      expect(messagingMocks.markConversationRead).toHaveBeenCalledWith(
        CONVERSATION_ID,
      );
    });
  });

  it("shows the failure state when loading fails", async () => {
    messagingMocks.getConversationMessages.mockRejectedValue(
      new Error("Network down"),
    );
    messagingMocks.markConversationRead.mockResolvedValue(0);

    render(
      <MessageThread
        conversationId={CONVERSATION_ID}
        recipientId={RECIPIENT_ID}
        recipientName="Rita Receiver"
        backHref="/dashboard/client/messages"
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
  });

  it("shows the empty state when there are no messages", async () => {
    messagingMocks.getConversationMessages.mockResolvedValue([]);
    messagingMocks.markConversationRead.mockResolvedValue(0);

    render(
      <MessageThread
        conversationId={CONVERSATION_ID}
        recipientId={RECIPIENT_ID}
        recipientName="Rita Receiver"
        backHref="/dashboard/client/messages"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/no messages yet/i)).toBeTruthy();
    });
  });

  it("sends a message through the composer and appends it", async () => {
    messagingMocks.getConversationMessages.mockResolvedValue([]);
    messagingMocks.markConversationRead.mockResolvedValue(0);
    messagingMocks.sendMessage.mockResolvedValue(
      message({ id: "m9", text: "fresh note", senderId: "user-self" }),
    );

    render(
      <MessageThread
        conversationId={CONVERSATION_ID}
        recipientId={RECIPIENT_ID}
        recipientName="Rita Receiver"
        backHref="/dashboard/client/messages"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/no messages yet/i)).toBeTruthy();
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "fresh note" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(messagingMocks.sendMessage).toHaveBeenCalledWith({
        recipientId: RECIPIENT_ID,
        text: "fresh note",
      });
    });
    await waitFor(() => {
      expect(screen.getByText("fresh note")).toBeTruthy();
    });
  });

  it("shows an alert when sending fails and keeps the draft", async () => {
    messagingMocks.getConversationMessages.mockResolvedValue([]);
    messagingMocks.markConversationRead.mockResolvedValue(0);
    messagingMocks.sendMessage.mockRejectedValue(new Error("Could not send."));

    render(
      <MessageThread
        conversationId={CONVERSATION_ID}
        recipientId={RECIPIENT_ID}
        recipientName="Rita Receiver"
        backHref="/dashboard/client/messages"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/no messages yet/i)).toBeTruthy();
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "doomed draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe(
      "doomed draft",
    );
  });

  it("polls for new messages while visible and stops when hidden", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      messagingMocks.getConversationMessages.mockResolvedValue([]);
      messagingMocks.markConversationRead.mockResolvedValue(0);

      render(
        <MessageThread
          conversationId={CONVERSATION_ID}
          recipientId={RECIPIENT_ID}
          recipientName="Rita Receiver"
          backHref="/dashboard/client/messages"
        />,
      );

      await waitFor(() => {
        expect(messagingMocks.getConversationMessages).toHaveBeenCalled();
      });
      const visibleCalls = messagingMocks.getConversationMessages.mock.calls.length;

      vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
      vi.advanceTimersByTime(60_000);
      expect(messagingMocks.getConversationMessages.mock.calls.length).toBe(
        visibleCalls,
      );

      vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
      vi.advanceTimersByTime(60_000);
      expect(
        messagingMocks.getConversationMessages.mock.calls.length,
      ).toBeGreaterThan(visibleCalls);
    } finally {
      vi.useRealTimers();
    }
  });
});