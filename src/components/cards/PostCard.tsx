"use client";
import { IPost } from "@/types";
import UserAvatar from "../UserAvatar";
import { cn, getCommentText } from "@/lib/utils";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { FaRegComment } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import FocusedPostCard from "./FocusedPostCard";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useAuth } from "../auth-provider";
import { axiosInstance } from "@/app/lib/utils";
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
import ReactionComponent from "../ReactionComponent";
import CommentCard from "./CommentCard";
import PostReactions from "./PostReactions";

interface PostCardProps {
  post: IPost;
  inCommunity?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, inCommunity }) => {
  const text = useTranslations("post");
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const isInstructorDashboard = pathname.includes("instructor-dashboard");
  return (
    <>
      <div
        onClick={() => {
          console.log(post);
        }}
        className="relative w-full rounded-md cardShadow bg-background-2"
      >
        <PostAction post={post} />
        <div className="p-3">
          {inCommunity ? (
            <div className="flex items-center gap-2">
              <Link
                href={`${
                  isInstructorDashboard ? "/instructor-dashboard" : "/dashboard"
                }/community/profile/${post.user._id}`}
              >
                <UserAvatar user={post.user} />
              </Link>
              <div className="flex flex-col">
                <Link
                  href={`${
                    isInstructorDashboard
                      ? "/instructor-dashboard"
                      : "/dashboard"
                  }/community/profile/${post.user._id}`}
                >
                  <h4 className="text-sm">{post.user.name}</h4>
                </Link>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <UserAvatar user={post.user} />
              <div className="flex flex-col">
                <h4 className="text-sm">{post.user.name}</h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <p className="mt-1 px-2 text-sm">
            {post.content.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index !== post.content.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
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
        <div className="p-3">
          <div className="flex justify-between items-center ">
            <PostReactions post={post} />
            <div className="flex gap-1 items-center text-muted-foreground text-sm">
              {getCommentText(post.commentsCount ?? 0, locale)}
            </div>
          </div>
          <div className="flex justify-evenly items-center my-2">
            <ReactionComponent post={post} />
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              className="flex gap-2 h-7 justify-center items-center py-1 w-full text-sm rounded transition-all hover:bg-muted"
            >
              <FaRegComment /> {text("comment")}
            </button>
          </div>
          {post.lastComment && (
            <ul>
              <CommentCard
                comment={post.lastComment}
                setComments={() => {}}
                isLast={true}
                isChild={false}
              />
            </ul>
          )}
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
      <div className="w-full rounded-md animate-pulse bg-background-2">
        <div className="flex gap-2 items-center px-4 pt-4 my-2 sm:my-4">
          <div className="w-12 h-12 rounded-full animate-pulse bg-muted-foreground"></div>
          <div className="flex flex-col gap-2">
            <div className="w-12 h-2 rounded-xl animate-pulse bg-muted-foreground" />
            <div className="w-16 h-1 rounded-xl animate-pulse bg-muted-foreground" />
          </div>
        </div>
        <div className="px-5 my-2 sm:my-4">
          <div className="mb-2 w-full h-2 rounded-xl animate-pulse bg-muted-foreground" />
          <div className="w-1/2 h-2 rounded-xl animate-pulse bg-muted-foreground" />
        </div>
        <div className="w-full animate-pulse aspect-video bg-muted-foreground" />
        <div className="flex gap-4 justify-center items-center p-2 m-2 border-t">
          <button className="py-1 w-full h-8 rounded-md animate-pulse bg-muted-foreground"></button>
          <button className="py-1 w-full h-8 rounded-md animate-pulse bg-muted-foreground"></button>
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
              className="flex gap-2 w-full"
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
