import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import * as auth from "@/lib/auth";
import ClientProfileScreen from "@/app/(client)/profile";

jest.mock("@/lib/auth");

const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
(useRouter as jest.Mock).mockReturnValue(mockRouter);

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

describe("ClientProfileScreen", () => {
  it("loads and displays user info", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({
      user: { firstName: "John", lastName: "Doe", email: "john@test.com" },
    });

    const { getByText } = render(<ClientProfileScreen />);

    await waitFor(() => {
      expect(getByText("John Doe")).toBeTruthy();
      expect(getByText("john@test.com")).toBeTruthy();
    });
  });

  it("renders user avatar initials", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({
      user: { firstName: "John", lastName: "Doe", email: "john@test.com" },
    });

    const { getByText } = render(<ClientProfileScreen />);

    await waitFor(() => {
      expect(getByText("JD")).toBeTruthy();
    });
  });

  it("shows sign out button", () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ user: null });

    const { getByText } = render(<ClientProfileScreen />);
    expect(getByText("Sign Out")).toBeTruthy();
  });

  it("clears tokens and navigates to login on sign out", async () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({
      user: { firstName: "John", lastName: "Doe", email: "john@test.com" },
    });
    (auth.clearTokens as jest.Mock).mockResolvedValue(undefined);

    const { getByText } = render(<ClientProfileScreen />);
    fireEvent.press(getByText("Sign Out"));

    await waitFor(() => {
      expect(auth.clearTokens).toHaveBeenCalled();
      expect(mockRouter.replace).toHaveBeenCalledWith("/(auth)/login");
    });
  });

  it("shows placeholder when no user loaded", () => {
    (auth.getStoredTokens as jest.Mock).mockResolvedValue({ user: null });

    const { getByText } = render(<ClientProfileScreen />);
    expect(getByText("?")).toBeTruthy();
  });
});
