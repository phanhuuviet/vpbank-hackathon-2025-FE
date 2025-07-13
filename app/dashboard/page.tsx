"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Facebook,
  MessageSquare,
  Users,
  Settings,
  Database,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import { useFacebookSDK } from "@/hooks/use-facebook-sdk";

export default function DashboardPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const [facebookPages, setFacebookPages] = useState([]);
  const { user } = useAuth();
  const router = useRouter();
  useFacebookSDK(process.env.NEXT_PUBLIC_APP_FB_ID);

  const mockFacebookPages = [
    {
      id: "page1",
      name: "VPBank Official",
      followers: "1.2M",
      category: "Bank",
    },
    {
      id: "page2",
      name: "VPBank Support",
      followers: "850K",
      category: "Customer Service",
    },
    {
      id: "page3",
      name: "VPBank Business",
      followers: "450K",
      category: "Business Banking",
    },
  ];

  // const handleConnect = () => {
  //   setIsConnecting(true)
  //   // Simulate Facebook SDK initialization
  //   setTimeout(() => {
  //     setIsConnecting(false)
  //     setShowModal(true)
  //   }, 1500)
  // }
  const handleConnect = () => {
    setIsConnecting(true);

    // Ensure FB SDK has loaded
    if (typeof FB === "undefined") {
      toast({ title: "Facebook SDK not loaded", variant: "destructive" });
      setIsConnecting(false);
      return;
    }

    FB.login(
      (response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          // Call Graph API to get list of pages
          FB.api(
            "/me/accounts",
            "GET",
            { access_token: accessToken },
            (res: any) => {
              if (res && !res.error) {
                setFacebookPages(res.data); // cập nhật state để hiển thị trong modal
                setShowModal(true);
              } else {
                toast({
                  title: "Error fetching fanpages",
                  description: res.error.message,
                  variant: "destructive",
                });
              }
              setIsConnecting(false);
            }
          );
        } else {
          toast({ title: "Login cancelled", variant: "destructive" });
          setIsConnecting(false);
        }
      },
      { scope: "pages_show_list,pages_messaging" }
    );
  };

  // const handlePageSelect = (pageId: string) => {
  //   setSelectedPage(pageId);
  //   setShowModal(false);
  //   toast({
  //     title: "Facebook Page Connected",
  //     description:
  //       "Successfully connected to Facebook page. Redirecting to chat...",
  //   });
  //   setTimeout(() => {
  //     router.push("/chat");
  //   }, 1000);
  // };
  const handlePageSelect = (pageId: string) => {
    const selected = facebookPages.find((page) => page.id === pageId);

    if (!selected) {
      toast({ title: "Page not found", variant: "destructive" });
      return;
    }

    // Optional: Save selected page info to context/localStorage
    localStorage.setItem("fb_page_id", selected?.id);
    localStorage.setItem("fb_page_name", selected.name);
    localStorage.setItem("fb_page_token", selected.access_token);

    setSelectedPage(pageId);
    setShowModal(false);

    toast({
      title: "Facebook Page Connected",
      description: `Connected to: ${selected.name}. Redirecting to chat...`,
    });

    setTimeout(() => {
      router.push("/chat");
    }, 1000);
  };

  const quickActions = [
    {
      title: "Chat System",
      description: "Manage customer conversations",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      permission: "chat",
      path: "/chat",
    },
    {
      title: "User Management",
      description: "Manage system users",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      permission: "permission",
      path: "/users",
    },
    {
      title: "Permissions",
      description: "Configure user permissions",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      permission: "permission",
      path: "/permissions",
    },
    {
      title: "Customer Types",
      description: "Manage customer segments",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      permission: "customer_type",
      path: "/customer-types",
    },
    {
      title: "Knowledge Base",
      description: "Manage knowledge articles",
      icon: Database,
      color: "text-red-600",
      bgColor: "bg-red-100",
      permission: "kd",
      path: "/knowledge-base",
    },
  ];

  const availableActions = quickActions.filter((action) =>
    user?.permissions.includes(action.permission)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your Facebook chatbot conversations and customer interactions
          </p>
        </div>

        {/* Facebook Connection Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Facebook className="h-6 w-6 text-blue-600 mr-2" />
              Facebook Integration
            </CardTitle>
            <CardDescription>
              Connect to your Facebook page to start managing conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Connect your Facebook page to access customer conversations
                  and manage chatbot interactions.
                </p>
                <Badge variant="outline" className="text-xs">
                  Status: Not Connected
                </Badge>
              </div>
              <Button onClick={handleConnect} disabled={isConnecting} size="lg">
                {isConnecting ? "Connecting..." : "Connect to Facebook"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.title}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent
                    className="p-6"
                    onClick={() => router.push(action.path)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${action.bgColor}`}>
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Conversations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Response Time
                  </p>
                  <p className="text-2xl font-bold text-gray-900">2.3m</p>
                </div>
                <Settings className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Facebook Page Selection Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Facebook Page</DialogTitle>
            <DialogDescription>
              Choose the Facebook page you want to connect to the chatbot system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* {mockFacebookPages.map((page) => (
              <Card
                key={page.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handlePageSelect(page.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{page.name}</h3>
                      <p className="text-sm text-gray-600">{page.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{page.followers}</p>
                      <p className="text-xs text-gray-500">followers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))} */}
            {facebookPages.map((page) => (
              <Card
                key={page.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handlePageSelect(page.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{page.name}</h3>
                      <p className="text-sm text-gray-600">{page.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {page.fan_count || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">followers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
