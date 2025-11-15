import { IChat } from "@/types";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useAuth } from "../auth-provider";
interface ChatCardProps {
  chat: IChat;
  selectedChat?: string;
  onClick?: () => void;
}
const ChatCard: React.FC<ChatCardProps> = ({ chat, selectedChat, onClick }) => {
  const { user: myAccount } = useAuth();
  const anotherUser = chat?.participants.find(
    (user) => user.user !== myAccount?._id
  );

  const content = (
    <>
      {chat?.isGroupChat ? (
        <>
          <UserAvatar
            user={{
              name: chat.groupName,
              profileImg: chat.image,
            }}
            className="w-12 h-12 rounded-md"
            innerClassName="!rounded-md"
          />
        </>
      ) : (
        <>
          <UserAvatar
            user={anotherUser?.userDetails}
            className="w-12 h-12 rounded-md"
            innerClassName="!rounded-md"
          />
        </>
      )}{" "}
      <div className="flex flex-col">
        <span className="text-sm line-clamp-2 text-text-1">
          {chat.isGroupChat ? chat.groupName : anotherUser?.userDetails?.name}
        </span>
        <span className="text-xs line-clamp-1 text-text-3">
          {chat.lastMessage ? chat.lastMessage[0]?.text : "---"}
        </span>
      </div>
    </>
  );

  const className = cn(
    "hover:bg-primary-faded flex items-center p-3 rounded-md gap-2 my-0.5",
    { "bg-primary-faded": selectedChat === chat._id }
  );

  if (onClick) {
    return (
      <div onClick={onClick} className={cn(className, "cursor-pointer")}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/chat?selectedChat=${chat._id}`}
      className={className}
    >
      {content}
    </Link>
  );
};
export default ChatCard;

export const SkeletonChatCard = () => {
  return (
    <div
      className={cn(
        "flex items-center px-2 py-2 rounded-md gap-2 my-0.5 bg-muted animate-pulse"
      )}
    >
      <div className="w-12 h-12 rounded-full bg-muted-foreground animate-pulse"></div>
      <div className="flex flex-col flex-1 w-full">
        <div className="w-2/4 h-3 mb-2 rounded-lg animate-pulse bg-muted-foreground" />
        <div className="w-3/4 h-2 rounded-lg animate-pulse bg-muted-foreground" />
      </div>
    </div>
  );
};
