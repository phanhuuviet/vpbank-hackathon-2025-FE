"use client";

import type { Customer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, User, Calendar, Link, Database } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CustomerProfileProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerProfile({
  customer,
  isOpen,
  onClose,
}: CustomerProfileProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Customer Profile</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <User className="h-4 w-4 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-16 w-16 mb-3">
                <AvatarImage src={customer.fb_avt || "/placeholder.svg"} />
                <AvatarFallback>
                  {customer.fb_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-center">{customer.fb_name}</h3>
              <Badge variant="outline" className="mt-1">
                {customer.customer_type || "Unknown"}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Facebook ID</p>
                <p className="text-sm text-gray-900 font-mono">
                  {customer.fb_id}
                </p>
              </div>

              {customer.fb_dob && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </p>
                  <p className="text-sm text-gray-900">{customer.fb_dob}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Database Link */}
        {customer.db_link && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Database Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  Database Link
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                >
                  <Link className="h-4 w-4 mr-2" />
                  View in Database
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Message</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(), { addSuffix: true })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Messages</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">First Contact</span>
                <span className="font-medium">
                  {formatDistanceToNow(
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    { addSuffix: true }
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Customer Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              No notes available for this customer. Add notes to keep track of
              important information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
