"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Send, ChevronDown, MessageSquare, StickyNote } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (content: string) => void
  onAddNote: (content: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, onAddNote, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<"message" | "note">("message")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled) return

    if (mode === "message") {
      onSendMessage(input.trim())
    } else {
      onAddNote(input.trim())
    }

    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              mode === "message"
                ? disabled
                  ? "This question is not assigned to you"
                  : "Type your message to the customer..."
                : "Add an internal note..."
            }
            disabled={disabled}
            className="min-h-[60px] resize-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={disabled}>
                {mode === "message" ? (
                  <MessageSquare className="h-4 w-4 mr-2" />
                ) : (
                  <StickyNote className="h-4 w-4 mr-2" />
                )}
                {mode === "message" ? "Message" : "Note"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setMode("message")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode("note")}>
                <StickyNote className="mr-2 h-4 w-4" />
                Add Note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="submit" disabled={!input.trim() || disabled}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
