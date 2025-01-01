"use client";
import { IoIosNotifications } from "react-icons/io";
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
import { useRouter } from "@/i18n/routing";
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
  } = useNotificationStore();
  useEffect(() => {
    if (token) {
      getUnReadCount();
      setupSocket({
        userId: user?._id as string,
      });
    }
  }, [getUnReadCount, setupSocket, user, token]);
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
    if (isOpened) fetchNotifications(true);
  }, [fetchNotifications, isOpened]);
  console.log(notifications);
  return (
    <DropdownMenu onOpenChange={setIsOpened}>
      <DropdownMenuTrigger className="relative flex items-center justify-center h-[2.5rem] w-[2.5rem] bg-primary-faded border-none text-xl border rounded-full">
        <IoIosNotifications />{" "}
        {unReadCount > 0 && (
          <div className="absolute flex items-center justify-center w-5 h-5 text-xs rounded-full -top-2 -right-2 bg-primary text-clear-ground">
            {unReadCount}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[90vw] sm:w-[450px] w-full max-h-[60vh] overflow-auto">
        {notifications.map((n) => (
          <NotificationCard
            key={n._id}
            notification={n}
            readNotification={async () => {
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
