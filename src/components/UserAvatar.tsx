import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: {
    name: string;
    profileImg?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
  innerClassName?: string;
}
const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  className,
  innerClassName,
}) => {
  return (
    <Avatar
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
      <AvatarImage
        src={user?.profileImg ?? "/images/user-placeholder.jpeg"}
        alt={user?.name}
        className={cn("object-cover", innerClassName)}
      />
      <AvatarFallback
        className={cn(innerClassName, {
          "text-[10px]": size === "sm",
          "text-[12px]": size === "md",
          "text-[14px]": size === "lg",
        })}
      >
        {user?.name?.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
