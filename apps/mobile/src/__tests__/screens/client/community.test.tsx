import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import * as apiClient from "@/lib/api-client";
import CommunityScreen from "@/app/(client)/community";

jest.mock("@/lib/api-client");

beforeEach(() => {
  jest.clearAllMocks();
});

const mockPosts = [
  {
    id: "post1",
    title: "Best barber in downtown?",
    body: "Looking for recommendations for a good barber in the downtown area. I need someone who specializes in fades.",
    category: "RECOMMENDATION",
    commentsCount: 5,
    createdAt: "2026-03-26T10:00:00Z",
    author: { firstName: "Alex", lastName: "Rivera" },
  },
  {
    id: "post2",
    title: "Tips for first-time clients",
    body: "If you're new to ARC, here are some tips for getting the best experience.",
    category: "TIPS",
    commentsCount: 12,
    createdAt: "2026-03-25T08:00:00Z",
    author: { firstName: "Jordan", lastName: "Kim" },
  },
];

describe("CommunityScreen", () => {
  it("loads posts on mount", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: mockPosts } });

    render(<CommunityScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalledWith("/posts");
    });
  });

  it("displays post titles and categories", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: mockPosts } });

    const { getByText } = render(<CommunityScreen />);

    await waitFor(() => {
      expect(getByText("Best barber in downtown?")).toBeTruthy();
      expect(getByText("RECOMMENDATION")).toBeTruthy();
      expect(getByText("Tips for first-time clients")).toBeTruthy();
      expect(getByText("TIPS")).toBeTruthy();
    });
  });

  it("displays author names", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: mockPosts } });

    const { getByText } = render(<CommunityScreen />);

    await waitFor(() => {
      expect(getByText("Alex Rivera")).toBeTruthy();
      expect(getByText("Jordan Kim")).toBeTruthy();
    });
  });

  it("displays comment counts", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: mockPosts } });

    const { getByText } = render(<CommunityScreen />);

    await waitFor(() => {
      expect(getByText("5 comments")).toBeTruthy();
      expect(getByText("12 comments")).toBeTruthy();
    });
  });

  it("shows empty state when no posts", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    const { getByText } = render(<CommunityScreen />);

    await waitFor(() => {
      expect(getByText("No posts yet")).toBeTruthy();
    });
  });
});
