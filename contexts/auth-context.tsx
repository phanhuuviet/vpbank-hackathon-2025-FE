"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import { authApi } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateProfileById: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      const response = await authApi.getUserData();
      setUser(response);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      getUserData();
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);

      localStorage.setItem("auth_token", response.data.data.accessToken);
      localStorage.setItem("refresh_token", response.data.data.refreshToken);

      const userData = await authApi.getUserData();
      setUser(userData);
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const updateProfileById = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = await authApi.updateProfileById(user.id, updates);
      setUser(updatedUser);
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      await authApi.updateProfile(updates);
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfile, updateProfileById, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
