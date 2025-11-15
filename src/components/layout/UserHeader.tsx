"use client";
import { useEffect, useState } from "react";
import UserDropDownMenu from "../UserDropDownMenu";
import NotificationDropDownMenu from "../NotificationDropDownMenu";
import { ChatPopover } from "./ChatPopover";

const UserHeader = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <ChatPopover />
      <NotificationDropDownMenu />
      <UserDropDownMenu />
    </div>
  );
};

export default UserHeader;
