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
      className={cn("relative w-full flex flex-col xl:w-80 border-e group", {
        "max-xl:hidden": selectedChat,
      })}
    >
      <div className="flex items-center justify-between h-20 px-6 border-b">
        <h1 className="flex items-center gap-2 h2">
          <p className="font-medium">{text("chats")}</p>
          <span className="bg-primary-faded text-xs h-6 min-w-6 rounded-full flex items-center justify-center">
            {chats.length}
          </span>
        </h1>
      </div>
      <nav className="flex-1 flex-grow gap-1 px-4 py-6 overflow-auto">
        {chats.map((chat, index) => (
          <ChatCard key={index} chat={chat} selectedChat={selectedChat} />
        ))}
        {isFetchingChats &&
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonChatCard key={index} />
          ))}
      </nav>
    </div>
  );
}
