"use client";
import { useSyncExternalStore } from "react";
import UserDropDownMenu from "../UserDropDownMenu";
import NotificationDropDownMenu from "../NotificationDropDownMenu";
import { ChatPopover } from "./ChatPopover";

const UserHeader = () => {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isMounted) return null;

  return (
    <div className="flex items-center gap-1.5">
      <ChatPopover />
      <NotificationDropDownMenu />
      <UserDropDownMenu />
    </div>
  );
};

export default UserHeader;
