"use client"

import type { Question } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, MoreVertical, User, Settings, CheckCircle, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChatHeaderProps {
  question: Question
  onToggleSidebar: () => void
  onStatusUpdate: (status: "NEW" | "REVIEWED" | "NOTED") => void
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

export function ChatHeader({ question, onToggleSidebar, onStatusUpdate }: ChatHeaderProps) {
  const router = useRouter()

  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-gray-900">{question.customerName}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={customerTypeColors[question.customerType]}>
                  {question.customerType}
                </Badge>
                <Badge variant="secondary" className={statusColors[question.status]}>
                  {question.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onToggleSidebar}>
            <Settings className="h-4 w-4 mr-2" />
            Details
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusUpdate("REVIEWED")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Reviewed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusUpdate("NOTED")}>
                <FileText className="mr-2 h-4 w-4" />
                Mark as Noted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusUpdate("NEW")}>
                <User className="mr-2 h-4 w-4" />
                Mark as New
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
