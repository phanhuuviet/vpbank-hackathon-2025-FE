"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/contexts/preferences-context";
import {
  Send,
  ChevronDown,
  MessageSquare,
  StickyNote,
  Zap,
} from "lucide-react";

interface EnhancedChatInputProps {
  onSendMessage: (content: string) => void;
  onAddNote: (content: string) => void;
  disabled?: boolean;
  selectedCustomer;
}

export function EnhancedChatInput({
  onSendMessage,
  onAddNote,
  disabled,
  selectedCustomer,
}: EnhancedChatInputProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"message" | "note">("message");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ shortcut: string; message: string }>
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { quickReplies, getQuickReplyByShortcut } = usePreferences();

  useEffect(() => {
    // Check for quick reply shortcuts
    const words = input.split(" ");
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith("/") && lastWord.length > 1) {
      const matchingReplies = quickReplies.filter((reply) =>
        reply.shortcut.toLowerCase().includes(lastWord.toLowerCase())
      );
      if (matchingReplies.length > 0) {
        setSuggestions(
          matchingReplies.map((reply) => ({
            shortcut: reply.shortcut,
            message: reply.message,
          }))
        );
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [input, quickReplies]);

  const expandQuickReply = (text: string) => {
    const words = text.split(" ");
    const expandedWords = words.map((word) => {
      if (word.startsWith("/")) {
        const quickReply = getQuickReplyByShortcut(word);
        if (quickReply) {
          // Replace variables with mock data
          return quickReply.message
            .replace(
              /#FIRST_NAME/g,
              selectedCustomer?.facebookName || "Customer"
            )
            .replace(/#PAGE_NAME/g, "VPBank Official");
        }
      }
      return word;
    });
    return expandedWords.join(" ");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    const expandedInput = expandQuickReply(input.trim());

    if (mode === "message") {
      onSendMessage(expandedInput);
    } else {
      onAddNote(expandedInput);
    }

    setInput("");
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === " ") {
      // Auto-expand shortcuts on space
      const words = input.split(" ");
      const lastWord = words[words.length - 1];
      if (lastWord.startsWith("/")) {
        const quickReply = getQuickReplyByShortcut(lastWord);
        if (quickReply) {
          const expandedMessage = quickReply.message
            .replace(
              /#FIRST_NAME/g,
              selectedCustomer?.facebookName || "Customer"
            )
            .replace(/#PAGE_NAME/g, "VPBank Official");
          const newInput =
            [...words.slice(0, -1), expandedMessage].join(" ") + " ";
          setInput(newInput);
          setShowSuggestions(false);
          e.preventDefault();
        }
      }
    }
  };

  const handleSuggestionClick = (shortcut: string) => {
    const words = input.split(" ");
    const lastWordIndex = words.length - 1;
    const quickReply = getQuickReplyByShortcut(shortcut);
    if (quickReply) {
      const expandedMessage = quickReply.message
        .replace(/#FIRST_NAME/g, selectedCustomer?.facebookName || "Customer")
        .replace(/#PAGE_NAME/g, "VPBank Official");
      words[lastWordIndex] = expandedMessage;
      setInput(words.join(" ") + " ");
      setShowSuggestions(false);
      textareaRef.current?.focus();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Quick Reply Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="bg-gray-50 border rounded-lg p-2 space-y-1">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-700">
                Quick Replies
              </span>
            </div>
            {suggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion.shortcut}
                type="button"
                onClick={() => handleSuggestionClick(suggestion.shortcut)}
                className="w-full text-left p-2 hover:bg-white rounded border text-sm"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="secondary" className="text-xs font-mono">
                    {suggestion.shortcut}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {suggestion.message}
                </p>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                mode === "message"
                  ? disabled
                    ? "This question is not assigned to you"
                    : "Type your message or use /shortcuts..."
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
        </div>
      </form>
    </div>
  );
}
