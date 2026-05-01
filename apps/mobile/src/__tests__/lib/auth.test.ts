import * as SecureStore from "expo-secure-store";
import { getStoredTokens, storeTokens, clearTokens } from "@/lib/auth";

const mockStore = SecureStore as jest.Mocked<typeof SecureStore> & {
  __store: Record<string, string>;
  __clear: () => void;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockStore.__clear();
});

describe("auth token storage", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "CLIENT",
  };

  describe("storeTokens", () => {
    it("stores access token, refresh token, and user in SecureStore", async () => {
      await storeTokens("access-123", "refresh-456", mockUser);

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("arc_access_token", "access-123");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("arc_refresh_token", "refresh-456");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "arc_user",
        JSON.stringify(mockUser),
      );
    });

    it("stores all values in parallel", async () => {
      await storeTokens("a", "b", mockUser);
      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(3);
    });
  });

  describe("getStoredTokens", () => {
    it("returns stored tokens and parsed user", async () => {
      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce("access-token")
        .mockResolvedValueOnce("refresh-token")
        .mockResolvedValueOnce(JSON.stringify(mockUser));

      const result = await getStoredTokens();

      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toBe("refresh-token");
      expect(result.user).toEqual(mockUser);
    });

    it("returns null user when no user stored", async () => {
      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const result = await getStoredTokens();

      expect(result.accessToken).toBeNull();
      expect(result.refreshToken).toBeNull();
      expect(result.user).toBeNull();
    });

    it("reads from correct keys", async () => {
      await getStoredTokens();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("arc_access_token");
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("arc_refresh_token");
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("arc_user");
    });
  });

  describe("clearTokens", () => {
    it("deletes all stored keys", async () => {
      await clearTokens();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("arc_access_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("arc_refresh_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("arc_user");
    });

    it("deletes all in parallel", async () => {
      await clearTokens();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(3);
    });
  });
});
