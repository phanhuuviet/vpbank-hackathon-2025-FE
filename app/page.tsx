"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MessageSquare, Users, Shield, Database } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VPBank</h1>
                <p className="text-sm text-gray-500">Chatbot Reviewer Platform</p>
              </div>
            </div>
            <Button onClick={() => router.push("/login")} size="lg">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Streamline Customer
            <span className="text-blue-600"> Conversations</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Manage Facebook chatbot interactions with real-time messaging, role-based permissions, and comprehensive
            customer insights.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button onClick={() => router.push("/login")} size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto" />
              <CardTitle className="text-lg">Real-time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage customer conversations with instant messaging and live updates</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mx-auto" />
              <CardTitle className="text-lg">Role-based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Granular permission control for different user roles and responsibilities
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto" />
              <CardTitle className="text-lg">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Comprehensive user and customer segment management tools</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Database className="h-12 w-12 text-orange-600 mx-auto" />
              <CardTitle className="text-lg">Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Centralized knowledge management for consistent customer support</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
