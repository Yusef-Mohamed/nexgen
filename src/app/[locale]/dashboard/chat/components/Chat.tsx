import React, { useEffect } from "react";
import { useChatStore } from "@/stores/ChatStore";
import { ChatList } from "./ChatList";
import { IMessage } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import ChatTopbar from "./ChatTopbar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useTranslations } from "next-intl";

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
        },
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
        },
      );
    }
    return () => {
      if (socket) {
        socket.off("receiveMessage");
      }
    };
  }, [socket, messages]);
  const text = useTranslations("chat");
  return (
    <div
      className={cn(
        "flex flex-col relative justify-between flex-1 w-full h-full",
        {
          "max-xl:hidden": !selectedChat,
        },
      )}
    >
      <div className="pointer-events-none absolute end-0 top-0 h-full w-auto aspect-square -translate-y-1/3 translate-x-1/3 rounded-full bg-secondary/15 opacity-40 blur-3xl" />
      {selectedChat ? (
        <>
          <ChatTopbar />
          <ChatList />
        </>
      ) : (
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary">
            <span className="text-2xl">#</span>
          </div>
          <h1 className="text-xl font-black text-text-1">
            {text("selectChat")}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-text-3">
            {text("selectChatDescription")}
          </p>
        </div>
      )}
    </div>
  );
}
