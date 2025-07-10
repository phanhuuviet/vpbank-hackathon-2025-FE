"use client"

import type { Conversation } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, Wifi, WifiOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onConversationSelect: (conversation: Conversation) => void
  loading: boolean
  isConnected: boolean
}

export function ConversationList({
  conversations,
  selectedConversation,
  onConversationSelect,
  loading,
  isConnected,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) =>
    conversation.customerObject.fb_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Conversations</h2>
          <div className="flex items-center space-x-1">
            {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? "Live" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery ? "No conversations match your search." : "New conversations will appear here."}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className={cn(
                  "w-full p-3 h-auto justify-start mb-2 text-left",
                  selectedConversation?.id === conversation.id && "bg-blue-50 border-blue-200",
                )}
                onClick={() => onConversationSelect(conversation)}
              >
                <div className="flex items-center space-x-3 w-full min-w-0">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={conversation.customerObject.fb_avt || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {conversation.customerObject.fb_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate text-sm pr-2">
                        {conversation.customerObject.fb_name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-2 pr-2">{conversation.lastMessage}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {conversation.customerObject.customer_type || "Unknown"}
                      </Badge>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
