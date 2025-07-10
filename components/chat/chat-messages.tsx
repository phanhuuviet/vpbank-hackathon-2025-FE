"use client"

import type { Message, Note, User } from "@/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, UserIcon, StickyNote } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useRef } from "react"

interface ChatMessagesProps {
  messages: Message[]
  notes: Note[]
  currentUser: User | null
}

export function ChatMessages({ messages, notes, currentUser }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, notes])

  // Combine messages and notes and sort by timestamp
  const allItems = [
    ...messages.map((msg) => ({ ...msg, type: "message" as const })),
    ...notes.map((note) => ({ ...note, type: "note" as const })),
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {allItems.map((item) => {
        if (item.type === "message") {
          const message = item as Message
          const isBot = message.sender === "bot"
          const isReviewer = message.sender === "reviewer"
          const isCurrentUser = message.reviewerId === currentUser?.id

          return (
            <div key={message.id} className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
              <div
                className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isBot ? "" : "flex-row-reverse space-x-reverse"}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {isBot ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isBot
                      ? "bg-gray-100 text-gray-900"
                      : isReviewer
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs ${isBot ? "text-gray-500" : "text-white/70"}`}>
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </p>
                    {isReviewer && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        {isCurrentUser ? "You" : "Reviewer"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        } else {
          const note = item as Note
          const isCurrentUser = note.reviewerId === currentUser?.id

          return (
            <Card key={note.id} className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <StickyNote className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Internal Note
                      </Badge>
                      <span className="text-xs text-gray-500">{isCurrentUser ? "You" : note.reviewerName}</span>
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        }
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}
