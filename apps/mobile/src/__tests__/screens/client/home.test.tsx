import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import * as apiClient from "@/lib/api-client";
import ClientHomeScreen from "@/app/(client)/home";

jest.mock("@/lib/api-client");

const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
(useRouter as jest.Mock).mockReturnValue(mockRouter);

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

const mockProviders = [
  {
    id: "p1",
    slug: "marcus-cuts",
    businessName: "Marcus Cuts",
    bio: "Premium barber services",
    averageRating: 4.8,
    totalReviews: 42,
    distance: 2.3,
    user: { firstName: "Marcus", lastName: "Johnson" },
    services: [{ name: "Haircut", priceInCents: 3500 }],
  },
  {
    id: "p2",
    slug: "nail-studio",
    businessName: null,
    bio: null,
    averageRating: 4.5,
    totalReviews: 15,
    distance: null,
    user: { firstName: "Sarah", lastName: "Lee" },
    services: [{ name: "Manicure", priceInCents: 4000 }],
  },
];

describe("ClientHomeScreen", () => {
  it("renders search input", () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    const { getByPlaceholderText } = render(<ClientHomeScreen />);
    expect(getByPlaceholderText("Search by name, craft, or location\\u2026")).toBeTruthy();
  });

  it("loads and displays providers on mount", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: mockProviders } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("Marcus Cuts")).toBeTruthy();
      expect(getByText("★ 4.8 (42) · 2.3 mi")).toBeTruthy();
      expect(getByText("Premium barber services")).toBeTruthy();
    });
  });

  it("displays full name when no business name", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: mockProviders } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("Sarah Lee")).toBeTruthy();
    });
  });

  it("shows rating without distance when distance is null", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [mockProviders[1]] } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("★ 4.5 (15)")).toBeTruthy();
    });
  });

  it("shows empty state when no providers found", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("No professionals found")).toBeTruthy();
    });
  });

  it("searches providers on submit", async () => {
    (apiClient.api.get as jest.Mock)
      .mockResolvedValueOnce({ data: { items: [] } })
      .mockResolvedValueOnce({ data: { items: [mockProviders[0]] } });

    const { getByPlaceholderText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalledWith("/search/providers");
    });

    fireEvent.changeText(getByPlaceholderText("Search by name, craft, or location\\u2026"), "barber");
    fireEvent(getByPlaceholderText("Search by name, craft, or location\\u2026"), "submitEditing");

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalledWith("/search/providers?q=barber");
    });
  });

  it("navigates to provider profile on card press", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: mockProviders } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("Marcus Cuts")).toBeTruthy();
    });

    fireEvent.press(getByText("Marcus Cuts"));

    expect(mockRouter.push).toHaveBeenCalledWith("/provider/p1");
  });

  it("renders provider avatar initials", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: mockProviders } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("MJ")).toBeTruthy();
      expect(getByText("SL")).toBeTruthy();
    });
  });
});
