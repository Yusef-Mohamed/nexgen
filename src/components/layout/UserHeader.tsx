"use client";
import { useEffect, useState } from "react";
import UserDropDownMenu from "../UserDropDownMenu";
import NotificationDropDownMenu from "../NotificationDropDownMenu";
import { Button } from "../ui/button";
import { ChatIcon } from "../icons";
import { Link } from "@/i18n/routing";

const UserHeader = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Button
        asChild
        className="relative rounded-full"
        size="icon"
        variant="outline"
      >
        <Link href="/dashboard/chat">
          <ChatIcon className="size-4 text-muted-foreground" />{" "}
          <div className="absolute z-10 flex items-center justify-center size-3 text-xs rounded-full -top-1 -end-1 bg-primary border"></div>
          <div className="absolute flex items-center justify-center size-3 text-xs rounded-full animate-ping -top-1 -end-1 bg-primary "></div>
        </Link>
      </Button>
      <NotificationDropDownMenu />
      <UserDropDownMenu />
    </div>
  );
};

export default UserHeader;
