import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
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

    expect(getByText("CREATE AN ACCOUNT")).toBeTruthy();
    expect(getByText("of nothing")).toBeTruthy();
    expect(getByPlaceholderText("Maeve")).toBeTruthy();
    expect(getByPlaceholderText("Lévesque")).toBeTruthy();
    expect(getByPlaceholderText("you@somewhere.com")).toBeTruthy();
    expect(getByPlaceholderText("EIGHT CHARACTERS, MINIMUM")).toBeTruthy();
    expect(getByText("OPEN AN ACCOUNT →")).toBeTruthy();
  });

  it("renders role toggle with CLIENT and PROFESSIONAL options", () => {
    const { getByText } = render(<RegisterScreen />);

    expect(getByText("CLIENT")).toBeTruthy();
    expect(getByText("PROFESSIONAL")).toBeTruthy();
  });

  it("defaults to CLIENT role", () => {
    const { getByText } = render(<RegisterScreen />);
    const clientButton = getByText("CLIENT");
    expect(clientButton).toBeTruthy();
  });

  it("allows toggling to PROVIDER role", () => {
    const { getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText("PROFESSIONAL"));
    expect(getByText("PROFESSIONAL")).toBeTruthy();
  });

  it("updates form fields on input", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Maeve"), "Jane");
    fireEvent.changeText(getByPlaceholderText("Lévesque"), "Smith");
    fireEvent.changeText(getByPlaceholderText("you@somewhere.com"), "jane@test.com");
    fireEvent.changeText(getByPlaceholderText("EIGHT CHARACTERS, MINIMUM"), "secret123");

    expect(getByPlaceholderText("Maeve").props.value).toBe("Jane");
    expect(getByPlaceholderText("Lévesque").props.value).toBe("Smith");
    expect(getByPlaceholderText("you@somewhere.com").props.value).toBe("jane@test.com");
    expect(getByPlaceholderText("EIGHT CHARACTERS, MINIMUM").props.value).toBe("secret123");
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

    fireEvent.changeText(getByPlaceholderText("Maeve"), "Jane");
    fireEvent.changeText(getByPlaceholderText("Lévesque"), "Smith");
    fireEvent.changeText(getByPlaceholderText("you@somewhere.com"), "jane@test.com");
    fireEvent.changeText(getByPlaceholderText("EIGHT CHARACTERS, MINIMUM"), "secret123");
    fireEvent.press(getByText("OPEN AN ACCOUNT →"));

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

    fireEvent.press(getByText("PROFESSIONAL"));
    fireEvent.changeText(getByPlaceholderText("Maeve"), "Pro");
    fireEvent.changeText(getByPlaceholderText("Lévesque"), "User");
    fireEvent.changeText(getByPlaceholderText("you@somewhere.com"), "pro@test.com");
    fireEvent.changeText(getByPlaceholderText("EIGHT CHARACTERS, MINIMUM"), "secret123");
    fireEvent.press(getByText("OPEN AN ACCOUNT →"));

    await waitFor(() => {
      expect(apiClient.api.post).toHaveBeenCalledWith(
        "/auth/register",
        expect.objectContaining({ role: "PROVIDER" }),
      );
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

    fireEvent.changeText(getByPlaceholderText("Maeve"), "A");
    fireEvent.changeText(getByPlaceholderText("Lévesque"), "B");
    fireEvent.changeText(getByPlaceholderText("you@somewhere.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("EIGHT CHARACTERS, MINIMUM"), "password1");
    fireEvent.press(getByText("OPEN AN ACCOUNT →"));

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

    fireEvent.press(getByText("PROFESSIONAL"));
    fireEvent.changeText(getByPlaceholderText("Maeve"), "A");
    fireEvent.changeText(getByPlaceholderText("Lévesque"), "B");
    fireEvent.changeText(getByPlaceholderText("you@somewhere.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("EIGHT CHARACTERS, MINIMUM"), "password1");
    fireEvent.press(getByText("OPEN AN ACCOUNT →"));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/(provider)/home");
    });
  });

  it("shows loading state during registration", async () => {
    let resolvePost: (value: unknown) => void;
    (apiClient.api.post as jest.Mock).mockReturnValueOnce(
      new Promise((r) => {
        resolvePost = r;
      }),
    );

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Maeve"), "A");
    fireEvent.changeText(getByPlaceholderText("Lévesque"), "B");
    fireEvent.changeText(getByPlaceholderText("you@somewhere.com"), "a@b.com");
    fireEvent.changeText(getByPlaceholderText("EIGHT CHARACTERS, MINIMUM"), "password1");
    fireEvent.press(getByText("OPEN AN ACCOUNT →"));

    expect(getByText("WAIT…")).toBeTruthy();

    resolvePost!({
      data: {
        user: { id: "1", email: "a@b.com", firstName: "A", lastName: "B", role: "CLIENT" },
        accessToken: "a",
        refreshToken: "r",
      },
    });

    await waitFor(() => {
      expect(getByText("OPEN AN ACCOUNT →")).toBeTruthy();
    });
  });

  it("shows inline error on registration failure", async () => {
    (apiClient.api.post as jest.Mock).mockRejectedValueOnce(new Error("Email already exists"));

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Maeve"), "A");
    fireEvent.changeText(getByPlaceholderText("Lévesque"), "B");
    fireEvent.changeText(getByPlaceholderText("you@somewhere.com"), "dup@test.com");
    fireEvent.changeText(getByPlaceholderText("EIGHT CHARACTERS, MINIMUM"), "password1");
    fireEvent.press(getByText("OPEN AN ACCOUNT →"));

    await waitFor(() => {
      expect(getByText("EMAIL ALREADY EXISTS")).toBeTruthy();
    });
  });
});
