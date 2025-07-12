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
import { Users, Save } from "lucide-react";

const CUSTOMER_TYPES = [
  { key: "cn", label: "CN", description: "Cá nhân (Individual)" },
  { key: "dn", label: "DN", description: "Doanh nghiệp (Enterprise)" },
  {
    key: "hkd",
    label: "HKD",
    description: "Hộ kinh doanh (Business Household)",
  },
  { key: "dt", label: "DT", description: "Đối tác (Partner)" },
];

export default function CustomerTypesPage() {
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

  const handleCustomerTypeChange = (
    userId: string,
    customerType: string,
    checked: boolean
  ) => {
    const currentTypes =
      changes[userId] ||
      users.find((u) => u.id === userId)?.customer_types ||
      [];

    let newTypes: string[];
    if (checked) {
      newTypes = [
        ...currentTypes.filter((t) => t !== customerType),
        customerType,
      ];
    } else {
      newTypes = currentTypes.filter((t) => t !== customerType);
    }

    setChanges((prev) => ({
      ...prev,
      [userId]: newTypes,
    }));
  };

  const handleSaveCustomerTypes = async (userId: string) => {
    const newCustomerTypes = changes[userId];
    if (!newCustomerTypes) return;

    try {
      setSaving(userId);
      await userApi.setCustomerTypes(userId, newCustomerTypes);

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, customer_types: newCustomerTypes }
            : user
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
        description: "Customer types updated successfully",
      });
    } catch (error) {
      console.error("Failed to update customer types:", error);
      toast({
        title: "Error",
        description: "Failed to update customer types",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const getUserCustomerTypes = (userId: string) => {
    return (
      changes[userId] ||
      users.find((u) => u.id === userId)?.customer_types ||
      []
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
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Customer Segment Assignment
          </h1>
          <p className="text-gray-600 mt-2">
            Manage user assignments to customer segments
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Type Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      User
                    </th>
                    {CUSTOMER_TYPES.map((type) => (
                      <th
                        key={type.key}
                        className="text-center py-3 px-4 font-medium text-gray-900"
                      >
                        <div className="flex flex-col items-center">
                          <span>{type.label}</span>
                          <span className="text-xs text-gray-500 font-normal">
                            {type.description}
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
                    const userCustomerTypes = getUserCustomerTypes(user.id);
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
                        {CUSTOMER_TYPES.map((type) => (
                          <td key={type.key} className="py-4 px-4 text-center">
                            <Checkbox
                              checked={userCustomerTypes.includes(type.key)}
                              onCheckedChange={(checked) =>
                                handleCustomerTypeChange(
                                  user.id,
                                  type.key,
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
                              onClick={() => handleSaveCustomerTypes(user.id)}
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
