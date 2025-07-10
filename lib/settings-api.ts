import type { QuickReply, UserPreferences } from "@/types/settings"

// Mock data for development
const mockQuickReplies: QuickReply[] = [
  {
    id: "1",
    shortcut: "/hello",
    message: "Hi #FIRST_NAME, welcome to #PAGE_NAME! How can I help you today?",
    userId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    shortcut: "/thanks",
    message: "Thank you for contacting #PAGE_NAME, #FIRST_NAME. Is there anything else I can help you with?",
    userId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    shortcut: "/hours",
    message: "Our business hours are Monday to Friday, 9 AM to 6 PM. We'll get back to you during these hours.",
    userId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let mockPreferences: UserPreferences = {
  id: "1",
  userId: "1",
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
}

// Quick Replies API
export const quickRepliesApi = {
  getQuickReplies: async (userId: string): Promise<QuickReply[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockQuickReplies.filter((reply) => reply.userId === userId)
  },

  createQuickReply: async (data: Omit<QuickReply, "id" | "createdAt" | "updatedAt">): Promise<QuickReply> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newReply: QuickReply = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockQuickReplies.push(newReply)
    return newReply
  },

  updateQuickReply: async (id: string, data: Partial<QuickReply>): Promise<QuickReply> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockQuickReplies.findIndex((reply) => reply.id === id)
    if (index === -1) throw new Error("Quick reply not found")

    mockQuickReplies[index] = {
      ...mockQuickReplies[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockQuickReplies[index]
  },

  deleteQuickReply: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockQuickReplies.findIndex((reply) => reply.id === id)
    if (index === -1) throw new Error("Quick reply not found")
    mockQuickReplies.splice(index, 1)
  },
}

// User Preferences API
export const preferencesApi = {
  getUserPreferences: async (userId: string): Promise<UserPreferences> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockPreferences
  },

  updateUserPreferences: async (userId: string, data: Partial<UserPreferences>): Promise<UserPreferences> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    mockPreferences = {
      ...mockPreferences,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockPreferences
  },
}
