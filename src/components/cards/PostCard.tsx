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
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "../auth-provider";
import { axiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const allImages = [post.imageCover, ...post.images].filter(Boolean);

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
        <PostAction post={post} />
        <div className="p-5 pb-3">
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
                  <h4 className="text-sm font-bold text-text-1">
                    {post.user.name}
                  </h4>
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
                <h4 className="text-sm font-bold text-text-1">
                  {post.user.name}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <p className="mt-4 text-sm leading-6 text-text-2">
            {post.content.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index !== post.content.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
        <PostMediaGrid
          images={allImages}
          onOpen={() => {
            setIsOpen(true);
          }}
        />
        <div className="p-5 pt-4">
          <div className="flex items-center justify-between">
            <PostReactions post={post} />
            <div className="flex gap-1 items-center text-muted-foreground text-sm">
              {getCommentText(post.commentsCount ?? 0, locale)}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 border-t border-primary/10 pt-3">
            <ReactionComponent post={post} />
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-1 text-sm font-semibold text-text-3 transition-all hover:bg-primary/10 hover:text-primary"
              type="button"
            >
              <FaRegComment /> {text("comment")}
            </button>
          </div>
          {post.lastComment && (
            <ul className="mt-4 border-t border-primary/10 pt-4">
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

const PostMediaGrid: React.FC<{
  images: string[];
  onOpen: () => void;
}> = ({ images, onOpen }) => {
  if (images.length === 0) return null;

  const visibleImages = images.slice(0, 4);

  if (images.length === 1) {
    return (
      <button
        className="mx-5 block w-[calc(100%-2.5rem)] cursor-pointer overflow-hidden rounded-2xl border border-primary/10 bg-background-2"
        onClick={onOpen}
        type="button"
      >
        <Image
          width={960}
          height={540}
          src={images[0]}
          alt=""
          className="max-h-[32rem] w-full object-cover"
        />
      </button>
    );
  }

  return (
    <button
      className={cn(
        "mx-5 grid w-[calc(100%-2.5rem)] cursor-pointer overflow-hidden rounded-2xl border border-primary/10 bg-background-2",
        images.length === 2
          ? "grid-cols-2 gap-1"
          : "grid-cols-2 grid-rows-2 gap-1",
      )}
      onClick={onOpen}
      type="button"
    >
      {visibleImages.map((image, index) => {
        const isPrimary = images.length >= 3 && index === 0;
        const hiddenCount = images.length - visibleImages.length;
        const showOverlay =
          hiddenCount > 0 && index === visibleImages.length - 1;

        return (
          <span
            className={cn("relative block overflow-hidden bg-muted", {
              "row-span-2": isPrimary,
            })}
            key={`${image}-${index}`}
          >
            <Image
              width={720}
              height={720}
              src={image}
              alt=""
              className={cn(
                "h-full min-h-44 w-full object-cover transition-transform duration-500 hover:scale-105",
                isPrimary ? "max-h-[29rem]" : "max-h-56",
              )}
            />
            {showOverlay && (
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/50 text-3xl font-bold text-primary-foreground">
                +{hiddenCount}
              </span>
            )}
          </span>
        );
      })}
    </button>
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
            aria-label={text("delete")}
            className="absolute end-4 top-4 z-10 size-10 rounded-full border-primary/10 bg-clear-ground/90 p-0 text-text-3 shadow-sm backdrop-blur-sm transition-all hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            <BsThreeDots className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="w-52 rounded-2xl border-primary/10 bg-clear-ground p-2 shadow-xl shadow-text-1/10"
        >
          <DropdownMenuItem
            onClick={() => {
              setIsDeleting(true);
            }}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-destructive transition-colors focus:bg-destructive/10 focus:text-destructive"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AiFillDelete size={17} />
            </span>
            <span>{text("delete")}</span>
          </DropdownMenuItem>
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
