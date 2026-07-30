"use client";

import type { UIEvent } from "react";
import { MessageSquareText } from "lucide-react";
import { useTranslations } from "next-intl";

import { useChatStore } from "@/stores/ChatStore";
import ChatCard, { SkeletonChatCard } from "@/components/cards/ChatCard";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedChat?: string;
  hasMoreChats?: boolean;
  onLoadMoreChats?: () => void;
}

export function Sidebar({
  selectedChat,
  hasMoreChats = false,
  onLoadMoreChats,
}: SidebarProps) {
  const { chats, isFetchingChats } = useChatStore();
  const text = useTranslations("chat");

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const distanceFromBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight;

    if (distanceFromBottom <= 96 && hasMoreChats && !isFetchingChats) {
      onLoadMoreChats?.();
    }
  };

  return (
    <div
      className={cn(
        "group relative z-10 flex h-full min-h-0 w-full flex-col border-e border-primary/10 bg-clear-ground/80 xl:w-[22rem]",
        {
          "max-xl:hidden": selectedChat,
        },
      )}
    >
      <div className="flex h-22 items-center justify-between border-b border-primary/10 px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary">
            <MessageSquareText className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black text-text-1">
              {text("chats")}
            </h1>
          </div>
        </div>
        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-primary/20 bg-clear-ground px-3 text-sm font-black text-primary cardShadowSm">
          {chats.length}
        </span>
      </div>
      <nav
        className="min-h-0 flex-1 overflow-auto p-3 sm:p-4"
        onScroll={handleScroll}
      >
        <div className="space-y-2">
          {chats.map((chat) => (
            <ChatCard key={chat._id} chat={chat} selectedChat={selectedChat} />
          ))}
          {isFetchingChats &&
            Array.from({ length: chats.length ? 2 : 5 }).map((_, index) => (
              <SkeletonChatCard key={index} />
            ))}
        </div>
      </nav>
    </div>
  );
}
