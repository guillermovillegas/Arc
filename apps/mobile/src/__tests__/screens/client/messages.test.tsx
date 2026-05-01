import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import * as apiClient from "@/lib/api-client";
import * as auth from "@/lib/auth";
import MessagesScreen from "@/app/(client)/messages";

jest.mock("@/lib/api-client");
jest.mock("@/lib/auth");

beforeEach(() => {
  jest.clearAllMocks();
});

const mockConversations = [
  {
    id: "c1",
    otherParticipant: { id: "u2", firstName: "Marcus", lastName: "Johnson" },
    lastMessage: { text: "See you tomorrow at 10!", createdAt: "2026-03-27T15:00:00Z" },
  },
  {
    id: "c2",
    otherParticipant: { id: "u3", firstName: "Sarah", lastName: "Lee" },
    lastMessage: null,
  },
];

describe("MessagesScreen", () => {
  it("loads conversations with stored token", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok-123" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockConversations });

    render(<MessagesScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalledWith("/messages/conversations", { token: "tok-123" });
    });
  });

  it("displays conversation participant names", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockConversations });

    const { getByText } = render(<MessagesScreen />);

    await waitFor(() => {
      expect(getByText("Marcus Johnson")).toBeTruthy();
      expect(getByText("Sarah Lee")).toBeTruthy();
    });
  });

  it("displays last message preview", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockConversations });

    const { getByText } = render(<MessagesScreen />);

    await waitFor(() => {
      expect(getByText("See you tomorrow at 10!")).toBeTruthy();
    });
  });

  it("renders avatar initials", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockConversations });

    const { getByText } = render(<MessagesScreen />);

    await waitFor(() => {
      expect(getByText("MJ")).toBeTruthy();
      expect(getByText("SL")).toBeTruthy();
    });
  });

  it("shows empty state when no conversations", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const { getByText } = render(<MessagesScreen />);

    await waitFor(() => {
      expect(
        getByText(
          "Most clients don’t message. The few who do are usually about parking.",
        ),
      ).toBeTruthy();
    });
  });

  it("does not fetch when no access token", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: null });

    render(<MessagesScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).not.toHaveBeenCalled();
    });
  });
});
