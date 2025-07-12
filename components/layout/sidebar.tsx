"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MessageSquare,
  Users,
  Shield,
  Database,
  Settings,
  Home,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    permission: null, // Always visible
  },
  {
    name: "Chat System",
    href: "/chat",
    icon: MessageSquare,
    permission: "chat",
  },
  {
    name: "User Management",
    href: "/users",
    icon: Users,
    permission: "permission",
  },
  {
    name: "Permissions",
    href: "/permissions",
    icon: Shield,
    permission: "permission",
  },
  {
    name: "Customer Types",
    href: "/customer-types",
    icon: Settings,
    permission: "customer_type",
  },
  {
    name: "Knowledge Base",
    href: "/knowledge-base",
    icon: Database,
    permission: "kd",
  },
];

const settingsItems = [
  {
    name: "Preferences",
    href: "/settings/preferences",
    icon: Settings,
  },
  {
    name: "Quick Replies",
    href: "/settings/quick-replies",
    icon: Zap,
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const visibleItems = navigationItems.filter(
    (item) => !item.permission || user?.permissions?.includes(item.permission)
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">VPBank</h1>
            <p className="text-xs text-gray-500">Reviewer Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-blue-600 text-white hover:bg-blue-700"
              )}
              onClick={() => router.push(item.href)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.name}
            </Button>
          );
        })}

        {/* Settings Section */}
        <div className="pt-4">
          <p className="text-xs font-medium text-gray-500 mb-2 px-2">
            Settings
          </p>
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-blue-600 text-white hover:bg-blue-700"
                )}
                onClick={() => router.push(item.href)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.name}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Permissions */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-2">
          Your Permissions
        </p>
        <div className="flex flex-wrap gap-1">
          {user?.permissions?.map((permission) => (
            <Badge key={permission} variant="secondary" className="text-xs">
              {permission}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
