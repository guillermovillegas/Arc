import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import * as apiClient from "@/lib/api-client";
import * as auth from "@/lib/auth";
import EarningsScreen from "@/app/(provider)/earnings";

jest.mock("@/lib/api-client");
jest.mock("@/lib/auth");

beforeEach(() => {
  jest.clearAllMocks();
});

const mockEarnings = {
  totalEarnings: 25000,
  payments: [
    {
      id: "pay1",
      providerPayoutInCents: 3400,
      createdAt: "2026-03-27T10:00:00Z",
      booking: { startTime: "2026-03-27T10:00:00Z", service: { name: "Haircut" } },
    },
    {
      id: "pay2",
      providerPayoutInCents: 7275,
      createdAt: "2026-03-26T14:00:00Z",
      booking: { startTime: "2026-03-26T14:00:00Z", service: { name: "Hair Color" } },
    },
  ],
};

describe("EarningsScreen", () => {
  it("loads earnings with stored token", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok-123" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockEarnings });

    render(<EarningsScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalledWith("/payments/earnings", { token: "tok-123" });
    });
  });

  it("displays total earnings", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockEarnings });

    const { getByText } = render(<EarningsScreen />);

    await waitFor(() => {
      expect(getByText("$250.00")).toBeTruthy();
    });
  });

  it("displays Total Earnings label", () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockEarnings });

    const { getByText } = render(<EarningsScreen />);
    expect(getByText("TO DATE")).toBeTruthy();
    expect(getByText("earned.")).toBeTruthy();
  });

  it("displays Payment History section", () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockEarnings });

    const { getByText } = render(<EarningsScreen />);
    expect(getByText("HISTORY")).toBeTruthy();
  });

  it("displays individual payment amounts", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockEarnings });

    const { getByText } = render(<EarningsScreen />);

    await waitFor(() => {
      expect(getByText("+$34.00")).toBeTruthy();
      expect(getByText("+$72.75")).toBeTruthy();
    });
  });

  it("displays service names in payment list", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: mockEarnings });

    const { getByText } = render(<EarningsScreen />);

    await waitFor(() => {
      expect(getByText("Haircut")).toBeTruthy();
      expect(getByText("Hair Color")).toBeTruthy();
    });
  });

  it("shows $0.00 when earnings not loaded yet", () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce(new Promise(() => {})); // never resolves

    const { getByText } = render(<EarningsScreen />);
    expect(getByText("$0.00")).toBeTruthy();
  });

  it("shows empty state when no payments", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: "tok" });
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({
      data: { totalEarnings: 0, payments: [] },
    });

    const { getByText } = render(<EarningsScreen />);

    await waitFor(() => {
      expect(getByText("No payments yet.")).toBeTruthy();
    });
  });

  it("does not fetch when no access token", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ accessToken: null });

    render(<EarningsScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).not.toHaveBeenCalled();
    });
  });
});
