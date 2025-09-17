import React, { useEffect } from "react";
import { useChatStore } from "@/stores/ChatStore";
import { ChatList } from "./ChatList";
import { IMessage } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import ChatTopbar from "./ChatTopbar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useLocale } from "next-intl";

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
    selectedChatId,
    setSelectedChatId,
  } = useChatStore();
  const { token, user } = useAuth();
  const getMessages = async () => {
    setIsFetchingMessages(true);
    try {
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
        userId: user?._id,
        roomId: selectedChatId,
      });
    }
    return () => {
      if (socket && selectedChatId) {
        socket.emit("leaveRoom", {
          userId: user?._id,
          roomId: selectedChatId,
        });
      }
    };
  }, [socket, selectedChatId]);
  useEffect(() => {
    if (selectedChat) setSelectedChatId(selectedChat);
  }, [selectedChat, setSelectedChatId]);
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
  const locale = useLocale();
  return (
    <div
      className={cn("flex flex-col justify-between flex-1 w-full h-full", {
        "max-xl:hidden": !selectedChat,
      })}
    >
      {selectedChat ? (
        <>
          <ChatTopbar />
          <ChatList />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-xl font-bold">
            {locale === "ar"
              ? "اختر المحادثة التي تريدها"
              : "Select the chat you want"}
          </h1>
        </div>
      )}
    </div>
  );
}
