import React, { useEffect } from "react";
import { useChatStore } from "@/stores/ChatStore";
import { getCookie } from "cookies-next";
import { ChatList } from "./ChatList";
import { IMessage } from "@/types";
import { createClientAxiosInstance } from "@/app/lib/utils";
import ChatTopbar from "./ChatTopbar";
import { cn } from "@/lib/utils";

interface ChatProps {
  selectedChat?: string;
}

export function Chat({ selectedChat }: ChatProps) {
  const {
    setMessages,
    setIsFetchingMessages,
    setThisChat,
    setIsFetchingThisChat,
    socket,
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
    setMessagesPagination,
    setMessageCurrentPage,
    chats,
    selectedChatId,
    setSelectedChatId,
  } = useChatStore();
  const myAccount = JSON.parse(getCookie("user") || "{}");
  const token = getCookie("token");
  const getMessages = async () => {
    setIsFetchingMessages(true);
    try {
      const axiosInstance = await createClientAxiosInstance();
      const res = await axiosInstance(
        `/messages/${selectedChatId}?limit=10&sort=-createdAt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessagesPagination(res.data.paginationResult);
      setMessageCurrentPage(1);
      const sortedMessages = res.data.data.reverse();
      setMessages(sortedMessages);
    } catch (e) {
      console.log(e);
    }
    setIsFetchingMessages(false);
  };
  const getThisChat = async () => {
    setIsFetchingThisChat(true);
    const axiosInstance = await createClientAxiosInstance();
    const res = await axiosInstance(`/chats/${selectedChatId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setThisChat(res.data.data);
    setIsFetchingThisChat(false);
  };
  useEffect(() => {
    if (selectedChatId) {
      getMessages();
      getThisChat();
    }
    return () => {
      setMessages([]);
      setThisChat(null);
    };
  }, [selectedChatId]);
  useEffect(() => {
    if (socket && selectedChatId) {
      socket.emit("joinRoom", {
        userId: myAccount._id,
        roomId: selectedChatId,
      });
    }
    return () => {
      if (socket && selectedChatId) {
        socket.emit("leaveRoom", {
          userId: myAccount._id,
          roomId: selectedChatId,
        });
      }
    };
  }, [socket, selectedChatId]);
  useEffect(() => {
    setSelectedChatId(selectedChat ?? chats[0]?._id);
  }, [selectedChat, chats, setSelectedChatId]);
  useEffect(() => {
    if (socket) {
      socket.on(
        "receiveMessage",
        (data: {
          senderId: "sendMessage" | "editMessage";
          action: string;
          payload: IMessage | string;
        }) => {
          if (
            data.action === "sendMessage" &&
            typeof data.payload !== "string"
          ) {
            addMessage(data.payload);
          } else if (
            data.action === "editMessage" &&
            typeof data.payload !== "string"
          ) {
            updateMessage(data.payload);
          } else if (
            data.action === "deleteMessage" &&
            typeof data.payload === "string"
          ) {
            deleteMessage(data.payload);
          }
        }
      );
    }
    return () => {
      if (socket) {
        socket.off("receiveMessage");
      }
    };
  }, [socket, messages]);
  return (
    <div
      className={cn("flex flex-col justify-between flex-1 w-full h-full", {
        "max-lg:hidden": !selectedChat,
      })}
    >
      <ChatTopbar />

      <ChatList />
    </div>
  );
}
