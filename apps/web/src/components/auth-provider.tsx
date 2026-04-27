"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AuthContext,
  AuthUser,
  getStoredTokens,
  storeTokens,
  clearTokens,
} from "@/lib/auth";
import { api } from "@/lib/api-client";

interface AuthResponse {
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredTokens();
    if (stored.accessToken && stored.user) {
      setUser(stored.user);
      setAccessToken(stored.accessToken);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    storeTokens(res.data.accessToken, res.data.refreshToken, res.data.user);
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
  }, []);

  const register = useCallback(async (data: Record<string, string>) => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    storeTokens(res.data.accessToken, res.data.refreshToken, res.data.user);
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setAccessToken(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
