"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { UserPreferences, QuickReply } from "@/types/settings";
import { preferencesApi, quickRepliesApi } from "@/lib/settings-api";
import { useAuth } from "./auth-context";

interface PreferencesContextType {
  preferences: UserPreferences | null;
  quickReplies: QuickReply[];
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  loadQuickReplies: () => Promise<void>;
  createQuickReply: (
    data: Omit<QuickReply, "id" | "createdAt" | "updatedAt">
  ) => Promise<QuickReply>;
  updateQuickReply: (
    id: string,
    data: Partial<QuickReply>
  ) => Promise<QuickReply>;
  deleteQuickReply: (id: string) => Promise<void>;
  getQuickReplyByShortcut: (shortcut: string) => QuickReply | undefined;
  loading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPreferences();
      loadQuickReplies();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const data = await preferencesApi.getUserPreferences(user.id);
      setPreferences(data);
    } catch (error) {
      console.error("Failed to load preferences:", error);
      // Set default preferences
      setPreferences({
        id: "default",
        userId: user.id,
        notifications: {
          browser: true,
          sound: true,
        },
        chat: {
          autoPrioritizeUnread: true,
          skipToNextUnread: false,
          showConversationStatus: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const loadQuickReplies = async () => {
    if (!user) return;

    try {
      const data = await quickRepliesApi.getQuickReplies(user.id);
      setQuickReplies(data);
    } catch (error) {
      console.error("Failed to load quick replies:", error);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;

    try {
      const updatedPreferences = await preferencesApi.updateUserPreferences(
        user.id,
        updates
      );
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error("Failed to update preferences:", error);
      throw error;
    }
  };

  const createQuickReply = async (
    data: Omit<QuickReply, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const newReply = await quickRepliesApi.createQuickReply({
        ...data,
        userId: user.id,
      });
      setQuickReplies((prev) => [...prev, newReply]);
      return newReply;
    } catch (error) {
      console.error("Failed to create quick reply:", error);
      throw error;
    }
  };

  const updateQuickReply = async (id: string, data: Partial<QuickReply>) => {
    try {
      const updatedReply = await quickRepliesApi.updateQuickReply(id, data);
      setQuickReplies((prev) =>
        prev.map((reply) => (reply.id === id ? updatedReply : reply))
      );
      return updatedReply;
    } catch (error) {
      console.error("Failed to update quick reply:", error);
      throw error;
    }
  };

  const deleteQuickReply = async (id: string) => {
    try {
      await quickRepliesApi.deleteQuickReply(id);
      setQuickReplies((prev) => prev.filter((reply) => reply.id !== id));
    } catch (error) {
      console.error("Failed to delete quick reply:", error);
      throw error;
    }
  };

  const getQuickReplyByShortcut = (shortcut: string) => {
    return quickReplies.find((reply) => reply.shortcut === shortcut);
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        quickReplies,
        updatePreferences,
        loadQuickReplies,
        createQuickReply,
        updateQuickReply,
        deleteQuickReply,
        getQuickReplyByShortcut,
        loading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
