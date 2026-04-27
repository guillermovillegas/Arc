import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import * as apiClient from "@/lib/api-client";
import * as auth from "@/lib/auth";
import LoginScreen from "@/app/(auth)/login";

jest.mock("@/lib/api-client");
jest.mock("@/lib/auth");

const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
(useRouter as jest.Mock).mockReturnValue(mockRouter);

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

describe("LoginScreen", () => {
  it("renders login form elements", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByText("Arc")).toBeTruthy();
    expect(getByText("Welcome back")).toBeTruthy();
    expect(getByPlaceholderText("you@example.com")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    expect(getByText("Sign In")).toBeTruthy();
  });

  it("updates email and password fields on input", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("you@example.com");
    const passwordInput = getByPlaceholderText("Enter your password");

    fireEvent.changeText(emailInput, "user@test.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(emailInput.props.value).toBe("user@test.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("calls API and stores tokens on successful login", async () => {
    const mockResponse = {
      data: {
        user: { id: "1", email: "user@test.com", firstName: "John", lastName: "Doe", role: "CLIENT" },
        accessToken: "access-123",
        refreshToken: "refresh-456",
      },
    };
    (apiClient.api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (auth.storeTokens as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("you@example.com"), "user@test.com");
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "password123");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(apiClient.api.post).toHaveBeenCalledWith("/auth/login", {
        email: "user@test.com",
        password: "password123",
      });
      expect(auth.storeTokens).toHaveBeenCalledWith(
        "access-123",
        "refresh-456",
        mockResponse.data.user,
      );
    });
  });

  it("navigates to client home for CLIENT role", async () => {
    const mockResponse = {
      data: {
        user: { id: "1", email: "a@b.com", firstName: "A", lastName: "B", role: "CLIENT" },
        accessToken: "a",
        refreshToken: "r",
      },
    };
    (apiClient.api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (auth.storeTokens as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("you@example.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "pass");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/(client)/home");
    });
  });

  it("navigates to provider home for PROVIDER role", async () => {
    const mockResponse = {
      data: {
        user: { id: "1", email: "a@b.com", firstName: "A", lastName: "B", role: "PROVIDER" },
        accessToken: "a",
        refreshToken: "r",
      },
    };
    (apiClient.api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (auth.storeTokens as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("you@example.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "pass");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/(provider)/home");
    });
  });

  it("shows loading state while logging in", async () => {
    let resolvePost: (value: unknown) => void;
    (apiClient.api.post as jest.Mock).mockReturnValueOnce(
      new Promise((r) => { resolvePost = r; }),
    );

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("you@example.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "pass");
    fireEvent.press(getByText("Sign In"));

    expect(getByText("Signing in\u2026")).toBeTruthy();

    resolvePost!({
      data: {
        user: { id: "1", email: "a@b.com", firstName: "A", lastName: "B", role: "CLIENT" },
        accessToken: "a",
        refreshToken: "r",
      },
    });

    await waitFor(() => {
      expect(getByText("Sign In")).toBeTruthy();
    });
  });

  it("shows alert on login error", async () => {
    (apiClient.api.post as jest.Mock).mockRejectedValueOnce(new Error("Invalid credentials"));
    const alertSpy = jest.spyOn(Alert, "alert");

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("you@example.com"), "bad@email.com");
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "wrong");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Invalid credentials");
    });
  });

  it("shows generic error for non-Error throws", async () => {
    (apiClient.api.post as jest.Mock).mockRejectedValueOnce("something weird");
    const alertSpy = jest.spyOn(Alert, "alert");

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("you@example.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "p");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Login failed");
    });
  });
});
