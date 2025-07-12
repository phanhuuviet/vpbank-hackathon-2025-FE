"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useSocket } from "@/contexts/socket-context"
import { useQuestion } from "@/hooks/use-question"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { useEffect, useState } from "react"
import type { Message } from "@/types"
import { toast } from "@/hooks/use-toast"

// Component này không còn được sử dụng nữa :)))
export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { socket } = useSocket()
  const questionId = params.id as string
  const { question, messages, notes, loading, sendMessage, addNote, updateStatus } = useQuestion(questionId)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (socket && questionId) {
      socket.emit("join_question", questionId)

      socket.on("new_message", (message: Message) => {
        // Message will be handled by the useQuestion hook
      })

      socket.on("question_reassigned", () => {
        toast({
          title: "Question Reassigned",
          description: "This question has been reassigned to another reviewer.",
          variant: "destructive",
        })
        router.push("/dashboard")
      })

      return () => {
        socket.emit("leave_question", questionId)
        socket.off("new_message")
        socket.off("question_reassigned")
      }
    }
  }, [socket, questionId, router])

  const handleSendMessage = async (content: string) => {
    if (!question || !user) return

    try {
      await sendMessage(content)
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddNote = async (content: string) => {
    if (!question || !user) return

    try {
      await addNote(content)
      toast({
        title: "Note added",
        description: "Internal note has been saved.",
      })
    } catch (error) {
      toast({
        title: "Failed to add note",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusUpdate = async (status: "NEW" | "REVIEWED" | "NOTED") => {
    if (!question) return

    try {
      await updateStatus(status)
      toast({
        title: "Status updated",
        description: `Question marked as ${status.toLowerCase()}.`,
      })
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Question not found</h2>
          <p className="text-gray-600 mt-2">The question you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader
          question={question}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onStatusUpdate={handleStatusUpdate}
        />

        <div className="flex-1 overflow-hidden">
          <ChatMessages messages={messages} notes={notes} currentUser={user} />
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          onAddNote={handleAddNote}
          disabled={question.assignedTo !== user?.id}
        />
      </div>

      {/* Sidebar */}
      <ChatSidebar
        question={question}
        notes={notes}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAddNote={handleAddNote}
      />
    </div>
  )
}
