import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import * as apiClient from "@/lib/api-client";
import * as auth from "@/lib/auth";
import ProviderBookingsScreen from "@/app/(provider)/bookings";

jest.mock("@/lib/api-client");
jest.mock("@/lib/auth");

beforeEach(() => {
  jest.clearAllMocks();
});

const mockBookings = [
  {
    id: "b1",
    status: "PENDING",
    startTime: "2026-03-28T10:00:00.000Z",
    totalPriceInCents: 3500,
    notes: "Skin fade please",
    service: { name: "Haircut" },
    client: { firstName: "John", lastName: "Doe" },
  },
  {
    id: "b2",
    status: "CONFIRMED",
    startTime: "2026-03-28T14:00:00.000Z",
    totalPriceInCents: 7500,
    notes: null,
    service: { name: "Hair Color" },
    client: { firstName: "Jane", lastName: "Smith" },
  },
  {
    id: "b3",
    status: "IN_PROGRESS",
    startTime: "2026-03-28T16:00:00.000Z",
    totalPriceInCents: 5000,
    notes: null,
    service: { name: "Braids" },
    client: { firstName: "Lisa", lastName: "Chen" },
  },
  {
    id: "b4",
    status: "COMPLETED",
    startTime: "2026-03-27T10:00:00.000Z",
    totalPriceInCents: 3500,
    notes: null,
    service: { name: "Trim" },
    client: { firstName: "Mike", lastName: "Brown" },
  },
];

describe("ProviderBookingsScreen", () => {
  it("loads bookings with stored token", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok-123" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockBookings });

    render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalledWith("/bookings/provider", { token: "tok-123" });
    });
  });

  it("displays booking details", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockBookings });

    const { getByText, getAllByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Haircut")).toBeTruthy();
      expect(getAllByText("$35.00").length).toBeGreaterThanOrEqual(1);
      expect(getByText("John Doe")).toBeTruthy();
    });
  });

  it("shows Confirm and Decline buttons for PENDING bookings", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: [mockBookings[0]] });

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Confirm")).toBeTruthy();
      expect(getByText("Decline")).toBeTruthy();
    });
  });

  it("shows Start button for CONFIRMED bookings", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: [mockBookings[1]] });

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Start")).toBeTruthy();
    });
  });

  it("shows Complete button for IN_PROGRESS bookings", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: [mockBookings[2]] });

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Complete")).toBeTruthy();
    });
  });

  it("shows no action buttons for COMPLETED bookings", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: [mockBookings[3]] });

    const { queryByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(queryByText("Confirm")).toBeNull();
      expect(queryByText("Start")).toBeNull();
      expect(queryByText("Complete")).toBeNull();
    });
  });

  it("calls confirm status API when Confirm pressed", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValue({ data: [mockBookings[0]] });
    (apiClient.api.patch as jest.Mock).mockResolvedValueOnce({});

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Confirm")).toBeTruthy();
    });

    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      expect(apiClient.api.patch).toHaveBeenCalledWith(
        "/bookings/b1/status",
        { status: "CONFIRMED" },
        { token: "tok" },
      );
    });
  });

  it("calls cancel status API when Decline pressed", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValue({ data: [mockBookings[0]] });
    (apiClient.api.patch as jest.Mock).mockResolvedValueOnce({});

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Decline")).toBeTruthy();
    });

    fireEvent.press(getByText("Decline"));

    await waitFor(() => {
      expect(apiClient.api.patch).toHaveBeenCalledWith(
        "/bookings/b1/status",
        { status: "CANCELLED" },
        { token: "tok" },
      );
    });
  });

  it("calls start status API when Start pressed", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValue({ data: [mockBookings[1]] });
    (apiClient.api.patch as jest.Mock).mockResolvedValueOnce({});

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Start")).toBeTruthy();
    });

    fireEvent.press(getByText("Start"));

    await waitFor(() => {
      expect(apiClient.api.patch).toHaveBeenCalledWith(
        "/bookings/b2/status",
        { status: "IN_PROGRESS" },
        { token: "tok" },
      );
    });
  });

  it("calls complete status API when Complete pressed", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValue({ data: [mockBookings[2]] });
    (apiClient.api.patch as jest.Mock).mockResolvedValueOnce({});

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Complete")).toBeTruthy();
    });

    fireEvent.press(getByText("Complete"));

    await waitFor(() => {
      expect(apiClient.api.patch).toHaveBeenCalledWith(
        "/bookings/b3/status",
        { status: "COMPLETED" },
        { token: "tok" },
      );
    });
  });

  it("reloads bookings after status update", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValue({ data: [mockBookings[0]] });
    (apiClient.api.patch as jest.Mock).mockResolvedValueOnce({});

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Confirm")).toBeTruthy();
    });

    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      // Initial load + reload after status update
      expect(apiClient.api.get).toHaveBeenCalledTimes(2);
    });
  });

  it("shows alert on status update error", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValue({ data: [mockBookings[0]] });
    (apiClient.api.patch as jest.Mock).mockRejectedValueOnce(new Error("Conflict"));
    const alertSpy = jest.spyOn(Alert, "alert");

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Confirm")).toBeTruthy();
    });

    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Conflict");
    });
  });

  it("shows empty state when no bookings", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const { getByText } = render(<ProviderBookingsScreen />);

    await waitFor(() => {
      expect(getByText("Quiet so far.")).toBeTruthy();
    });
  });
});
