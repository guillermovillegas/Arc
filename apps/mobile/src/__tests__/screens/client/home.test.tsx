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

describe("ClientHomeScreen", () => {
  it("renders FAINEANT editorial headline", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("TODAY")).toBeTruthy();
      expect(getByText("nothing")).toBeTruthy();
    });
  });

  it("renders all six service category tiles", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("Hair")).toBeTruthy();
      expect(getByText("Nails")).toBeTruthy();
      expect(getByText("Face")).toBeTruthy();
      expect(getByText("Lash")).toBeTruthy();
      expect(getByText("Barber")).toBeTruthy();
      expect(getByText("Makeup")).toBeTruthy();
    });
  });

  it("renders editorial number labels for each tile", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("№ 01")).toBeTruthy();
      expect(getByText("№ 06")).toBeTruthy();
    });
  });

  it("loads providers on mount", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(apiClient.api.get).toHaveBeenCalledWith("/search/providers");
    });
  });

  it("navigates to booking flow when Hair tile pressed", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("Hair")).toBeTruthy();
    });

    fireEvent.press(getByText("Hair"));

    expect(mockRouter.push).toHaveBeenCalledWith("/(booking)/service?slug=hair");
  });

  it("navigates to booking flow when Barber tile pressed", async () => {
    (apiClient.api.get as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("Barber")).toBeTruthy();
    });

    fireEvent.press(getByText("Barber"));

    expect(mockRouter.push).toHaveBeenCalledWith("/(booking)/service?slug=barber");
  });

  it("shows error message when provider load fails", async () => {
    (apiClient.api.get as jest.Mock).mockRejectedValueOnce(new Error("Network down"));

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("Network down")).toBeTruthy();
    });
  });

  it("uses generic error message when failure is not an Error instance", async () => {
    (apiClient.api.get as jest.Mock).mockRejectedValueOnce("oops");

    const { getByText } = render(<ClientHomeScreen />);

    await waitFor(() => {
      expect(getByText("Failed to load providers")).toBeTruthy();
    });
  });
});
