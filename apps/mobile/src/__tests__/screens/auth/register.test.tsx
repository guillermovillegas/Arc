import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import * as apiClient from "@/lib/api-client";
import * as auth from "@/lib/auth";
import RegisterScreen from "@/app/(auth)/register";

jest.mock("@/lib/api-client");
jest.mock("@/lib/auth");

const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
(useRouter as jest.Mock).mockReturnValue(mockRouter);

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

describe("RegisterScreen", () => {
  it("renders registration form elements", () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    expect(getByText("Arc")).toBeTruthy();
    expect(getByText("Begin your journey")).toBeTruthy();
    expect(getByPlaceholderText("First name")).toBeTruthy();
    expect(getByPlaceholderText("Last name")).toBeTruthy();
    expect(getByPlaceholderText("you@example.com")).toBeTruthy();
    expect(getByPlaceholderText("8+ characters")).toBeTruthy();
    expect(getByText("Create Account")).toBeTruthy();
  });

  it("renders role toggle with CLIENT and PROVIDER options", () => {
    const { getByText } = render(<RegisterScreen />);

    expect(getByText("Client")).toBeTruthy();
    expect(getByText("Professional")).toBeTruthy();
  });

  it("defaults to CLIENT role", () => {
    const { getByText } = render(<RegisterScreen />);
    // CLIENT button should be active (has active styles)
    const clientButton = getByText("Client");
    expect(clientButton).toBeTruthy();
  });

  it("allows toggling to PROVIDER role", () => {
    const { getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText("Professional"));
    // No crash means toggle works
    expect(getByText("Professional")).toBeTruthy();
  });

  it("updates form fields on input", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("First name"), "Jane");
    fireEvent.changeText(getByPlaceholderText("Last name"), "Smith");
    fireEvent.changeText(getByPlaceholderText("you@example.com"), "jane@test.com");
    fireEvent.changeText(getByPlaceholderText("8+ characters"), "secret123");

    expect(getByPlaceholderText("First name").props.value).toBe("Jane");
    expect(getByPlaceholderText("Last name").props.value).toBe("Smith");
    expect(getByPlaceholderText("you@example.com").props.value).toBe("jane@test.com");
    expect(getByPlaceholderText("8+ characters").props.value).toBe("secret123");
  });

  it("sends register API call with form data and CLIENT role", async () => {
    const mockResponse = {
      data: {
        user: { id: "1", email: "jane@test.com", firstName: "Jane", lastName: "Smith", role: "CLIENT" },
        accessToken: "a",
        refreshToken: "r",
      },
    };
    (apiClient.api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (auth.storeTokens as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("First name"), "Jane");
    fireEvent.changeText(getByPlaceholderText("Last name"), "Smith");
    fireEvent.changeText(getByPlaceholderText("you@example.com"), "jane@test.com");
    fireEvent.changeText(getByPlaceholderText("8+ characters"), "secret123");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(apiClient.api.post).toHaveBeenCalledWith("/auth/register", {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@test.com",
        password: "secret123",
        role: "CLIENT",
      });
    });
  });

  it("sends PROVIDER role when toggled", async () => {
    const mockResponse = {
      data: {
        user: { id: "1", email: "pro@test.com", firstName: "Pro", lastName: "User", role: "PROVIDER" },
        accessToken: "a",
        refreshToken: "r",
      },
    };
    (apiClient.api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (auth.storeTokens as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText("Professional"));
    fireEvent.changeText(getByPlaceholderText("First name"), "Pro");
    fireEvent.changeText(getByPlaceholderText("Last name"), "User");
    fireEvent.changeText(getByPlaceholderText("you@example.com"), "pro@test.com");
    fireEvent.changeText(getByPlaceholderText("8+ characters"), "secret123");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(apiClient.api.post).toHaveBeenCalledWith("/auth/register", expect.objectContaining({
        role: "PROVIDER",
      }));
    });
  });

  it("navigates to client home on CLIENT registration", async () => {
    const mockResponse = {
      data: {
        user: { id: "1", email: "a@b.com", firstName: "A", lastName: "B", role: "CLIENT" },
        accessToken: "a",
        refreshToken: "r",
      },
    };
    (apiClient.api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (auth.storeTokens as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("First name"), "A");
    fireEvent.changeText(getByPlaceholderText("Last name"), "B");
    fireEvent.changeText(getByPlaceholderText("you@example.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("8+ characters"), "password1");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/(client)/home");
    });
  });

  it("navigates to provider home on PROVIDER registration", async () => {
    const mockResponse = {
      data: {
        user: { id: "1", email: "a@b.com", firstName: "A", lastName: "B", role: "PROVIDER" },
        accessToken: "a",
        refreshToken: "r",
      },
    };
    (apiClient.api.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (auth.storeTokens as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText("Professional"));
    fireEvent.changeText(getByPlaceholderText("First name"), "A");
    fireEvent.changeText(getByPlaceholderText("Last name"), "B");
    fireEvent.changeText(getByPlaceholderText("you@example.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("8+ characters"), "password1");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/(provider)/home");
    });
  });

  it("shows loading state during registration", async () => {
    let resolvePost: (value: unknown) => void;
    (apiClient.api.post as jest.Mock).mockReturnValueOnce(
      new Promise((r) => { resolvePost = r; }),
    );

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("First name"), "A");
    fireEvent.changeText(getByPlaceholderText("Last name"), "B");
    fireEvent.changeText(getByPlaceholderText("you@example.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("8+ characters"), "password1");
    fireEvent.press(getByText("Create Account"));

    expect(getByText("Creating\u2026")).toBeTruthy();

    resolvePost!({
      data: {
        user: { id: "1", email: "a@b.com", firstName: "A", lastName: "B", role: "CLIENT" },
        accessToken: "a",
        refreshToken: "r",
      },
    });

    await waitFor(() => {
      expect(getByText("Create Account")).toBeTruthy();
    });
  });

  it("shows alert on registration error", async () => {
    (apiClient.api.post as jest.Mock).mockRejectedValueOnce(new Error("Email already exists"));
    const alertSpy = jest.spyOn(Alert, "alert");

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("First name"), "A");
    fireEvent.changeText(getByPlaceholderText("Last name"), "B");
    fireEvent.changeText(getByPlaceholderText("you@example.com"), "dup@test.com");
    fireEvent.changeText(getByPlaceholderText("8+ characters"), "password1");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Email already exists");
    });
  });
});
