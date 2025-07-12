"use client";

import type React from "react";

import type { Conversation, Message } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Info, Bot, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { EnhancedChatInput } from "./enhanced-chat-input";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onShowCustomerProfile: () => void;
}

export function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  onShowCustomerProfile,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={conversation.customerObject.fb_avt || "/placeholder.svg"}
              />
              <AvatarFallback>
                {conversation.customerObject.fb_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {conversation.customerObject.fb_name}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {conversation.customerObject.customer_type || "Unknown"}
                </Badge>
                <span className="text-xs text-gray-500">
                  ID: {conversation.customerObject.fb_id}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onShowCustomerProfile}>
            <Info className="h-4 w-4 mr-2" />
            Info
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isBot = message.sender_type === "bot";
          const isUser =
            message.sender_type === "user" &&
            message.sender_id !== "reviewer_1";

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-2",
                !isUser && !isBot && "justify-end"
              )}
            >
              {(isUser || isBot) && (
                <Avatar className="h-8 w-8">
                  {isBot ? (
                    <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  ) : (
                    <>
                      <AvatarImage
                        src={
                          conversation.customerObject.fb_avt ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              )}

              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                  isBot && "bg-gray-100 text-gray-900",
                  isUser && "bg-blue-100 text-blue-900",
                  !isUser && !isBot && "bg-green-500 text-white"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    isBot && "text-gray-500",
                    isUser && "text-blue-600",
                    !isUser && !isBot && "text-green-100"
                  )}
                >
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {!isUser && !isBot && (
                <Avatar className="h-8 w-8">
                  <div className="h-full w-full bg-green-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <EnhancedChatInput
          onSendMessage={onSendMessage}
          onAddNote={() => {}} // Add note functionality if needed
          disabled={false}
        />
      </div>
    </div>
  );
}
