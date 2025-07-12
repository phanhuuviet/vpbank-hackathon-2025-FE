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
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Simulate token validation and user data retrieval
      const mockUser: User = {
        id: "1",
        username: "admin",
        fullName: "Administrator",
        avt: "",
        permissions: ["chat", "kd", "permission", "customer_type"],
        customer_types: ["cn", "dn", "hkd", "dt"],
        dob: "1990-01-01",
        gender: "male",
        address: "Ho Chi Minh City, Vietnam",
        settings: {},
      };
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);

      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("refresh_token", response.data.refreshToken);

      // Fetch user data based on the response
      const userData = await authApi.getUserData(response.data.id);
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

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = await authApi.updateProfile(user.id, updates);
      setUser(updatedUser);
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfile, loading }}
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
