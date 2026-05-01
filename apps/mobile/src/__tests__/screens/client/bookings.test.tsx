import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import * as apiClient from "@/lib/api-client";
import * as auth from "@/lib/auth";
import ClientBookingsScreen from "@/app/(client)/bookings";

jest.mock("@/lib/api-client");
jest.mock("@/lib/auth");

beforeEach(() => {
  jest.clearAllMocks();
});

const mockBookings = [
  {
    id: "b1",
    status: "CONFIRMED",
    startTime: "2026-03-28T10:00:00.000Z",
    totalPriceInCents: 3500,
    service: { name: "Haircut" },
    providerProfile: { user: { firstName: "Marcus", lastName: "Johnson" } },
  },
  {
    id: "b2",
    status: "COMPLETED",
    startTime: "2026-03-25T14:00:00.000Z",
    totalPriceInCents: 7500,
    service: { name: "Hair Color" },
    providerProfile: { user: { firstName: "Sarah", lastName: "Lee" } },
  },
  {
    id: "b3",
    status: "PENDING",
    startTime: "2026-03-30T09:00:00.000Z",
    totalPriceInCents: 5000,
    service: { name: "Braids" },
    providerProfile: { user: { firstName: "Lisa", lastName: "Chen" } },
  },
];

describe("ClientBookingsScreen", () => {
  it("loads bookings with stored token", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok-123" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockBookings });

    render(<ClientBookingsScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalledWith("/bookings/client", { token: "tok-123" });
    });
  });

  it("renders editorial header", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockBookings });

    const { getByText } = render(<ClientBookingsScreen />);

    await waitFor(() => {
      expect(getByText("YOUR VISITS")).toBeTruthy();
      expect(getByText("calendar.")).toBeTruthy();
    });
  });

  it("displays the next upcoming visit in the hero card", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockBookings });

    const { getByText } = render(<ClientBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Next visit")).toBeTruthy();
      expect(getByText("Haircut")).toBeTruthy();
    });
  });

  it("displays past visits with service names and providers", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockBookings });

    const { getByText } = render(<ClientBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Past visits")).toBeTruthy();
      expect(getByText("Hair Color")).toBeTruthy();
    });
  });

  it("displays past visit price as whole dollars", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockBookings });

    const { getByText } = render(<ClientBookingsScreen />);

    await waitFor(() => {
      expect(getByText("$75")).toBeTruthy();
    });
  });

  it("shows empty hero card when no bookings", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const { getByText } = render(<ClientBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Nothing scheduled")).toBeTruthy();
      expect(getByText("The calendar is empty.")).toBeTruthy();
    });
  });

  it("does not fetch when no access token", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: null });

    render(<ClientBookingsScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).not.toHaveBeenCalled();
    });
  });
});
