// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { LoginDto, RegisterDto } from "@/lib/types/auth.types";
import { authApi } from "@/lib/api";
import type { User } from "@/lib/types/users.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<User>;
  register: (data: RegisterDto) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored) as {
            token?: string;
            user?: User;
          };
          if (parsed.user && parsed.token) {
            if (!cancelled) {
              setUser(parsed.user);
            }
          } else {
            localStorage.removeItem("userData");
          }
        }
      } catch (error) {
        console.warn("Failed to restore auth state", error);
        localStorage.removeItem("userData");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (credentials: LoginDto) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      const payload = response.data;
      setUser(payload.user);

      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(payload));
      }

      return payload.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    setLoading(true);
    try {
      const response = await authApi.register(data);
      const payload = response.data;
      setUser(payload.user);

      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(payload));
      }

      return payload.user;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== "undefined") {
      try {
        await authApi.logout();
      } catch (error) {
        console.warn("Logout request failed", error);
      }
      localStorage.removeItem("userData");
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
