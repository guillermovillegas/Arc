import { afterEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  listConversations: vi.fn(),
}));

vi.mock("@/lib/data-client", () => ({
  listConversations: mocks.listConversations,
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

import { ConversationList } from "@/components/messages/conversation-list";

function conversation(overrides: Record<string, unknown> = {}) {
  return {
    id: `c-${Math.random().toString(36).slice(2)}`,
    otherParticipant: {
      id: "user-other",
      firstName: "Rita",
      lastName: "Receiver",
      avatarUrl: null,
    },
    lastMessage: {
      text: "last one",
      createdAt: "2026-09-01T12:00:00Z",
      readAt: null,
      senderId: "user-other",
    },
    ...overrides,
  };
}

describe("ConversationList", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("links each conversation row to the thread route", async () => {
    mocks.listConversations.mockResolvedValue([conversation()]);
    render(<ConversationList role="client" />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /rita receiver/i })).toBeTruthy();
    });
    expect(
      screen.getByRole("link", { name: /rita receiver/i }).getAttribute("href"),
    ).toMatch(/\/dashboard\/client\/messages\//);
  });

  it("shows an unread marker for an unread, other-sent last message", async () => {
    mocks.listConversations.mockResolvedValue([conversation()]);
    render(<ConversationList role="client" />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /rita receiver/i })).toBeTruthy();
    });
    expect(screen.getByLabelText("unread")).toBeTruthy();
  });

  it("hides the unread marker for own messages", async () => {
    mocks.listConversations.mockResolvedValue([
      conversation({
        lastMessage: {
          text: "mine",
          createdAt: "2026-09-01T12:00:00Z",
          readAt: null,
          senderId: "user-self",
        },
      }),
    ]);
    render(<ConversationList role="client" />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /rita receiver/i })).toBeTruthy();
    });
    expect(screen.queryByLabelText("unread")).toBeNull();
  });

  it("hides the unread marker for read messages from others", async () => {
    mocks.listConversations.mockResolvedValue([
      conversation({
        lastMessage: {
          text: "read yours",
          createdAt: "2026-09-01T12:00:00Z",
          readAt: "2026-09-01T13:00:00Z",
          senderId: "user-other",
        },
      }),
    ]);
    render(<ConversationList role="client" />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /rita receiver/i })).toBeTruthy();
    });
    expect(screen.queryByLabelText("unread")).toBeNull();
  });

  it("renders the empty state when there are no conversations", async () => {
    mocks.listConversations.mockResolvedValue([]);
    render(<ConversationList role="client" />);
    await waitFor(() => {
      expect(screen.getByText(/no messages/i)).toBeTruthy();
    });
  });

  it("renders the failure state when listing fails", async () => {
    mocks.listConversations.mockRejectedValue(new Error("Inbox unavailable"));
    render(<ConversationList role="client" />);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
  });

  it("renders the loading state before data arrives", () => {
    mocks.listConversations.mockReturnValue(new Promise(() => undefined));
    render(<ConversationList role="client" />);
    expect(screen.getByText(/opening the inbox/i)).toBeTruthy();
  });
});