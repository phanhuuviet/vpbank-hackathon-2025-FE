"use client"

import { useAuth } from "@/contexts/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login"]

  useEffect(() => {
    if (!loading) {
      // If user is not authenticated and trying to access protected route
      if (!user && !publicRoutes.includes(pathname)) {
        router.push("/login")
        return
      }

      // If user is authenticated and trying to access login page
      if (user && pathname === "/login") {
        router.push("/dashboard")
        return
      }

      // Check permission requirements
      if (user && requiredPermission && !user.permissions?.includes(requiredPermission)) {
        router.push("/dashboard")
        return
      }
    }
  }, [user, loading, pathname, router, requiredPermission])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show unauthorized message for permission-protected routes
  if (user && requiredPermission && !user.permissions?.includes(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
