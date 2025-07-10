export interface QuickReply {
  id: string
  shortcut: string
  message: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  id: string
  userId: string
  notifications: {
    browser: boolean
    sound: boolean
  }
  chat: {
    autoPrioritizeUnread: boolean
    skipToNextUnread: boolean
    showConversationStatus: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface NotificationSettings {
  browser: boolean
  sound: boolean
}

export interface ChatSettings {
  autoPrioritizeUnread: boolean
  skipToNextUnread: boolean
  showConversationStatus: boolean
}
