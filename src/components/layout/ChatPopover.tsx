"use client";

import { useEffect, useState, useCallback } from "react";
import { useChatStore } from "@/stores/ChatStore";
import ChatCard, { SkeletonChatCard } from "@/components/cards/ChatCard";
import { useTranslations, useLocale } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChatIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "@/i18n/navigation";

export function ChatPopover() {
  const {
    chats,
    isFetchingChats,
    setChats,
    setIsFetchingChats,
    setSelectedChatId,
  } = useChatStore();
  const text = useTranslations("chat");
  const locale = useLocale();
  const { token } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const getChats = useCallback(async () => {
    if (!open || !token) return;
    setIsFetchingChats(true);
    try {
      const res = await axiosInstance("/chats/myChats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(res.data.data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsFetchingChats(false);
    }
  }, [open, token, setChats, setIsFetchingChats]);

  useEffect(() => {
    if (open) {
      getChats();
    }
  }, [open, getChats]);

  const handleChatClick = (chatId: string) => {
    setSelectedChatId(chatId);
    setOpen(false);
    router.push(`/dashboard/chat?selectedChat=${chatId}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="relative rounded-full" size="icon" variant="outline">
          <ChatIcon className="size-4 text-muted-foreground" />
          <div className="absolute z-10 flex items-center justify-center size-3 text-xs rounded-full -top-1 -end-1 bg-primary border"></div>
          <div className="absolute flex items-center justify-center size-3 text-xs rounded-full animate-ping -top-1 -end-1 bg-primary "></div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 overflow-hidden"
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col max-h-[calc(100vh-120px)]">
          {/* Header with "View all chats" link */}
          <div className="flex flex-col gap-2 px-4 py-3 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-2 h2">
                <p className="font-medium">{text("chats")}</p>
                <span className="bg-primary-faded text-xs h-6 min-w-6 rounded-full flex items-center justify-center">
                  {chats.length}
                </span>
              </h1>
            </div>
          </div>

          {/* Chats list */}
          <nav className="flex-1 overflow-auto px-2 py-4 min-h-0">
            {isFetchingChats ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonChatCard key={index} />
              ))
            ) : chats.length > 0 ? (
              chats.map((chat) => (
                <ChatCard
                  key={chat._id}
                  chat={chat}
                  onClick={() => handleChatClick(chat._id)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                {locale === "ar" ? "لا توجد محادثات" : "No chats yet"}
              </div>
            )}{" "}
            {chats.length > 0 && (
              <Link
                href="/dashboard/chat"
                onClick={() => setOpen(false)}
                className="text-sm text-primary hover:underline font-medium w-fit px-4"
              >
                {locale === "ar" ? "عرض جميع المحادثات" : "View all chats"}
              </Link>
            )}
          </nav>
        </div>
      </PopoverContent>
    </Popover>
  );
}
