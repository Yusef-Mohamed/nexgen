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
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNotifications();
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
      observer.disconnect();
    };
  }, [fetchNotifications, observerRef.current, observerRef]);

  useEffect(() => {
    if (isOpened && unReadCount > 0) {
      clearAllUnread();
    }
    if (isOpened) fetchNotifications(true);
  }, [fetchNotifications, isOpened, unReadCount, clearAllUnread]);
  return (
    <DropdownMenu onOpenChange={setIsOpened}>
      <DropdownMenuTrigger asChild>
        <Button className="relative rounded-full" size="icon" variant="outline">
          <NotificationIcon className="size-4 text-muted-foreground" />{" "}
          {/* {unReadCount > 0 && ( */}
          {unReadCount ? (
            <>
              <div className="absolute z-10 flex items-center justify-center size-3 text-xs rounded-full -top-1 -end-1 bg-primary border"></div>
              <div className="absolute flex items-center justify-center size-3 text-xs rounded-full animate-ping -top-1 -end-1 bg-primary "></div>
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[90vw] sm:w-[450px] w-full max-h-[60vh] overflow-auto">
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
                  `/dashboard/community/profile/${n.followedUser._id}`
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
