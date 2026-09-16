"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Sidebar } from "./ChatSidebar";
import { Chat } from "./Chat";
import { useChatStore } from "@/stores/ChatStore";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@/constants";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { IChat } from "@/types";

interface ChatLayoutProps {
  selectedChat?: string;
}

const CHAT_PAGE_SIZE = 20;

export function ChatLayout({ selectedChat }: ChatLayoutProps) {
  const {
    safetyEpoch,
    setChats,
    setIsFetchingChats,
    setSocket,
    socket,
    chatsPagination,
    chatCurrentPage,
    setChatsPagination,
    setChatCurrentPage,
  } = useChatStore();
  const { user, token } = useAuth();
  const isFetchingChatsRef = useRef(false);

  const currentToken = useRef(token);
  currentToken.current = token;
  const getChats = useCallback(
    async (page = 1) => {
      if (!token) {
        setIsFetchingChats(false);
        return;
      }

      if (isFetchingChatsRef.current) return;

      const epoch = useChatStore.getState().safetyEpoch;
      isFetchingChatsRef.current = true;
      setIsFetchingChats(true);

      try {
        const res = await axiosInstance(
          `/chats/myChats?limit=${CHAT_PAGE_SIZE}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (useChatStore.getState().safetyEpoch !== epoch || currentToken.current !== token) return;
        const nextChats = (res.data.data ?? []) as IChat[];

        if (page === 1) {
          setChats(nextChats);
        } else {
          const currentChats = useChatStore.getState().chats;
          const currentChatIds = new Set(currentChats.map((chat) => chat._id));
          setChats([
            ...currentChats,
            ...nextChats.filter((chat) => !currentChatIds.has(chat._id)),
          ]);
        }

        setChatsPagination(res.data.paginationResult ?? null);
        setChatCurrentPage(page);
      } catch {
        // Leave cleared data empty when the request is unavailable.
      } finally {
        isFetchingChatsRef.current = false;
        setIsFetchingChats(false);
      }
    },
    [
      token,
      setChats,
      setChatCurrentPage,
      setChatsPagination,
      setIsFetchingChats,
    ],
  );

  useEffect(() => {
    isFetchingChatsRef.current = false;
    void getChats(1);
  }, [getChats, safetyEpoch]);

  useEffect(() => {
    if (!token) return;

    const data = io(SOCKET_URL, { auth: { token } });
    setSocket(data);
    data.on("chat:safety-changed", () => useChatStore.getState().resetSafety());
    data.on("connect", () => useChatStore.getState().resetSafety());
    data.on("chat:changed", () => { void getChats(1); });

    return () => {
      data.disconnect();
      useChatStore.getState().resetSafety();
    };
  }, [token, setSocket, getChats]);

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("addUser", { userId: user._id });
    }
  }, [socket, user?._id]);

  const hasMoreChats =
    !!chatsPagination && chatCurrentPage < chatsPagination.numberOfPages;

  const loadMoreChats = useCallback(() => {
    if (hasMoreChats) {
      getChats(chatCurrentPage + 1);
    }
  }, [chatCurrentPage, getChats, hasMoreChats]);

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full flex-grow overflow-hidden rounded-[1.75rem] border border-primary/15 bg-clear-ground/90 shadow-sm backdrop-blur-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 start-1/3 size-64 rounded-full bg-primary/10 blur-[100px]"
      />

      <Sidebar
        selectedChat={selectedChat}
        hasMoreChats={hasMoreChats}
        onLoadMoreChats={loadMoreChats}
      />
      <Chat key={String(user?._id) + ":" + safetyEpoch} selectedChat={selectedChat} />
    </div>
  );
}
