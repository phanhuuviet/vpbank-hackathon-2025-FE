"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./auth-context";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Nếu logout, cleanup socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Chỉ khởi tạo socket nếu chưa có
    if (!socketRef.current) {
      const socket = io("http://localhost:3001", {
        auth: {
          user_id: user.id,
          username: user.username,
        },
      });

      socket.on("connect", () => {
        setIsConnected(true);

        // Gửi sự kiện 'connect_socket' nếu server bạn cần
        socket.emit("connect_socket", {
          user_id: user.id,
        });
      });

      socket.on("disconnect", () => {
        console.log("⚠️ Disconnected from Socket.IO server");
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
        setIsConnected(false);
      });

      socketRef.current = socket;
    }

    // Cleanup khi component unmount hoặc user thay đổi
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
