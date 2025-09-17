"use client";

import React, { useEffect } from "react";
import { Sidebar } from "./ChatSidebar";
import { Chat } from "./Chat";
import { useChatStore } from "@/stores/ChatStore";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@/constants";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";

interface ChatLayoutProps {
  selectedChat?: string;
}

export function ChatLayout({ selectedChat }: ChatLayoutProps) {
  const { setChats, setIsFetchingChats, setSocket, socket } = useChatStore();
  const { user, token } = useAuth();
  const getChats = async () => {
    setIsFetchingChats(true);

    const res = await axiosInstance("/chats/myChats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setChats(res.data.data);
    setIsFetchingChats(false);
  };
  useEffect(() => {
    getChats();
  }, []);
  useEffect(() => {
    if (token) {
      const data = io(SOCKET_URL);
      setSocket(data);
      return () => {
        data.disconnect();
      };
    }
  }, [token]);
  useEffect(() => {
    if (socket) {
      socket.emit("addUser", { userId: user?._id });
    }
  }, [socket]);
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 124px)",
        height: "calc(100vh - 124px)",
      }}
      className="flex flex-grow overflow-hidden border rounded-md bg-clear-ground"
    >
      <Sidebar selectedChat={selectedChat} />
      <Chat selectedChat={selectedChat} />
    </div>
  );
}
