import React, { useCallback, useEffect } from "react";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
} from "react-icons/hi2";

import { useChatStore, isCurrentChatRequest } from "@/stores/ChatStore";
import { ChatList } from "./ChatList";
import { axiosInstance } from "@/app/lib/utils";
import ChatTopbar from "./ChatTopbar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { safetyCopy } from "@/lib/safety-contract";
import { useLocale, useTranslations } from "next-intl";
import { IMessage } from "@/types";

interface ChatProps {
  selectedChat?: string;
}

type SocketMessageEvent = {
  senderId?: string;
  action: "sendMessage" | "editMessage" | "deleteMessage";
  payload: IMessage | string;
};

export function Chat({ selectedChat }: ChatProps) {
  const {
    isFetchingThisChat,
    thisChat,
    safetyEpoch,
    setMessages,
    setIsFetchingMessages,
    setThisChat,
    setIsFetchingThisChat,
    setMessagesPagination,
    setMessageCurrentPage,
    socket,
    selectedChatId,
    setSelectedChatId,
    addMessage,
    updateMessage,
    deleteMessage,
  } = useChatStore();
  const { token, user } = useAuth();

  const getThisChat = useCallback(async () => {
    if (!selectedChatId || !token) {
      setThisChat(null);
      setIsFetchingThisChat(false);
      return;
    }

    const epoch = useChatStore.getState().safetyEpoch;
    setIsFetchingThisChat(true);

    try {
      const res = await axiosInstance(`/chats/${selectedChatId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (isCurrentChatRequest(epoch, selectedChatId)) setThisChat(res.data.data);
    } catch {
      if (isCurrentChatRequest(epoch, selectedChatId)) setThisChat(null);
    } finally {
      if (isCurrentChatRequest(epoch, selectedChatId)) setIsFetchingThisChat(false);
    }
  }, [selectedChatId, token, setIsFetchingThisChat, setThisChat]);

  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      setThisChat(null);
      setMessagesPagination(null);
      setMessageCurrentPage(1);
      setIsFetchingMessages(false);
      return;
    }

    setMessages([]);
    setMessagesPagination(null);
    setMessageCurrentPage(1);
    getThisChat();

    return () => {
      setMessages([]);
      setThisChat(null);
      setMessagesPagination(null);
      setMessageCurrentPage(1);
    };
  }, [
    selectedChatId,
    getThisChat,
    setIsFetchingMessages,
    setMessageCurrentPage,
    setMessages,
    setMessagesPagination,
    setThisChat,
  ]);

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
  }, [socket, selectedChatId, user?._id]);

  useEffect(() => {
    if (!socket) return;

    const epoch = safetyEpoch;
    const handleReceiveMessage = (data: SocketMessageEvent) => {
      if (useChatStore.getState().safetyEpoch !== epoch || !useChatStore.getState().thisChat) return;
      if (typeof data.payload !== "string" && data.payload.chat !== useChatStore.getState().selectedChatId) return;
      if (data.action === "sendMessage" && typeof data.payload !== "string") {
        addMessage(data.payload);
        return;
      }

      if (data.action === "editMessage" && typeof data.payload !== "string") {
        updateMessage(data.payload);
        return;
      }

      if (data.action === "deleteMessage" && typeof data.payload === "string") {
        deleteMessage(data.payload);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, addMessage, updateMessage, deleteMessage, safetyEpoch]);

  useEffect(() => {
    if (selectedChat) {
      setSelectedChatId(selectedChat);
    } else {
      setSelectedChatId("");
    }
  }, [selectedChat, setSelectedChatId]);

  const text = useTranslations("chat");
  const locale = useLocale();
  const common = safetyCopy[locale === "ar" ? "ar" : "en"];
  return (
    <div
      className={cn(
        "relative z-10 flex h-full min-h-0 w-full flex-1 flex-col justify-between overflow-hidden bg-background/60",
        {
          "max-xl:hidden": !selectedChat,
        },
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 end-0 size-72 translate-x-1/3 rounded-full bg-secondary/15 opacity-70 blur-[110px] rtl:-translate-x-1/3"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 start-1/4 size-56 rounded-full bg-primary/10 blur-[95px]"
      />
      {selectedChat && thisChat ? (
        <>
          <ChatTopbar />
          <ChatList />
        </>
      ) : (
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="relative mb-5 inline-flex size-20 items-center justify-center rounded-3xl border border-primary/15 bg-clear-ground text-primary cardShadowSm">
            <div
              aria-hidden
              className="pointer-events-none absolute -end-6 -top-6 size-16 rounded-full bg-secondary/20 blur-2xl"
            />
            <HiOutlineChatBubbleLeftRight className="relative z-10 size-9" />
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <HiOutlineSparkles className="size-3.5" />
            {text("chats")}
          </div>
          <h1 className="text-2xl font-black text-text-1">
            {selectedChat ? isFetchingThisChat ? common.loading : common.unavailable : text("selectChat")}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-text-3">
            {!selectedChat ? text("selectChatDescription") : null}
          </p>
          {selectedChat && !isFetchingThisChat ? <Button variant="outline" onClick={() => void getThisChat()}>{common.retry}</Button> : null}
        </div>
      )}
    </div>
  );
}
