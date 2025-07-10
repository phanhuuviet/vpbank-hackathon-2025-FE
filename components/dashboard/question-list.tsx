"use client"

import type { Question } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Clock, User, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface QuestionListProps {
  questions: Question[]
  loading: boolean
  isConnected: boolean
}

const statusColors = {
  NEW: "bg-blue-100 text-blue-800",
  REVIEWED: "bg-green-100 text-green-800",
  NOTED: "bg-yellow-100 text-yellow-800",
}

const customerTypeColors = {
  Individual: "bg-purple-100 text-purple-800",
  SME: "bg-orange-100 text-orange-800",
  Corporate: "bg-blue-100 text-blue-800",
  "Business Household": "bg-green-100 text-green-800",
  Partner: "bg-red-100 text-red-800",
}

export function QuestionList({ questions, loading, isConnected }: QuestionListProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-500">
            {isConnected
              ? "You're all caught up! New questions will appear here automatically."
              : "Check your connection to receive new questions."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Questions ({questions.length})</h2>
        <Badge variant="outline" className="text-xs">
          {isConnected ? "Live Updates" : "Offline"}
        </Badge>
      </div>

      {questions.map((question) => (
        <Card key={question.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">{question.customerName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className={customerTypeColors[question.customerType]}>
                        {question.customerType}
                      </Badge>
                      <Badge variant="secondary" className={statusColors[question.status]}>
                        {question.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{question.lastMessage}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(question.updatedAt), { addSuffix: true })}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {question.messageCount} messages
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/chat/${question.id}`)}
                    className="flex items-center"
                  >
                    Open Chat
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
