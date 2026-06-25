"use client";
import { useChatStore } from "@/stores/ChatStore";
import ChatCard, { SkeletonChatCard } from "@/components/cards/ChatCard";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
interface SidebarProps {
  selectedChat?: string;
}

export function Sidebar({ selectedChat }: SidebarProps) {
  const { chats, isFetchingChats } = useChatStore();
  const text = useTranslations("chat");
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 124px)",
        height: "calc(100vh - 124px)",
      }}
      className={cn(
        "group relative flex w-full flex-col border-e border-primary/10 bg-clear-ground xl:w-80",
        {
          "max-xl:hidden": selectedChat,
        },
      )}
    >
      <div className="flex h-20 items-center justify-between border-b border-primary/10 px-5">
        <h1 className="flex items-center gap-2 text-base font-black text-text-1">
          <p className="font-medium">{text("chats")}</p>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-bold text-primary">
            {chats.length}
          </span>
        </h1>
      </div>
      <nav className="flex-1 flex-grow gap-1 overflow-auto px-3 py-3">
        {chats.map((chat, index) => (
          <div key={index} className="py-1">
            <ChatCard key={index} chat={chat} selectedChat={selectedChat} />
          </div>
        ))}
        {isFetchingChats &&
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonChatCard key={index} />
          ))}
      </nav>
    </div>
  );
}
