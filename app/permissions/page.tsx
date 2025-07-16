"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { userApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { User } from "@/types";
import { Shield, Save } from "lucide-react";
import { PERMISSIONS_ENUM } from "@/constants";

const PERMISSIONS = [
  {
    key: PERMISSIONS_ENUM.CHAT,
    label: "Chat System",
    description: "Access to chat and messaging features",
  },
  {
    key: PERMISSIONS_ENUM.KNOWLEDGE_BASE,
    label: "Knowledge Base",
    description: "Manage knowledge base content",
  },
  {
    key: PERMISSIONS_ENUM.PERMISSION_MANAGEMENT,
    label: "Permission Management",
    description: "Manage user permissions",
  },
  {
    key: PERMISSIONS_ENUM.CUSTOMER_TYPE,
    label: "Customer Types",
    description: "Manage customer segment assignments",
  },
];

export default function PermissionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [changes, setChanges] = useState<Record<string, string[]>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getListUser();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (
    userId: string,
    permission: string,
    checked: boolean
  ) => {
    const currentPermissions =
      changes[userId] || users.find((u) => u.id === userId)?.permissions || [];

    let newPermissions: string[];
    if (checked) {
      newPermissions = [
        ...currentPermissions.filter((p) => p !== permission),
        permission,
      ];
    } else {
      newPermissions = currentPermissions.filter((p) => p !== permission);
    }

    setChanges((prev) => ({
      ...prev,
      [userId]: newPermissions,
    }));
  };

  const handleSavePermissions = async (userId: string) => {
    const newPermissions = changes[userId];
    if (!newPermissions) return;

    try {
      setSaving(userId);
      await userApi.setPermission(userId, newPermissions);

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, permissions: newPermissions } : user
        )
      );

      // Clear changes for this user
      setChanges((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });

      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
    } catch (error) {
      console.error("Failed to update permissions:", error);
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const getUserPermissions = (userId: string) => {
    return (
      changes[userId] || users.find((u) => u.id === userId)?.permissions || []
    );
  };

  const hasChanges = (userId: string) => {
    return changes[userId] !== undefined;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            Permission Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage user permissions and access control
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      User
                    </th>
                    {PERMISSIONS.map((permission) => (
                      <th
                        key={permission.key}
                        className="text-center py-3 px-4 font-medium text-gray-900"
                      >
                        <div className="flex flex-col items-center">
                          <span>{permission.label}</span>
                          <span className="text-xs text-gray-500 font-normal">
                            {permission.description}
                          </span>
                        </div>
                      </th>
                    ))}
                    <th className="text-center py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const userPermissions = getUserPermissions(user.id);
                    const userHasChanges = hasChanges(user.id);

                    return (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={user.avt || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {user.fullName
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.fullName}
                              </p>
                              <p className="text-sm text-gray-500">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        {PERMISSIONS.map((permission) => (
                          <td
                            key={permission.key}
                            className="py-4 px-4 text-center"
                          >
                            <Checkbox
                              checked={userPermissions.includes(permission.key)}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  user.id,
                                  permission.key,
                                  checked as boolean
                                )
                              }
                            />
                          </td>
                        ))}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {userHasChanges && (
                              <Badge variant="outline" className="text-xs">
                                Modified
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleSavePermissions(user.id)}
                              disabled={!userHasChanges || saving === user.id}
                            >
                              {saving === user.id ? (
                                "Saving..."
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
