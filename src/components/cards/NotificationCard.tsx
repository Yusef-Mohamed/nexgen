"use client";
import { INotification } from "@/types";
import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { IoMdChatboxes } from "react-icons/io";
import { FaMoneyBillWave, FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
interface NotificationCardProps {
  notification: INotification;
  readNotification: (id: string) => void;
}
const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  readNotification,
}) => {
  return (
    <DropdownMenuItem
      // className={cn("my-1 p-0", {
      //   "bg-accent text-accent-foreground": !notification.read,
      // })}
      className={cn("my-1 p-0")}
      key={notification._id}
    >
      <button
        onClick={() => {
          readNotification(notification._id);
        }}
        className="flex items-center w-full gap-2 px-4 py-3 rounded-md text-start"
      >
        <button className="flex items-center justify-center w-10 h-10 text-xl border rounded-full text-foreground">
          {notification.type === "chat" && <IoMdChatboxes />}
          {notification.type === "system" && <MdAdminPanelSettings />}
          {notification.type === "post" && <FaUsers />}
          {notification.type === "certificate" && <GiGraduateCap />}
          {notification.type === "order" && <FaMoneyBillWave />}
        </button>{" "}
        <div className="flex-1 w-full">
          <p>{notification.message}</p>
          <span className="text-xs">
            {new Date(notification.createdAt).toLocaleDateString()} -{" "}
            {new Date(notification.createdAt).toLocaleTimeString()}
          </span>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-primary"></div>
        )}
      </button>
    </DropdownMenuItem>
  );
};
export const SkeletonNotificationCard = ({ key }: { key: number }) => {
  return (
    <DropdownMenuItem
      key={key}
      className={cn("my-1 h-16 bg-accent animate-pulse")}
    ></DropdownMenuItem>
  );
};

export default NotificationCard;
