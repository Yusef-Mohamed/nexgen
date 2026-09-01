import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface UserAvatarProps {
  user?: {
    name: string;
    profileImg?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
}
const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  className,
  innerClassName,
  style,
  innerStyle,
}) => {
  const profileImage = user?.profileImg?.trim();
  const initials = user?.name?.trim().slice(0, 2).toUpperCase() || "?";

  return (
    <Avatar
      style={style}
      className={cn(
        "avatar",
        {
          "w-6 h-6": size === "sm",
          "w-10 h-10": size === "md",
          "w-14 h-14": size === "lg",
        },
        className
      )}
    >
      {profileImage ? (
        <AvatarImage
          src={profileImage}
          alt={user?.name || "User"}
          className={cn("object-cover ", innerClassName)}
          style={innerStyle}
        />
      ) : null}
      <AvatarFallback
        className={cn(innerClassName, {
          "text-[10px]": size === "sm",
          "text-[12px]": size === "md",
          "text-[14px]": size === "lg",
        })}
        style={innerStyle}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
