"use client";
import { useSocketStore } from "@/stores/SocketStore";
import { IUser } from "@/types";
import { getCookie } from "cookies-next";
import { useEffect, useMemo } from "react";

export function SocketWrapper({ children }: { children: React.ReactNode }) {
  const setupSocket = useSocketStore((state) => state.setupSocket);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);

  const token = getCookie("token");
  const userString = getCookie("user");

  const user = useMemo<null | IUser>(() => {
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }, [userString]);

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
