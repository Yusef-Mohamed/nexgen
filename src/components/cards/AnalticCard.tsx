"use client";
import { BsThreeDots } from "react-icons/bs";
import { IAnalytic } from "@/types";
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AiFillDelete } from "react-icons/ai";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "../auth-provider";
interface AnalyticCardProps {
  analytic: IAnalytic;
  getNewPosts?: () => void;
  isLast?: boolean;
  setAnalytics?: React.Dispatch<React.SetStateAction<IAnalytic[]>>;
}
const AnalyticCard: React.FC<AnalyticCardProps> = ({
  analytic,
  getNewPosts,
  isLast,
  setAnalytics,
}) => {
  const text = useTranslations("practice");
  const postDiv = useRef(null);
  const [marketerComment, setMarketerComment] = useState<string>("");
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isImageOpened, setIsImageOpened] = useState<boolean>(false);
  const { user, token } = useAuth();
  const isMyChild = user?._id === analytic.marketer;
  const handelSubmit = async () => {
    try {
      setIsLoading(true);
      const axiosInstance = await createClientAxiosInstance();
      const res = await axiosInstance.put(
        `/analytics/${analytic._id}`,
        {
          marketerComment,
          isPassed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (setAnalytics) {
        setAnalytics((prev) => {
          return prev.map((item) => {
            if (item._id === analytic._id) {
              return res.data.data;
            }
            return item;
          });
        });
      }
      setIsEditing(false);
      setIsOpen(false);
      toast.success(text("yourCommentIsAddedSuccessfully"));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  // handel pagination
  useEffect(() => {
    if (!isLast || !getNewPosts) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        getNewPosts();
      }
    });

    if (postDiv.current) {
      observer.observe(postDiv.current);
    }

    return () => {
      if (postDiv.current) {
        observer.unobserve(postDiv.current);
      }
    };
  }, [isLast, getNewPosts]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const handelDelete = async () => {
    try {
      setIsLoading(true);
      const axiosInstance = await createClientAxiosInstance();
      await axiosInstance.delete(`/analytics/${analytic._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (setAnalytics) {
        setAnalytics((prev) => {
          return prev.filter((item) => item._id !== analytic._id);
        });
      }
      setIsDeleting(false);
      toast.success(text("deletedSuccessfully"));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div ref={postDiv} className="w-full rounded-md bg-background">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2 pt-4 my-4">
            <UserAvatar user={analytic.user} />
            <div className="flex flex-col">
              <h2>{analytic.user?.name}</h2>
              <span className="text-xs text-muted-foreground">
                {new Date(analytic.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          {user?.role === "admin" && (
            <>
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
                        setIsDeleting(true);
                      }}
                      className="flex items-center justify-center gap-2"
                    >
                      <AiFillDelete size={18} />
                      {text("delete")}
                    </button>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog
                open={isDeleting}
                onOpenChange={(open) => {
                  setIsDeleting(open);
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
                        setIsDeleting(false);
                      }}
                      variant={"outline"}
                      disabled={isLoading}
                    >
                      {text("cancel")}
                    </Button>
                    <Button disabled={isLoading} onClick={handelDelete}>
                      {text("iamSure")}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
        <p className="px-5 my-4">{analytic.content}</p>
        <div>
          <Image
            width={600}
            height={600}
            src={analytic.imageCover}
            alt=""
            className="object-cover w-full cursor-pointer aspect-video"
            onClick={() => setIsImageOpened(true)}
          />
        </div>
        {!isEditing && analytic.marketerComment && (
          <div className="px-5 py-2 ">
            <div className="flex items-center justify-center gap-4">
              <p className="w-full p-4 border rounded-md">
                {analytic.marketerComment}
              </p>
              <div
                className={cn(
                  "flex  items-center justify-center w-10 aspect-square border rounded-full text-lg ",
                  {
                    "text-destructive border-destructive": !analytic.isPassed,
                    "text-primary border-primary": analytic.isPassed,
                  }
                )}
              >
                {analytic.isPassed ? <FaCheck /> : <IoMdClose />}
              </div>
            </div>
            {isMyChild && (
              <Button
                onClick={() => {
                  setIsEditing(true);
                  setMarketerComment(analytic?.marketerComment || "");
                  setIsPassed(analytic.isPassed);
                }}
                className="block mx-auto mt-2 w-fit"
              >
                {text("edit")}
              </Button>
            )}
          </div>
        )}
        {isMyChild && (isEditing || !analytic.marketerComment) && (
          <>
            <div className="w-full px-4">
              <Textarea
                value={marketerComment}
                className="w-full px-5 mt-4"
                placeholder="Add a comment"
                onChange={(e) => setMarketerComment(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center gap-4 pb-4 mt-2 mb-4">
              <button
                onClick={() => {
                  setIsPassed(false);
                  setIsOpen(true);
                }}
                className="flex items-center justify-center w-10 text-lg border rounded-full text-destructive aspect-square border-destructive"
              >
                <IoMdClose />
              </button>
              <button
                onClick={() => {
                  setIsPassed(true);
                  setIsOpen(true);
                }}
                className="flex items-center justify-center w-10 text-lg border rounded-full text-primary border-primary aspect-square"
              >
                <FaCheck />
              </button>
            </div>
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
                  <Button disabled={isLoading} onClick={handelSubmit}>
                    {text("iamSure")}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
      <AlertDialog
        open={isImageOpened}
        onOpenChange={(open) => {
          setIsImageOpened(open);
        }}
      >
        <AlertDialogContent className=" md:max-w-[50vw] sm:max-w-[70vw] max-w-[90vw] max-h-[90vh] overflow-auto">
          <button
            onClick={() => {
              setIsImageOpened(false);
            }}
            className="flex items-center justify-center ml-auto rounded-md"
          >
            <IoMdClose />
          </button>
          <Image
            width={600}
            height={600}
            src={analytic.imageCover}
            alt={analytic.content}
            className="object-cover w-full h-full max-w-full max-h-full"
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export const SkeletonAnalyticCard = () => {
  return (
    <>
      <div className="w-full rounded-md bg-background animate-pulse">
        <div className="flex items-center gap-2 px-4 pt-4 my-4">
          <div className="w-12 h-12 rounded-full bg-muted-foreground animate-pulse"></div>
          <div className="flex flex-col gap-2">
            <div className="w-12 h-2 rounded-xl bg-muted-foreground animate-pulse" />
            <div className="w-16 h-1 rounded-xl bg-muted-foreground animate-pulse" />
          </div>
        </div>
        <div className="px-5 my-4">
          <div className="w-full h-2 mb-2 rounded-xl bg-muted-foreground animate-pulse" />
          <div className="w-1/2 h-2 rounded-xl bg-muted-foreground animate-pulse" />
        </div>
        <div className="w-full aspect-video bg-muted-foreground animate-pulse" />
      </div>
    </>
  );
};

export default AnalyticCard;
