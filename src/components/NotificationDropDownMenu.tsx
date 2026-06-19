"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import NotificationCard, {
  SkeletonNotificationCard,
} from "./cards/NotificationCard";
import { useEffect, useRef, useState } from "react";
import { useNotificationStore } from "@/stores/NotificationStore";
import { useAuth } from "./auth-provider";
import { useRouter } from "@/i18n/navigation";
import { Button } from "./ui/button";
import { NotificationIcon } from "./icons";
const NotificationDropDownMenu = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const { token, user } = useAuth();
  const router = useRouter();
  const {
    notifications,
    unReadCount,
    isLoading,
    fetchNotifications,
    setupSocket,
    readNotification,
    getUnReadCount,
    clearAllUnread,
    disconnectSocket,
  } = useNotificationStore();
  useEffect(() => {
    if (token) {
      getUnReadCount();
      setupSocket({
        userId: user?._id as string,
      });
    }
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket, getUnReadCount, setupSocket, user?._id, token]);
  useEffect(() => {
    const observerElement = observerRef.current;
    if (!observerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNotifications();
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(observerElement);
    return () => {
      observer.disconnect();
    };
  }, [fetchNotifications]);

  useEffect(() => {
    if (isOpened && unReadCount > 0) {
      clearAllUnread();
    }
    if (isOpened) fetchNotifications(true);
  }, [fetchNotifications, isOpened, unReadCount, clearAllUnread]);
  return (
    <DropdownMenu onOpenChange={setIsOpened}>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative size-10 rounded-xl border-primary/10 bg-clear-ground text-text-3 shadow-none transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          size="icon"
          variant="outline"
        >
          <NotificationIcon className="size-4" /> {/* {unReadCount > 0 && ( */}
          {unReadCount ? (
            <>
              <div className="absolute end-1.5 top-1.5 z-10 size-2.5 rounded-full border border-clear-ground bg-primary" />
              <div className="absolute end-1.5 top-1.5 size-2.5 animate-ping rounded-full bg-primary" />
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[60vh] w-full max-w-[90vw] overflow-auto rounded-2xl border-primary/10 shadow-xl shadow-text-1/10 sm:w-[450px]">
        {notifications.map((n) => (
          <NotificationCard
            key={n._id}
            notification={n}
            readNotification={async () => {
              if (!n.read)
                await readNotification({
                  id: n._id as string,
                });
              if (n.type === "chat" && n.chat)
                router.push(`/dashboard/chat?selectedChat=${n.chat._id}`);
              else if (n.type === "follow" && n.followedUser)
                router.push(
                  `/dashboard/community/profile/${n.followedUser._id}`,
                );
              else if (n.type === "post" && n.post)
                router.push(`/dashboard?focusedPost=${n.post._id}`);
              else if (n.type === "certificate" && n.course)
                router.push(`/dashboard/analytics?selectedCourse=${n.course}`);
              else if (n.type === "certificate" && n.file)
                window.location.href = n.file;
              else if (n.type === "order" && n.file)
                window.location.href = n.file;
            }}
          />
        ))}

        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonNotificationCard key={i} />
          ))}
        <DropdownMenuItem ref={observerRef}></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropDownMenu;
