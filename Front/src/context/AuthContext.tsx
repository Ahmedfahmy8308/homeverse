// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LoginDto, RegisterDto } from "@/lib/types/auth.types";
import type { User } from "@/lib/types/users.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginDto) => {
    setLoading(true);
    try {
      // TODO: Implement actual login API call
      console.log("Login attempt:", credentials);
      // For now, just simulate success
      setUser({ id: 1, email: credentials.email, role: "user" } as User);
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
      // TODO: Implement actual register API call
      console.log("Register attempt:", data);
      // For now, just simulate success
      setUser({ id: 1, email: data.email, role: "user" } as User);
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    // TODO: Clear localStorage, etc.
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
