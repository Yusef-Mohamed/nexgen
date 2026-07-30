import { IChat } from "@/types";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useAuth } from "../auth-provider";
import { formatMessageTime } from "@/lib/dateTime";
import { useLocale } from "next-intl";
interface ChatCardProps {
  chat: IChat;
  selectedChat?: string;
  onClick?: () => void;
}
const ChatCard: React.FC<ChatCardProps> = ({ chat, selectedChat, onClick }) => {
  const { user: myAccount } = useAuth();
  const locale = useLocale();
  const anotherUser = chat?.participants.find(
    (user) => user.user !== myAccount?._id,
  );
  const isSelected = selectedChat === chat._id;
  const lastMessage = chat.lastMessage?.[0];
  const chatTitle = chat.isGroupChat
    ? chat.groupName
    : anotherUser?.userDetails?.name;

  const content = (
    <>
      {chat?.isGroupChat ? (
        <>
          <UserAvatar
            user={{
              name: chat.groupName,
              profileImg: chat.image,
            }}
            className="size-12 rounded-2xl border border-primary/10"
            innerClassName="!rounded-2xl"
          />
        </>
      ) : (
        <>
          <UserAvatar
            user={anotherUser?.userDetails}
            className="size-12 rounded-2xl border border-primary/10"
            innerClassName="!rounded-2xl"
          />
        </>
      )}{" "}
      <div className="relative z-10 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="line-clamp-1 text-sm font-bold text-text-1">
            {chatTitle}
          </span>
        </div>
        <div className="mt-1 min-w-0 text-xs text-text-3">
          <span className="line-clamp-1">{lastMessage?.text || "---"}</span>
        </div>
      </div>
      {lastMessage?.createdAt && (
        <time className="relative z-10 ms-auto hidden shrink-0 text-[10px] font-semibold text-text-3 sm:block">
          {formatMessageTime(lastMessage.createdAt, locale)}
        </time>
      )}
    </>
  );

  const className = cn(
    "group/card relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 text-start transition-all duration-300 hover:-translate-y-0.5",
    isSelected
      ? "border-primary/35 bg-primary/10"
      : "border-primary/10 bg-clear-ground hover:border-primary/30 hover:bg-primary/5",
  );

  const activeMarker = (
    <>
      <div
        className={cn(
          "absolute inset-y-3 start-0 w-1 rounded-e-full bg-primary transition-opacity",
          {
            "opacity-100": isSelected,
            "opacity-0 group-hover/card:opacity-70": !isSelected,
          },
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-14 top-1/2 size-28 -translate-y-1/2 rounded-full bg-secondary/10 opacity-0 blur-2xl transition-opacity group-hover/card:opacity-100"
      />
    </>
  );

  if (onClick) {
    return (
      <div onClick={onClick} className={cn(className, "cursor-pointer")}>
        {activeMarker}
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/chat?selectedChat=${chat._id}`}
      className={className}
    >
      {activeMarker}
      {content}
    </Link>
  );
};
export default ChatCard;

export const SkeletonChatCard = () => {
  return (
    <div className="my-1 flex animate-pulse items-center gap-3 overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-3 cardShadowSm">
      <div className="relative size-12 shrink-0 rounded-2xl border border-primary/10 bg-primary/10">
        <div className="absolute inset-3 rounded-xl bg-muted" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 h-3 w-3/5 rounded-full bg-primary/10" />
        <div className="h-2.5 w-4/5 rounded-full bg-muted" />
      </div>
      <div className="hidden h-2.5 w-10 shrink-0 rounded-full bg-muted sm:block" />
    </div>
  );
};
