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

    expect(getByText("ARC")).toBeTruthy();
    expect(getByText("Create your account")).toBeTruthy();
    expect(getByPlaceholderText("First Name")).toBeTruthy();
    expect(getByPlaceholderText("Last Name")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password (8+ characters)")).toBeTruthy();
    expect(getByText("Create Account")).toBeTruthy();
  });

  it("renders role toggle with CLIENT and PROVIDER options", () => {
    const { getByText } = render(<RegisterScreen />);

    expect(getByText("I need services")).toBeTruthy();
    expect(getByText("I offer services")).toBeTruthy();
  });

  it("defaults to CLIENT role", () => {
    const { getByText } = render(<RegisterScreen />);
    // CLIENT button should be active (has active styles)
    const clientButton = getByText("I need services");
    expect(clientButton).toBeTruthy();
  });

  it("allows toggling to PROVIDER role", () => {
    const { getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText("I offer services"));
    // No crash means toggle works
    expect(getByText("I offer services")).toBeTruthy();
  });

  it("updates form fields on input", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("First Name"), "Jane");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Smith");
    fireEvent.changeText(getByPlaceholderText("Email"), "jane@test.com");
    fireEvent.changeText(getByPlaceholderText("Password (8+ characters)"), "secret123");

    expect(getByPlaceholderText("First Name").props.value).toBe("Jane");
    expect(getByPlaceholderText("Last Name").props.value).toBe("Smith");
    expect(getByPlaceholderText("Email").props.value).toBe("jane@test.com");
    expect(getByPlaceholderText("Password (8+ characters)").props.value).toBe("secret123");
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

    fireEvent.changeText(getByPlaceholderText("First Name"), "Jane");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Smith");
    fireEvent.changeText(getByPlaceholderText("Email"), "jane@test.com");
    fireEvent.changeText(getByPlaceholderText("Password (8+ characters)"), "secret123");
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

    fireEvent.press(getByText("I offer services"));
    fireEvent.changeText(getByPlaceholderText("First Name"), "Pro");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "User");
    fireEvent.changeText(getByPlaceholderText("Email"), "pro@test.com");
    fireEvent.changeText(getByPlaceholderText("Password (8+ characters)"), "secret123");
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

    fireEvent.changeText(getByPlaceholderText("First Name"), "A");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "B");
    fireEvent.changeText(getByPlaceholderText("Email"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("Password (8+ characters)"), "password1");
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

    fireEvent.press(getByText("I offer services"));
    fireEvent.changeText(getByPlaceholderText("First Name"), "A");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "B");
    fireEvent.changeText(getByPlaceholderText("Email"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("Password (8+ characters)"), "password1");
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

    fireEvent.changeText(getByPlaceholderText("First Name"), "A");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "B");
    fireEvent.changeText(getByPlaceholderText("Email"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("Password (8+ characters)"), "password1");
    fireEvent.press(getByText("Create Account"));

    expect(getByText("Creating...")).toBeTruthy();

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

    fireEvent.changeText(getByPlaceholderText("First Name"), "A");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "B");
    fireEvent.changeText(getByPlaceholderText("Email"), "dup@test.com");
    fireEvent.changeText(getByPlaceholderText("Password (8+ characters)"), "password1");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Email already exists");
    });
  });
});
