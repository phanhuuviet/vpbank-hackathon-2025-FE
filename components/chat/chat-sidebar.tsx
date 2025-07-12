"use client";

import type { Question, Note } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, User, MessageSquare, StickyNote, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface ChatSidebarProps {
  question: Question;
  notes: Note[];
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (content: string) => void;
}

const customerTypeColors = {
  Individual: "bg-purple-100 text-purple-800",
  SME: "bg-orange-100 text-orange-800",
  Corporate: "bg-blue-100 text-blue-800",
  "Business Household": "bg-green-100 text-green-800",
  Partner: "bg-red-100 text-red-800",
};

export function ChatSidebar({
  question,
  notes,
  isOpen,
  onClose,
  onAddNote,
}: ChatSidebarProps) {
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    onAddNote(newNote.trim());
    setNewNote("");
    setIsAddingNote(false);
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-50 border-l flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Question Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Customer Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <User className="h-4 w-4 mr-2" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{question.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <Badge
                variant="secondary"
                className={customerTypeColors[question.customerType]}
              >
                {question.customerType}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Customer ID</p>
              <p className="text-sm text-gray-900 font-mono">
                {question.customerId}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Question Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Question Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Messages</span>
              <span className="text-sm font-medium">
                {question.messageCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Created</span>
              <span className="text-sm font-medium">
                {formatDistanceToNow(new Date(question.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Last Update</span>
              <span className="text-sm font-medium">
                {formatDistanceToNow(new Date(question.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center">
                <StickyNote className="h-4 w-4 mr-2" />
                Internal Notes ({notes.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingNote(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isAddingNote && (
              <div className="space-y-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add an internal note..."
                  className="min-h-[80px]"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleAddNote}>
                    Add Note
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {notes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No notes yet. Add one to keep track of important information.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                  >
                    <p className="text-sm text-gray-700 mb-2">{note.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{note.reviewerName}</span>
                      <span>
                        {formatDistanceToNow(new Date(note.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
