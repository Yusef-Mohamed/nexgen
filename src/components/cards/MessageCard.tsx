import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { motion } from "framer-motion";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import UserAvatar from "../UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { useTranslations } from "next-intl";
import { useAuth } from "../auth-provider";
import ImageWithZoom from "../ImageWithZoom";

interface MessageCardProps {
  message: IMessage;
  isMine: boolean;
  isFirst?: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  isMine,
  isFirst,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const { setActionOnMessage, deleteMessage, socket } = useChatStore();
  const messageDiv = useRef(null);
  const { user: myAccount, token } = useAuth();
  const text = useTranslations("chat");

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
    } catch (e) {
      console.log(e);
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
            className="underline cursor-pointer"
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
          "flex flex-col gap-2 px-4 py-[2px] whitespace-pre-wrap group/fullContainer ",
          isMine ? "items-start" : "items-end"
        )}
        ref={messageDiv}
      >
        <div
          className={cn("flex gap-3 w-full", {
            "flex-row-reverse": isMine,
          })}
        >
          {!isMine && (
            <UserAvatar
              user={message.sender}
              innerClassName="!rounded-md"
              className={cn("w-10 h-10 rounded-md", {
                "opacity-0": !isFirst,
              })}
            />
          )}
          <div
            className={cn("flex items-center gap-3", {
              "flex-row-reverse": isMine,
            })}
          >
            <div
              className={cn(
                "px-4 py-2 rounded-[1.25rem] min-w-20 flex-1 group relative max-w-md",
                {
                  "bg-primary text-white": isMine,
                  "bg-primary/5 border border-primary/20": !isMine,
                }
              )}
            >
              {isMine&&
              <div className={cn("absolute top-0  ",{
                "end-0":isMine,
              })}
              style={{
                border:"15px solid",
                borderColor:"hsl(var(--primary)) transparent transparent transparent"
              }}
              ></div>
            }
              {message.repliedTo && (
                <div
                  className={cn(" px-4 py-2 rounded-lg mb-2", {
                    "bg-muted text-text-2": isMine,
                    "bg-primary/10 border border-primary/20  ": !isMine,
                  })}
                >
                  <p className="text-primary text-sm mb-1">
                    {message.repliedTo.sender.name}
                  </p>
                  <p className="text-xs">
                    {renderMessageText(message.repliedTo.text)}
                  </p>
                </div>
              )}

              <p>{renderMessageText(message.text)}</p>
              {message.media[0] &&
                (message.media[0].endsWith("pdf") ? (
                  <a
                    href={message.media[0]}
                    target="_blank"
                    className="text-sm font-normal underline"
                  >
                    {text("pdfFileClickToOpen")}
                  </a>
                ) : (
                  <ImageWithZoom
                    src={message.media[0]}
                    alt=""
                    width={400}
                    height={400}
                    className="w-full mt-4"
                  />
                ))}

              <span
                className={cn(
                  "absolute text-sm top-0 translate-x-1/2 right-1/2 scale-0 group-hover:scale-100 transition-all -translate-y-[110%] rounded px-3 py-2 whitespace-nowrap",
                  {
                    "bg-primary": isMine,
                    "bg-muted": !isMine,
                  }
                )}
              >
                {new Date(message.createdAt)
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  ?.toLowerCase()}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 text-lg transition-all scale-0 rounded group-hover/fullContainer:scale-100 bg-muted">
                  <HiOutlineDotsHorizontal />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <button
                    className="flex items-center w-full gap-4"
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
                        className="flex items-center w-full gap-4 disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="flex items-center w-full gap-4 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => {
                          setIsDeleting(true);
                        }}
                      >
                        <MdDelete /> <span>{text("delete")} </span>
                      </button>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
        "flex flex-col gap-2 p-4 whitespace-pre-wrap ",
        isMine ? "items-start" : "items-end"
      )}
    >
      <div
        className={cn("flex gap-3 items-center w-full", {
          "flex-row-reverse": !isMine,
        })}
      >
        <div className="w-12 h-12 rounded-full bg-muted-foreground animate-pulse" />
        <div
          className={cn(
            "p-3 group rounded max-w-xs bg-muted w-full flex-1 animate-pulse"
          )}
        >
          <div className="w-full h-2 rounded bg-muted-foreground animate-pulse" />
          <div className="w-1/2 h-2 mt-1 rounded me-auto bg-muted-foreground animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
