"use client";
import { useSocketStore } from "@/stores/SocketStore";
import { useEffect } from "react";
import { useAuth } from "./auth-provider";

export function SocketWrapper({ children }: { children: React.ReactNode }) {
  const setupSocket = useSocketStore((state) => state.setupSocket);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      setupSocket({ userId: user._id });
    }

    return () => {
      disconnectSocket();
    };
  }, [token, user?._id]); // Only depend on token and user ID

  return children;
}

export default SocketWrapper;
