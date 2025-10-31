/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { Info, LogOut } from "lucide-react";
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
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { FaExchangeAlt } from "react-icons/fa";
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
import InputField from "@/components/InputField";
import { useAuth } from "@/components/auth-provider";
import useCustomSearchParams from "@/hooks/useSearchParams";
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
    (user) => user.user !== thisUser?._id
  );
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const text = useTranslations("chat");
  const isAdmin = thisChat?.participants.find(
    (participant) => participant.user === thisUser?._id
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
          }
        );
        const newParticipants = thisChat?.participants.filter(
          (participant) => participant._id !== selectedParticipant?._id
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
          }
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
        }
      );
      toast.success(text("actionSuccess"));
      setIsAddToChatOpen(false);
    } catch (e) {
      console.log(e);
      toast.error(text("actionFailed"));
    } finally {
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
        }
      );
      setThisChat(res.data.data);
      setChats(
        chats.map((chat) => {
          if (chat._id === thisChat?._id) {
            return { ...chat, ...res.data.data };
          }
          return chat;
        })
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
  return (
    <>
      <div className="flex items-center justify-between w-full h-20 p-4 border-b">
        <div className="flex items-center gap-2">
          {isFetchingThisChat ? (
            <div className="w-12 h-12 rounded-full animate-pulse bg-muted-foreground" />
          ) : (
            <>
              {thisChat?.isGroupChat ? (
                <>
                  <UserAvatar
                    user={{
                      name: thisChat.groupName,
                      profileImg: thisChat.image,
                    }}
                    className="w-12 h-12 rounded-md"
                    innerClassName="!rounded-md"
                  />
                </>
              ) : (
                <>
                  <UserAvatar
                    className="w-12 h-12 rounded-md"
                    innerClassName="!rounded-md"
                    user={anotherUser?.userDetails}
                  />
                </>
              )}
            </>
          )}
          {isFetchingThisChat ? (
            <div className="flex flex-col gap-2">
              <div className="w-48 h-3 rounded-lg bg-muted-foreground animate-pulse" />
              <div className="h-2 rounded-lg w-80 bg-muted-foreground animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-col">
              {thisChat?.isGroupChat ? (
                <>
                  {" "}
                  <span className="font-medium line-clamp-1">
                    {thisChat?.groupName}
                  </span>
                  <span className="text-xs line-clamp-1">
                    {thisChat?.description}
                  </span>
                </>
              ) : (
                <span className="font-medium">
                  {anotherUser?.userDetails?.name}
                </span>
              )}
            </div>
          )}
        </div>
        {thisChat?.isGroupChat && (
          <div>
            <button
              onClick={() => setIsInfoOpen(true)}
              className={cn(
                "h-11 w-11",
                "flex items-center ms-4 justify-center rounded-full text-primary bg-primary-faded"
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
                "h-11 w-11",
                "flex items-center ms-4 justify-center rounded-full text-primary bg-primary-faded"
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
      </div>{" "}
      <Sheet open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <SheetContent
          dir={locale === "ar" ? "rtl" : "ltr"}
          side={locale !== "ar" ? "left" : "right"}
          className="lg:max-w-[500px] md:max-w-[450px] sm:max-w-[100%] max-h-screen overflow-y-auto "
        >
          <SheetHeader className="mb-4 ">
            <SheetTitle className="text-start">
              {thisChat?.isGroupChat
                ? thisChat.groupName
                : anotherUser?.userDetails?.name}
            </SheetTitle>
            {thisChat?.isGroupChat && (
              <SheetDescription className="text-start">
                {thisChat.description}
              </SheetDescription>
            )}
          </SheetHeader>{" "}
          <ul>
            {thisChat?.participants.map((participant, index) => (
              <li
                className={cn(
                  "flex items-center px-3 justify-between gap-4 py-4",
                  {
                    "border-t": index !== thisChat.participants.length - 1,
                    "border-y": index === thisChat.participants.length - 1,
                  }
                )}
                key={participant?._id}
              >
                <div className="flex items-center gap-4">
                  <UserAvatar user={participant?.userDetails} />
                  <span>
                    {participant?.userDetails?.name}
                    <span className="px-1 text-xs text-text-3">
                      ({participant?.isAdmin ? text("admin") : text("member")})
                    </span>
                  </span>
                </div>
                {isAdmin && (
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={"sm"} variant="outline">
                          <BsThreeDots />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setSelectedParticipant({
                                _id: participant?._id,
                                isAdmin: participant?.isAdmin,
                                userDetails: participant?.userDetails,
                                user: participant?.user,
                              });
                              setAction("remove");
                            }}
                            className="flex items-center justify-center gap-2"
                          >
                            <AiFillDelete size={18} />
                            {text("kick")}
                          </button>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setSelectedParticipant({
                                _id: participant?._id,
                                isAdmin: participant?.isAdmin,
                                userDetails: participant?.userDetails,
                                user: participant?.user,
                              });
                              setAction("changeRole");
                            }}
                            className="flex items-center justify-center gap-2"
                          >
                            <FaExchangeAlt size={18} />
                            {participant?.isAdmin
                              ? text("removeAdmin")
                              : text("makeAdmin")}
                          </button>
                        </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {isAdmin && (
            <>
              <Button
                onClick={() => {
                  setIsAddToChatOpen(true);
                }}
                className="w-full mt-4"
              >
                {text("addParticipant")}
              </Button>
              <Button
                onClick={() => {
                  setIsEditOpen(true);
                }}
                className="w-full mt-2"
              >
                {text("editChatData")}
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
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
      <AlertDialog
        open={isAddToChatOpen}
        onOpenChange={(open) => {
          setIsAddToChatOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("addParticipant")}</AlertDialogTitle>
          </AlertDialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddToChat();
            }}
            className="space-y-4"
          >
            <InputField
              input={{ name: "email", type: "text" }}
              isLoading={isLoading}
              setData={(value) => {
                setAddToChatData({
                  ...addToChatData,
                  email: value as string,
                });
              }}
              inputs={inputs}
            />
            <InputField
              input={{
                name: "isAdmin",
                type: "select",
                values: [
                  { value: "yes", label: text("admin") },
                  { value: "no", label: text("member") },
                ],
              }}
              isLoading={isLoading}
              setData={(value) => {
                setAddToChatData({
                  ...addToChatData,
                  isAdmin: value as string,
                });
              }}
              value={addToChatData.isAdmin}
              inputs={inputs}
            />
            <div className="flex items-center gap-2">
              <Button
                size={"sm"}
                type="button"
                onClick={() => {
                  setIsAddToChatOpen(false);
                }}
                variant={"outline"}
                className="w-full"
                disabled={isLoading}
              >
                {text("cancel")}
              </Button>
              <Button size={"sm"} disabled={isLoading} className="w-full">
                {text("add")}
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("editChatData")}</AlertDialogTitle>
          </AlertDialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditChat();
            }}
            className="space-y-4"
          >
            <InputField
              error={{}}
              input={{ name: "groupName", type: "text" }}
              isLoading={isEditLoading}
              setData={(value) => {
                setEditData({
                  ...editData,
                  groupName: value as string,
                });
              }}
              inputs={inputs}
              value={editData.groupName}
            />
            <InputField
              error={{}}
              input={{ name: "image", type: "file" }}
              isLoading={isEditLoading}
              setData={(value) => {
                setEditData({
                  ...editData,
                  image: value as File,
                });
              }}
              inputs={inputs}
              notRequired
            />{" "}
            <InputField
              error={{}}
              input={{ name: "description", type: "textarea" }}
              isLoading={isEditLoading}
              setData={(value) => {
                setEditData({
                  ...editData,
                  description: value as string,
                });
              }}
              inputs={inputs}
              value={editData.description}
            />
            <div className="flex items-center gap-2">
              <Button
                size={"sm"}
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                }}
                variant={"outline"}
                className="w-full"
                disabled={isEditLoading}
              >
                {text("cancel")}
              </Button>
              <Button size={"sm"} disabled={isEditLoading} className="w-full">
                {text("edit")}
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
