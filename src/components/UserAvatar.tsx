import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: {
    name: string;
    profileImg?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}
const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  className,
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
        className="object-cover"
      />
      <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
