/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import {
  Crown,
  Info,
  LogOut,
  MoreHorizontal,
  PencilLine,
  ShieldCheck,
  UserMinus,
  UserPlus,
  UsersRound,
  ImageIcon,
  Mail,
  MessageSquareText,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import { useChatStore } from "@/stores/ChatStore";
import { IChat, IUser } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useCustomSearchParams from "@/hooks/useSearchParams";

type ChatFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const ChatFormDialog: React.FC<ChatFormDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  footer,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        isOpen={open}
        className="flex max-h-[90vh] gap-0 overflow-hidden rounded-2xl border-primary/10 bg-background p-0 cardShadow sm:max-w-[540px]"
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <DialogHeader className="border-b border-primary/10 bg-background px-5 py-4 pe-12 text-start">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary">
                {icon}
              </span>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-start text-lg font-black text-text-1">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-1 text-start text-sm leading-6 text-text-3">
                  {description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto bg-background px-5 py-5">
            {children}
          </div>
          <DialogFooter className="border-t border-primary/10 bg-background px-5 py-4 sm:justify-start sm:space-x-0">
            <div className="flex w-full min-w-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {footer}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

type ChatDialogFieldProps = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
};

const ChatDialogField: React.FC<ChatDialogFieldProps> = ({
  label,
  icon,
  children,
  hint,
}) => {
  return (
    <div className="space-y-2.5">
      <Label className="flex items-center gap-2 text-sm font-black text-text-1">
        <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs leading-5 text-text-3">{hint}</p>}
    </div>
  );
};
export default function ChatTopbar() {
  const inputs = useTranslations("Forms");
  const locale = useLocale();
  const {
    isFetchingThisChat,
    thisChat,
    setThisChat,
    setChats,
    chats,
    setSelectedChatId,
  } = useChatStore();
  const { user: thisUser, token } = useAuth();
  const anotherUser = thisChat?.participants.find(
    (user) => user.user !== thisUser?._id,
  );
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const text = useTranslations("chat");
  const isAdmin = thisChat?.participants.find(
    (participant) => participant.user === thisUser?._id,
  )?.isAdmin;

  const [action, setAction] = useState<"remove" | "changeRole">("remove");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<{
    _id: string;
    isAdmin: boolean;
    userDetails: IUser;
    user: string;
  } | null>(null);
  const handelAction = async () => {
    try {
      setIsLoading(true);
      if (action === "remove") {
        await axiosInstance.put(
          `/chats/${thisChat?._id}/removeParticipant`,
          {
            userEmail: selectedParticipant?.userDetails.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const newParticipants = thisChat?.participants.filter(
          (participant) => participant._id !== selectedParticipant?._id,
        );
        const newChat: IChat = {
          ...thisChat,
          // @ts-ignore
          participants: newParticipants,
        };
        setThisChat(newChat);
      } else {
        await axiosInstance.put(
          `/chats/${thisChat?._id}/updateParticipantRole`,
          {
            userEmail: selectedParticipant?.userDetails.email,
            isAdmin: !selectedParticipant?.isAdmin,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const newParticipants = thisChat?.participants.map((participant) => {
          if (participant._id === selectedParticipant?._id) {
            return {
              ...participant,
              isAdmin: !participant.isAdmin,
            };
          }
          return participant;
        });
        setThisChat({
          ...thisChat,
          // @ts-ignore
          participants: newParticipants,
        });
      }
      toast.success(text("actionSuccess"));
      setIsOpen(false);
    } catch (e) {
      console.log(e);
      toast.error(text("actionFailed"));
    } finally {
      setIsLoading(false);
    }
  };
  const [addToChatData, setAddToChatData] = useState<{
    email: string;
    isAdmin: string;
  }>({
    email: "",
    isAdmin: "no",
  });
  const [isAddToChatOpen, setIsAddToChatOpen] = useState(false);
  const handleAddToChat = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/chats/${thisChat?._id}/addParticipant`,
        {
          userEmail: addToChatData.email,
          isAdmin: addToChatData.isAdmin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(text("actionSuccess"));
      setIsAddToChatOpen(false);
    } catch (e) {
      console.log(e);
      toast.error(text("actionFailed"));
    } finally {
      setIsLoading(false);
    }
  };
  // edit chat data
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editData, setEditData] = useState<{
    image: File | null;
    description: string;
    groupName: string;
  }>({
    image: null,
    description: "",
    groupName: "",
  });
  const handleEditChat = async () => {
    setIsEditLoading(true);
    try {
      const formData = new FormData();
      if (editData.image) {
        formData.append("image", editData.image);
      }
      formData.append("description", editData.description);
      formData.append("groupName", editData.groupName);

      const res = await axiosInstance.put(
        `/chats/${thisChat?._id}/updateGroup`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setThisChat(res.data.data);
      setChats(
        chats.map((chat) => {
          if (chat._id === thisChat?._id) {
            return { ...chat, ...res.data.data };
          }
          return chat;
        }),
      );
      toast.success(text("actionSuccess"));
      setIsEditOpen(false);
    } catch (e) {
      console.log(e);
      toast.error(text("actionFailed"));
    } finally {
      setIsEditLoading(false);
    }
  };
  useEffect(() => {
    if (thisChat) {
      setEditData({
        groupName: thisChat.groupName,
        description: thisChat.description,
        image: null,
      });
    }
  }, [thisChat]);
  const { setSearchParams } = useCustomSearchParams();
  const participants = thisChat?.participants ?? [];
  const adminsCount = participants.filter(
    (participant) => participant.isAdmin,
  ).length;
  const membersCount = Math.max(participants.length - adminsCount, 0);
  const formatCount = (value: number) =>
    new Intl.NumberFormat(locale).format(value);
  const groupDescription =
    thisChat?.description?.trim() || text("noDescription");
  const openParticipantAction = (
    participant: NonNullable<IChat["participants"]>[number],
    nextAction: "remove" | "changeRole",
  ) => {
    setIsOpen(true);
    setSelectedParticipant({
      _id: participant._id,
      isAdmin: participant.isAdmin,
      userDetails: participant.userDetails,
      user: participant.user,
    });
    setAction(nextAction);
  };
  return (
    <>
      <div className="relative z-10 flex h-22 w-full items-center justify-between gap-4 border-b border-primary/10 bg-clear-ground/90 p-4 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-3 flex-1">
          {isFetchingThisChat ? (
            <div className="flex size-12 animate-pulse items-center justify-center rounded-2xl border border-primary/10 bg-clear-ground cardShadowSm">
              <div className="size-5 rounded-lg bg-muted" />
            </div>
          ) : (
            <>
              {thisChat?.isGroupChat ? (
                <>
                  <UserAvatar
                    user={{
                      name: thisChat.groupName,
                      profileImg: thisChat.image,
                    }}
                    className="size-12 rounded-2xl border border-primary/10 cardShadowSm"
                    innerClassName="!rounded-2xl"
                  />
                </>
              ) : (
                <>
                  <UserAvatar
                    className="size-12 rounded-2xl border border-primary/10 cardShadowSm"
                    innerClassName="!rounded-2xl"
                    user={anotherUser?.userDetails}
                  />
                </>
              )}
            </>
          )}
          {isFetchingThisChat ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-primary/10 bg-clear-ground/70 px-3 py-2 cardShadowSm">
              <div className="h-3 w-48 animate-pulse rounded-full bg-primary/10" />
              <div className="h-2.5 w-64 animate-pulse rounded-full bg-muted sm:w-80" />
            </div>
          ) : (
            <div className="flex min-w-0 flex-col ">
              {thisChat?.isGroupChat ? (
                <>
                  <span className="line-clamp-1 text-sm font-bold text-text-1">
                    {thisChat?.groupName}
                  </span>
                  <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                    <span className="line-clamp-2 text-xs text-text-3">
                      {thisChat?.description}
                    </span>
                  </div>
                </>
              ) : (
                <span className="line-clamp-1 text-sm font-bold text-text-1">
                  {anotherUser?.userDetails?.name}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex min-w-0 items-center gap-3 ">
          {thisChat?.isGroupChat && (
            <div>
              <button
                onClick={() => setIsInfoOpen(true)}
                className={cn(
                  "size-11",
                  "flex cursor-pointer items-center justify-center rounded-full border border-primary/15 bg-clear-ground text-primary transition-colors hover:bg-primary/10",
                )}
              >
                <Info size={20} className="text-primary" />
              </button>
            </div>
          )}
          {thisChat && (
            <div>
              <button
                onClick={() => {
                  setSelectedChatId("");
                  setSearchParams({ selectedChat: "" });
                }}
                className={cn(
                  "size-11",
                  "flex cursor-pointer items-center justify-center rounded-full border border-primary/15 bg-clear-ground text-primary transition-colors hover:bg-primary/10",
                )}
              >
                <LogOut
                  size={20}
                  className={cn("text-primary", {
                    "-scale-x-100": locale === "ar",
                  })}
                />
              </button>
            </div>
          )}
        </div>
      </div>{" "}
      <Sheet open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <SheetContent
          dir={locale === "ar" ? "rtl" : "ltr"}
          side={locale !== "ar" ? "left" : "right"}
          className="flex max-h-screen flex-col overflow-hidden border-primary/10 bg-background p-0 sm:max-w-[100%] md:max-w-[460px] lg:max-w-[520px]"
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-primary/10 bg-background px-5 pb-5 pt-6">
              <SheetHeader className="space-y-0 text-start">
                <div className="flex items-start gap-4 pe-8">
                  <UserAvatar
                    user={{
                      name: thisChat?.groupName || text("groupDetails"),
                      profileImg: thisChat?.image,
                    }}
                    className="size-16 rounded-2xl border border-primary/10 bg-clear-ground"
                    innerClassName="!rounded-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                        <ShieldCheck className="size-3.5" />
                        {text("privateGroup")}
                      </span>
                    </div>
                    <SheetTitle className="line-clamp-2 text-start text-xl font-black text-text-1">
                      {thisChat?.groupName || text("groupDetails")}
                    </SheetTitle>
                    <SheetDescription className="mt-2 line-clamp-4 text-start text-sm leading-6 text-text-3">
                      {groupDescription}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-primary/10 bg-clear-ground px-3 py-3">
                  <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UsersRound className="size-4" />
                  </div>
                  <p className="text-lg font-black text-text-1">
                    {formatCount(participants.length)}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-text-3">
                    {text("participants")}
                  </p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-clear-ground px-3 py-3">
                  <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Crown className="size-4" />
                  </div>
                  <p className="text-lg font-black text-text-1">
                    {formatCount(adminsCount)}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-text-3">
                    {text("admins")}
                  </p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-clear-ground px-3 py-3">
                  <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UsersRound className="size-4" />
                  </div>
                  <p className="text-lg font-black text-text-1">
                    {formatCount(membersCount)}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-text-3">
                    {text("members")}
                  </p>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-background px-5 py-5">
              {isAdmin && (
                <div className="mb-5 rounded-2xl border border-primary/10 bg-clear-ground p-3">
                  <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <div>
                      <p className="text-sm font-black text-text-1">
                        {text("groupActions")}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-text-3">
                        {text("admin")}
                      </p>
                    </div>
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Crown className="size-4" />
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setIsAddToChatOpen(true)}
                      className="h-11 rounded-2xl"
                    >
                      <UserPlus className="me-2 size-4" />
                      {text("addParticipant")}
                    </Button>
                    <Button
                      onClick={() => setIsEditOpen(true)}
                      variant="outline"
                      className="h-11 rounded-2xl border-primary/15 bg-clear-ground"
                    >
                      <PencilLine className="me-2 size-4" />
                      {text("editChatData")}
                    </Button>
                  </div>
                </div>
              )}

              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-sm font-black text-text-1">
                    {text("participants")}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-text-3">
                    {formatCount(participants.length)} {text("members")}
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {participants.map((participant) => {
                  const isCurrentUser = participant.user === thisUser?._id;

                  return (
                    <li
                      className="flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-clear-ground px-3 py-3 transition-colors hover:border-primary/20 hover:bg-primary/5"
                      key={participant?._id}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <UserAvatar
                          user={participant?.userDetails}
                          className="size-11 rounded-2xl border border-primary/10"
                          innerClassName="!rounded-2xl"
                        />
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <p className="truncate text-sm font-bold text-text-1">
                              {participant?.userDetails?.name}
                            </p>
                            {isCurrentUser && (
                              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                {text("you")}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold",
                                participant?.isAdmin
                                  ? "border-secondary/20 bg-secondary/10 text-secondary"
                                  : "border-primary/10 bg-background text-text-3",
                              )}
                            >
                              {participant?.isAdmin && (
                                <Crown className="size-3" />
                              )}
                              {participant?.isAdmin
                                ? text("admin")
                                : text("member")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-label={text("edit")}
                              size="icon"
                              variant="outline"
                              className="size-9 shrink-0 rounded-full border-primary/10 bg-background"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-44 border-primary/10 bg-clear-ground"
                          >
                            <DropdownMenuItem asChild>
                              <button
                                onClick={() =>
                                  openParticipantAction(participant, "remove")
                                }
                                className="flex w-full cursor-pointer items-center gap-2 text-destructive"
                              >
                                <UserMinus className="size-4" />
                                {text("kick")}
                              </button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <button
                                onClick={() =>
                                  openParticipantAction(
                                    participant,
                                    "changeRole",
                                  )
                                }
                                className="flex w-full cursor-pointer items-center gap-2"
                              >
                                <ShieldCheck className="size-4" />
                                {participant?.isAdmin
                                  ? text("removeAdmin")
                                  : text("makeAdmin")}
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>{" "}
      <AlertDialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("youWillNotBeAbleToRevert")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              variant={"outline"}
              disabled={isLoading}
            >
              {text("cancel")}
            </Button>
            <Button disabled={isLoading} onClick={handelAction}>
              {text("iamSure")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ChatFormDialog
        open={isAddToChatOpen}
        onOpenChange={setIsAddToChatOpen}
        title={text("addParticipant")}
        description={text("addParticipantDescription")}
        icon={<UserPlus className="size-4" />}
        onSubmit={(e) => {
          e.preventDefault();
          handleAddToChat();
        }}
        footer={
          <>
            <Button
              type="button"
              onClick={() => setIsAddToChatOpen(false)}
              variant="outline"
              className="h-11 w-full rounded-2xl border-primary/15 bg-background sm:w-32"
              disabled={isLoading}
            >
              {text("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !addToChatData.email.trim()}
              className="h-11 w-full rounded-2xl sm:w-32"
            >
              {text("add")}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <ChatDialogField
            label={inputs("email")}
            icon={<Mail className="size-4" />}
            hint={text("participantEmailHint")}
          >
            <Input
              disabled={isLoading}
              value={addToChatData.email}
              onChange={(event) => {
                setAddToChatData({
                  ...addToChatData,
                  email: event.target.value,
                });
              }}
              placeholder={inputs("email")}
              type="email"
            />
          </ChatDialogField>
          <ChatDialogField
            label={inputs("isAdmin")}
            icon={<ShieldCheck className="size-4" />}
            hint={text("participantRoleHint")}
          >
            <Select
              disabled={isLoading}
              value={addToChatData.isAdmin}
              onValueChange={(value) => {
                setAddToChatData({
                  ...addToChatData,
                  isAdmin: value,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={inputs("isAdmin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">{text("member")}</SelectItem>
                <SelectItem value="yes">{text("admin")}</SelectItem>
              </SelectContent>
            </Select>
          </ChatDialogField>
        </div>
      </ChatFormDialog>{" "}
      <ChatFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title={text("editChatData")}
        description={text("editChatDescription")}
        icon={<PencilLine className="size-4" />}
        onSubmit={(e) => {
          e.preventDefault();
          handleEditChat();
        }}
        footer={
          <>
            <Button
              type="button"
              onClick={() => setIsEditOpen(false)}
              variant="outline"
              className="h-11 w-full rounded-2xl border-primary/15 bg-background sm:w-32"
              disabled={isEditLoading}
            >
              {text("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isEditLoading || !editData.groupName.trim()}
              className="h-11 w-full rounded-2xl sm:w-32"
            >
              {text("edit")}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <ChatDialogField
            label={inputs("groupName")}
            icon={<Type className="size-4" />}
            hint={text("groupNameHint")}
          >
            <Input
              disabled={isEditLoading}
              value={editData.groupName}
              onChange={(event) => {
                setEditData({
                  ...editData,
                  groupName: event.target.value,
                });
              }}
              placeholder={inputs("groupName")}
            />
          </ChatDialogField>
          <ChatDialogField
            label={inputs("image")}
            icon={<ImageIcon className="size-4" />}
            hint={text("groupImageHint")}
          >
            <Input
              accept="image/*"
              disabled={isEditLoading}
              onChange={(event) => {
                setEditData({
                  ...editData,
                  image: event.target.files?.[0] ?? null,
                });
              }}
              type="file"
            />
            {editData.image && (
              <p className="mt-2 line-clamp-1 rounded-xl border border-primary/10 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
                {editData.image.name}
              </p>
            )}
          </ChatDialogField>
          <ChatDialogField
            label={inputs("description")}
            icon={<MessageSquareText className="size-4" />}
            hint={text("groupDescriptionHint")}
          >
            <Textarea
              disabled={isEditLoading}
              value={editData.description}
              onChange={(event) => {
                setEditData({
                  ...editData,
                  description: event.target.value,
                });
              }}
              placeholder={inputs("description")}
            />
          </ChatDialogField>
        </div>
      </ChatFormDialog>
    </>
  );
}
