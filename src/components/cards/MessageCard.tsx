import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { motion } from "framer-motion";
import UserAvatar from "../UserAvatar";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { LuReply } from "react-icons/lu";
import { useChatStore } from "@/stores/ChatStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
import { axiosInstance } from "@/app/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "../auth-provider";
import { ChatAttachment } from "../chat-attachment";
import { CommunitySafetyActions } from "../community-safety";
import { formatMessageTime } from "@/lib/dateTime";
interface MessageCardProps {
  message: IMessage;
  isMine: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  isMine,
  isFirst = false,
  isLast = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const { setActionOnMessage, deleteMessage, socket } = useChatStore();
  const messageDiv = useRef(null);
  const { user: myAccount, token } = useAuth();
  const text = useTranslations("chat");
  const locale = useLocale();
  const sentAt = formatMessageTime(message.createdAt, locale).toLowerCase();

  const deleteMessageAction = async () => {
    try {
      setIsLoading(true);

      await axiosInstance.delete(`/messages/${message._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      deleteMessage(message._id);
      if (socket) {
        socket.emit("sendMessage", {
          senderId: myAccount?._id,
          roomId: message.chat,
          payload: message._id,
          action: "deleteMessage",
        });
      }
    } catch {
      // Keep the confirmation available for retry.
    } finally {
      setIsDeleting(false);
    }
  };

  const renderMessageText = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content?.split(urlRegex);

    return parts?.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <span
            key={index}
            className={cn(
              "cursor-pointer underline underline-offset-4",
              isMine ? "text-primary-foreground" : "text-primary",
            )}
            onClick={() => setSelectedLink(part)}
          >
            {text("link")}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      <motion.div
        className={cn(
          "group/fullContainer flex flex-col whitespace-pre-wrap px-2 sm:px-4",
          isMine ? "items-end" : "items-start",
          isFirst ? "pt-1" : "pt-0",
          isLast ? "pb-1" : "pb-0",
        )}
        ref={messageDiv}
      >
        <div
          className={cn("flex w-full items-start gap-3", {
            "justify-end": isMine,
          })}
        >
          {!isMine && (
            <div className="mt-5 size-10 shrink-0">
              {isFirst && (
                <UserAvatar
                  user={message.sender}
                  innerClassName="!rounded-2xl"
                  className="size-10 rounded-2xl border border-primary/10"
                />
              )}
            </div>
          )}
          <div
            className={cn(
              "flex max-w-[min(82%,38rem)] items-end gap-2",
              isMine && "flex-row-reverse",
            )}
          >
            <div
              className={cn(
                "flex min-w-0 flex-col",
                isMine ? "items-end" : "items-start",
              )}
            >
              {isFirst && (
                <div
                  className={cn(
                    "mb-1 px-1 text-[11px] font-bold text-text-3",
                    isMine && "text-end",
                  )}
                >
                  {message.sender.name}
                </div>
              )}
              <div
                className={cn(
                  "group/bubble relative min-w-20 px-4 py-3 text-sm leading-6 transition-all duration-200",
                  isMine
                    ? "border border-primary/30 bg-primary text-primary-foreground"
                    : "border border-primary/10 bg-clear-ground text-text-2",
                  isMine
                    ? cn(
                        "rounded-2xl",
                        !isFirst && "rounded-e-md",
                        !isLast && "rounded-e-md",
                      )
                    : cn(
                        "rounded-2xl",
                        !isFirst && "rounded-s-md",
                        !isLast && "rounded-s-md",
                      ),
                )}
              >
                {message.repliedTo && (
                  <div
                    className={cn(
                      "mb-3 rounded-xl border px-3 py-2",
                      isMine
                        ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
                        : "border-primary/15 bg-primary/10 text-text-2",
                    )}
                  >
                    <p
                      className={cn(
                        "mb-1 text-xs font-bold",
                        isMine ? "text-primary-foreground" : "text-primary",
                      )}
                    >
                      {message.repliedTo.sender.name}
                    </p>
                    <p className="line-clamp-2 text-xs opacity-80">
                      {renderMessageText(message.repliedTo.text)}
                    </p>
                  </div>
                )}

                {message.text && <p>{renderMessageText(message.text)}</p>}
                {message.media.map((uri) => <ChatAttachment key={uri} uri={uri} />)}
              </div>
              <div
                className={cn(
                  "mt-0.5 h-2.5 px-1 text-[10px] font-semibold leading-none text-text-3 opacity-0 transition-opacity group-hover/fullContainer:opacity-100",
                  isMine ? "text-end" : "text-start",
                )}
              >
                {sentAt}
              </div>
            </div>
            <CommunitySafetyActions kind="message" targetId={message._id} authorId={message.sender._id} className="mb-2 [@media(hover:hover)]:opacity-0 group-hover/fullContainer:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 transition-opacity">
                <DropdownMenuItem asChild>
                  <button
                    className="flex w-full cursor-pointer items-center gap-4"
                    onClick={() => {
                      setActionOnMessage({
                        action: "reply",
                        message: message,
                      });
                    }}
                  >
                    <LuReply /> <span>{text("reply")}</span>
                  </button>
                </DropdownMenuItem>
                {isMine && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <button
                        disabled={
                          new Date(message.createdAt).getTime() <
                            new Date().getTime() - 1000 * 60 * 60 * 6 &&
                          myAccount?.role !== "admin"
                        }
                        className="flex w-full cursor-pointer items-center gap-4 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => {
                          setActionOnMessage({
                            action: "edit",
                            message: message,
                          });
                        }}
                      >
                        <MdEdit /> <span>{text("edit")} </span>
                      </button>
                    </DropdownMenuItem>
                  </>
                )}
                {(isMine || myAccount?.role === "admin") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <button
                        disabled={
                          new Date(message.createdAt).getTime() <
                            new Date().getTime() - 1000 * 60 * 60 * 6 &&
                          myAccount?.role !== "admin"
                        }
                        className="flex w-full cursor-pointer items-center gap-4 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => {
                          setIsDeleting(true);
                        }}
                      >
                        <MdDelete /> <span>{text("delete")} </span>
                      </button>
                    </DropdownMenuItem>
                  </>
                )}
            </CommunitySafetyActions>
          </div>
        </div>
      </motion.div>

      <AlertDialog
        onOpenChange={(isOpen) => {
          setIsDeleting(isOpen);
        }}
        open={isDeleting}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("areYouSureDeleteMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              disabled={isLoading}
              onClick={() => {
                setIsDeleting(false);
              }}
              variant={"outline"}
              className="min-w-24"
            >
              {text("cancel")}
            </Button>
            <Button
              disabled={isLoading}
              className="min-w-24"
              onClick={() => {
                deleteMessageAction();
              }}
            >
              {text("iamSure")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!selectedLink}
        onOpenChange={() => setSelectedLink(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("externalLink")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("externalLinkWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setSelectedLink(null)}>
              {text("cancel")}
            </Button>
            <Button
              onClick={() => {
                window.open(selectedLink!, "_blank");
                setSelectedLink(null);
              }}
            >
              {text("continue")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const MessageCardSkeleton = ({ isMine }: { isMine: boolean }) => {
  return (
    <div
      className={cn(
        "flex flex-col whitespace-pre-wrap px-2 py-2 sm:px-4",
        isMine ? "items-end" : "items-start",
      )}
    >
      <div
        className={cn("flex w-full items-start gap-3", {
          "justify-end": isMine,
        })}
      >
        {!isMine && (
          <div className="mt-5 flex size-10 shrink-0 animate-pulse items-center justify-center rounded-2xl border border-primary/10 bg-clear-ground cardShadowSm">
            <div className="size-5 rounded-lg bg-muted" />
          </div>
        )}
        <div
          className={cn(
            "flex max-w-[min(82%,38rem)] items-end gap-2",
            isMine && "flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-col",
              isMine ? "items-end" : "items-start",
            )}
          >
            <div className="mb-1 h-2.5 w-20 animate-pulse rounded-full bg-muted" />
            <div
              className={cn(
                "w-72 max-w-[78vw] animate-pulse rounded-2xl border p-3 cardShadowSm sm:w-80",
                isMine
                  ? "border-primary/20 bg-primary/15"
                  : "border-primary/10 bg-clear-ground",
              )}
            >
              <div
                className={cn(
                  "h-2.5 rounded-full",
                  isMine ? "bg-primary/25" : "bg-muted",
                )}
              />
              <div
                className={cn(
                  "mt-2 h-2.5 w-2/3 rounded-full",
                  isMine ? "bg-primary/25" : "bg-muted",
                )}
              />
              <div
                className={cn(
                  "mt-2 h-2.5 w-1/2 rounded-full",
                  isMine ? "bg-primary/25" : "bg-muted",
                )}
              />
            </div>
            <div className="mt-1 h-2 w-12 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mb-4 hidden size-8 animate-pulse rounded-full border border-primary/10 bg-clear-ground cardShadowSm sm:block" />
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
