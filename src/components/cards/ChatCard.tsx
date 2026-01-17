import { IChat } from "@/types";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
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
    "flex items-center p-3 rounded-md relative gap-2 my-0.5 cardShadowSm overflow-hidden hover:!shadow-none relative group/card",
    { "!shadow-none": selectedChat === chat._id }
  );

  if (onClick) {
    return (
      <div onClick={onClick} className={cn(className, "cursor-pointer")}>
        <div
          className={cn(
            "w-full bg-secondary/10 top-1/2 -translate-y-1/2 -translate-x-1/3 right-0 aspect-square absolute rounded-full blur-2xl  group-hover/card:block shape",
            {
              hidden: selectedChat !== chat._id,
            }
          )}
        ></div>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/chat?selectedChat=${chat._id}`}
      className={className}
    >
      <div
        className={cn(
          "w-full bg-secondary/10 top-1/2 -translate-y-1/2 -translate-x-1/3 right-0 aspect-square absolute rounded-full blur-2xl  group-hover/card:block shape",
          {
            hidden: selectedChat !== chat._id,
          }
        )}
      ></div>{" "}
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
