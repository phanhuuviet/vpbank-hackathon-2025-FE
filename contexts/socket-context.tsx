"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "./auth-context"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Connect to Socket.IO server with user_id
      const newSocket = io("ws://localhost:3001", {
        auth: {
          user_id: user.id,
          username: user.username,
        },
      })

      newSocket.on("connect", () => {
        setIsConnected(true)
        console.log("Connected to Socket.IO server")
      })

      newSocket.on("disconnect", () => {
        setIsConnected(false)
        console.log("Disconnected from Socket.IO server")
      })

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error)
        setIsConnected(false)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [user])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}
