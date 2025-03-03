"use client";
import { IPost } from "@/types";
import UserAvatar from "../UserAvatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaRegComment } from "react-icons/fa6";
import { AiFillDelete, AiOutlineLike } from "react-icons/ai";
import { useEffect, useState } from "react";
import FocusedPostCard from "./FocusedPostCard";
import { Link, useRouter } from "@/i18n/routing";
import { useAuth } from "../auth-provider";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { BsThreeDots } from "react-icons/bs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
interface PostCardProps {
  post: IPost;
  inCommunity?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, inCommunity }) => {
  const text = useTranslations("post");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative w-full p-3 rounded-md cardShadow sm:p-6 bg-background">
        <PostAction post={post} />
        {inCommunity ? (
          <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
            <Link href={`/dashboard/community/profile/${post.user._id}`}>
              <UserAvatar user={post.user} />
            </Link>
            <div className="flex flex-col">
              <Link href={`/dashboard/community/profile/${post.user._id}`}>
                <h4>{post.user.name}</h4>
              </Link>
              <span className="text-sm max-sm:text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
            <UserAvatar user={post.user} />
            <div className="flex flex-col">
              <h4>{post.user.name}</h4>
              <span className="text-sm max-sm:text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        <p className="my-2 sm:my-4 max-sm:text-sm">{post.content}</p>
        <div
          onClick={() => {
            setIsOpen(true);
          }}
          className={cn(`grid grid-cols-1 gap-0.5`, {
            "grid-cols-2": post.images.length === 1,
          })}
        >
          <Image
            width={600}
            height={600}
            src={post.imageCover}
            alt=""
            className="object-cover w-full aspect-video"
          />
          {post.images.length === 1 && (
            <Image
              width={600}
              height={600}
              src={post.images[0]}
              alt=""
              className="object-cover w-full aspect-video"
            />
          )}
          {post.images.length > 1 && (
            <div className="grid grid-cols-2 gap-0.5 w-full">
              <Image
                width={600}
                height={600}
                src={post.images[0]}
                alt=""
                className="object-cover w-full aspect-video"
              />
              <div className="relative w-full">
                <Image
                  width={100}
                  height={100}
                  src={post.images[1]}
                  alt=""
                  className="object-cover w-full aspect-video"
                />
                <div className="flex items-center justify-center bg-background opacity-25 z-[1] w-full h-full absolute top-0 right-0" />
                <div className="flex items-center justify-center z-[2] w-full h-full absolute top-0 right-0">
                  <span className="text-4xl font-bold">
                    +{post.images.length - 1}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center mt-2 justify-evenly sm:mt-4">
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-2 py-1 text-lg transition-all rounded-md sm:px-4 sm:py-2 max-sm:text-sm hover:bg-muted"
          >
            <AiOutlineLike /> {text("like")} ({post.reactionsCount})
          </button>
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-2 py-1 text-lg transition-all rounded-md sm:px-4 sm:py-2 max-sm:text-sm hover:bg-muted"
          >
            <FaRegComment /> {text("comment")} ({post.commentsCount})
          </button>
        </div>
      </div>
      <FocusedPostCard
        inCommunity={inCommunity}
        post={post}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};
export const SkeletonPostCard = () => {
  return (
    <>
      <div className="w-full rounded-md bg-background animate-pulse">
        <div className="flex items-center gap-2 px-4 pt-4 my-2 sm:my-4">
          <div className="w-12 h-12 rounded-full bg-muted-foreground animate-pulse"></div>
          <div className="flex flex-col gap-2">
            <div className="w-12 h-2 rounded-xl bg-muted-foreground animate-pulse" />
            <div className="w-16 h-1 rounded-xl bg-muted-foreground animate-pulse" />
          </div>
        </div>
        <div className="px-5 my-2 sm:my-4">
          <div className="w-full h-2 mb-2 rounded-xl bg-muted-foreground animate-pulse" />
          <div className="w-1/2 h-2 rounded-xl bg-muted-foreground animate-pulse" />
        </div>
        <div className="w-full aspect-video bg-muted-foreground animate-pulse" />
        <div className="flex items-center justify-center gap-4 p-2 m-2 border-t">
          <button className="w-full h-8 py-1 rounded-md bg-muted-foreground animate-pulse"></button>
          <button className="w-full h-8 py-1 rounded-md bg-muted-foreground animate-pulse"></button>
        </div>
      </div>
    </>
  );
};

export default PostCard;
const PostAction: React.FC<{
  post: IPost;
}> = ({ post }) => {
  const [isInClient, setIsInClient] = useState(false);
  useEffect(() => {
    setIsInClient(true);
  }, []);

  const router = useRouter();
  const text = useTranslations("postAction");
  const { user: thisUser, token } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const axiosInstance = await createClientAxiosInstance();
      await axiosInstance.delete(`/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsDeleting(false);
      toast.success(text("delete_success"));
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(text("something_wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  if (thisUser?.role !== "admin" || !isInClient) return null;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"sm"}
            variant="outline"
            className="absolute top-4 left-4"
          >
            <BsThreeDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel asChild>
            <button
              onClick={() => {
                setIsDeleting(true);
              }}
              className="flex w-full gap-2"
            >
              <AiFillDelete size={18} />
              {text("delete")}
            </button>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("are_you_sure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("delete_confirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isLoading}
              onClick={() => {
                setIsDeleting(false);
              }}
            >
              {text("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={handleDelete}>
              {text("continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
