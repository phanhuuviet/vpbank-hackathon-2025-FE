"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/socket-context";

interface OnlineReviewer {
  id: string;
  username: string;
  fullName: string;
  status: "online" | "busy" | "away";
  activeQuestions: number;
}

export function OnlineReviewers() {
  const { socket } = useSocket();
  const [reviewers, setReviewers] = useState<OnlineReviewer[]>([
    {
      id: "1",
      username: "reviewer1",
      fullName: "John Doe",
      status: "online",
      activeQuestions: 3,
    },
    {
      id: "2",
      username: "reviewer2",
      fullName: "Jane Smith",
      status: "busy",
      activeQuestions: 5,
    },
    {
      id: "3",
      username: "reviewer3",
      fullName: "Mike Johnson",
      status: "online",
      activeQuestions: 2,
    },
  ]);

  useEffect(() => {
    if (socket) {
      socket.on("reviewer_status_update", (data) => {
        setReviewers((prev) =>
          prev.map((reviewer) =>
            reviewer.id === data.reviewerId
              ? {
                  ...reviewer,
                  status: data.status,
                  activeQuestions: data.activeQuestions,
                }
              : reviewer
          )
        );
      });

      return () => {
        socket.off("reviewer_status_update");
      };
    }
  }, [socket]);

  const statusColors = {
    online: "text-green-500",
    busy: "text-red-500",
    away: "text-yellow-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          <Users className="h-4 w-4 mr-2" />
          Team Status ({
            reviewers.filter((r) => r.status === "online").length
          }{" "}
          online)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reviewers.map((reviewer) => (
          <div key={reviewer.id} className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {reviewer.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Circle
                className={`absolute -bottom-1 -right-1 h-3 w-3 fill-current ${
                  statusColors[reviewer.status]
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {reviewer.fullName}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {reviewer.activeQuestions} active
                </Badge>
                <span
                  className={`text-xs capitalize ${
                    statusColors[reviewer.status]
                  }`}
                >
                  {reviewer.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
