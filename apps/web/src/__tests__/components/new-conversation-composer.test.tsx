import { afterEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
  push: vi.fn(),
}));

vi.mock("@/lib/data-client", () => ({
  sendMessage: mocks.sendMessage,
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

import { NewConversationComposer } from "@/components/messages/new-conversation-composer";

const RECIPIENT_ID = "22222222-2222-4222-8222-222222222222";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

function renderComposer() {
  render(
    <NewConversationComposer
      recipientId={RECIPIENT_ID}
      recipientName="Rita Receiver"
      threadHrefFor={(id) => `/dashboard/client/messages/${id}`}
      backHref="/dashboard/client/messages"
    />,
  );
}

describe("NewConversationComposer", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the recipient name", () => {
    renderComposer();
    expect(screen.getByText(/Rita Receiver/)).toBeTruthy();
  });

  it("sends the first message and navigates to the created conversation", async () => {
    mocks.sendMessage.mockResolvedValue({
      id: "m1",
      conversationId: "conv-1",
      senderId: "user-self",
      text: "first note",
      imageUrl: null,
      readAt: null,
      createdAt: "2026-09-01T12:00:00Z",
    });

    render(
      <NewConversationComposer
        recipientId={RECIPIENT_ID}
        recipientName="Rita Receiver"
        threadHrefFor={(id) => `/dashboard/client/messages/${id}`}
        backHref="/dashboard/client/messages"
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "first note" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(mocks.sendMessage).toHaveBeenCalledWith({
        recipientId: RECIPIENT_ID,
        text: "first note",
      });
    });
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        "/dashboard/client/messages/conv-1",
      );
    });
  });

  it("blocks an empty message without calling the RPC", () => {
    render(
      <NewConversationComposer recipientId={RECIPIENT_ID} recipientName="Rita Receiver" threadHrefFor={(id) => `/dashboard/client/messages/${id}`} backHref="/dashboard/client/messages" />,
    );
    const send = screen.getByRole("button", { name: /send/i }) as HTMLButtonElement;
    expect(send.disabled).toBe(true);
    expect(mocks.sendMessage).not.toHaveBeenCalled();
  });

  it("blocks a message over 2000 characters", () => {
    render(
      <NewConversationComposer recipientId={RECIPIENT_ID} recipientName="Rita Receiver" threadHrefFor={(id) => `/dashboard/client/messages/${id}`} backHref="/dashboard/client/messages" />,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "x".repeat(2001) },
    });
    const send = screen.getByRole("button", { name: /send/i }) as HTMLButtonElement;
    expect(send.disabled).toBe(true);
    expect(mocks.sendMessage).not.toHaveBeenCalled();
  });

  it("shows an alert and keeps the draft when sending fails", async () => {
    mocks.sendMessage.mockRejectedValue(new Error("Recipient not found"));

    render(
      <NewConversationComposer recipientId={RECIPIENT_ID} recipientName="Rita Receiver" threadHrefFor={(id) => `/dashboard/client/messages/${id}`} backHref="/dashboard/client/messages" />,
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "doomed" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe(
      "doomed",
    );
  });
});