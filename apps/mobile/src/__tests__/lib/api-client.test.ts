import { api } from "@/lib/api-client";

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

function mockResponse(data: unknown, ok = true, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

describe("api-client", () => {
  const BASE_URL = "http://localhost:3001/api/v1";

  describe("GET requests", () => {
    it("makes a GET request to the correct URL", async () => {
      mockResponse({ data: [] });

      await api.get("/search/providers");

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/search/providers`,
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("includes authorization header when token provided", async () => {
      mockResponse({ data: [] });

      await api.get("/bookings/client", { token: "my-token" });

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/bookings/client`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer my-token",
          }),
        }),
      );
    });

    it("omits authorization header when no token", async () => {
      mockResponse({ data: [] });

      await api.get("/posts");

      const callHeaders = mockFetch.mock.calls[0][1].headers;
      expect(callHeaders.Authorization).toBeUndefined();
    });

    it("returns parsed JSON response", async () => {
      const responseData = { data: { items: [{ id: "1" }] } };
      mockResponse(responseData);

      const result = await api.get("/search/providers");

      expect(result).toEqual(responseData);
    });
  });

  describe("POST requests", () => {
    it("sends POST with JSON body", async () => {
      mockResponse({ data: { user: { id: "1" } } });

      await api.post("/auth/login", { email: "test@test.com", password: "pass123" });

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/auth/login`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "test@test.com", password: "pass123" }),
        }),
      );
    });

    it("sets Content-Type to application/json", async () => {
      mockResponse({ data: {} });

      await api.post("/auth/register", { email: "a@b.com" });

      const callHeaders = mockFetch.mock.calls[0][1].headers;
      expect(callHeaders["Content-Type"]).toBe("application/json");
    });
  });

  describe("PUT requests", () => {
    it("sends PUT with JSON body", async () => {
      mockResponse({ data: {} });

      await api.put("/profile", { firstName: "Jane" }, { token: "tok" });

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/profile`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ firstName: "Jane" }),
        }),
      );
    });
  });

  describe("PATCH requests", () => {
    it("sends PATCH with JSON body", async () => {
      mockResponse({ data: {} });

      await api.patch("/bookings/123/status", { status: "CONFIRMED" }, { token: "tok" });

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/bookings/123/status`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ status: "CONFIRMED" }),
        }),
      );
    });
  });

  describe("DELETE requests", () => {
    it("sends DELETE request", async () => {
      mockResponse({ data: {} });

      await api.delete("/services/123", { token: "tok" });

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/services/123`,
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  describe("error handling", () => {
    it("throws an error when response is not ok", async () => {
      mockResponse({ error: { message: "Invalid credentials" } }, false, 401);

      await expect(api.post("/auth/login", {})).rejects.toThrow("Invalid credentials");
    });

    it("throws generic error when no error message in response", async () => {
      mockResponse({}, false, 500);

      await expect(api.get("/fail")).rejects.toThrow("Request failed");
    });
  });
});
