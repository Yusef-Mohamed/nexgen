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
  const profileHref = `${
    isInstructorDashboard ? "/instructor-dashboard" : "/dashboard"
  }/community/profile/${post.user._id}`;
  const allImages = [post.imageCover, ...post.images].filter(Boolean);
  const hasMedia = allImages.length > 0;

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground">
        <PostAction post={post} />
        <div className={cn("p-5", hasMedia ? "pb-4" : "pb-3")}>
          <div className="flex items-center gap-3 pe-12">
            <Link
              href={profileHref}
              className="shrink-0 rounded-full transition-transform hover:-translate-y-0.5"
              aria-label={post.user.name}
            >
              <UserAvatar user={post.user} />
            </Link>
            <div className="flex min-w-0 flex-col">
              <Link href={profileHref} className="group min-w-0">
                <h4 className="truncate text-sm font-bold text-text-1 transition-colors group-hover:text-primary">
                  {post.user.name}
                </h4>
              </Link>
              <span className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="mt-4 break-words text-[15px] leading-7 text-text-2">
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
        <div className={cn("px-5 pb-5", hasMedia ? "pt-4" : "pt-2")}>
          <div className="flex min-h-9 items-center justify-between gap-3">
            <PostReactions post={post} />
            <button
              className="inline-flex min-h-8 cursor-pointer items-center rounded-full border border-transparent px-3 text-sm font-semibold text-text-3 transition-colors hover:border-primary/10 hover:bg-primary/10 hover:text-primary"
              onClick={() => {
                setIsOpen(true);
              }}
              type="button"
            >
              {getCommentText(post.commentsCount ?? 0, locale)}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-y border-primary/10 py-2">
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
            <ul className="mt-3 rounded-xl border border-primary/10 bg-background-2/50 p-3">
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
  const hiddenCount = images.length - visibleImages.length;
  const isTwoUp = images.length === 2;
  const isHeroLayout = images.length === 3;

  if (images.length === 1) {
    return (
      <button
        aria-label="Open post media"
        className="mx-5 block max-h-[34rem] w-[calc(100%-2.5rem)] cursor-pointer overflow-hidden rounded-2xl border border-primary/10 bg-background-2"
        onClick={onOpen}
        type="button"
      >
        <Image
          width={960}
          height={540}
          src={images[0]}
          alt=""
          className="max-h-[34rem] w-full object-contain transition-transform duration-500 hover:scale-[1.01]"
        />
      </button>
    );
  }

  return (
    <button
      aria-label={`Open ${images.length} post photos`}
      className={cn(
        "mx-5 grid w-[calc(100%-2.5rem)] cursor-pointer overflow-hidden rounded-2xl border border-primary/10 bg-background-2",
        isTwoUp
          ? "aspect-[16/9] grid-cols-2 gap-1"
          : "aspect-[16/10] grid-cols-2 grid-rows-2 gap-1",
      )}
      onClick={onOpen}
      type="button"
    >
      {visibleImages.map((image, index) => {
        const isPrimary = isHeroLayout && index === 0;
        const showOverlay = hiddenCount > 0 && index === 3;

        return (
          <span
            className={cn(
              "relative block min-h-0 overflow-hidden bg-muted",
              isPrimary && "row-span-2",
            )}
            key={`${image}-${index}`}
          >
            <Image
              width={720}
              height={720}
              src={image}
              alt=""
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {showOverlay && (
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/55 text-3xl font-black text-primary-foreground backdrop-blur-[2px]">
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
            className="absolute end-4 top-4 z-10 size-9 rounded-full border-primary/10 bg-clear-ground/90 p-0 text-text-3 backdrop-blur-sm transition-all hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            <BsThreeDots className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-40 rounded-xl border-primary/10 bg-clear-ground p-1 shadow-none"
        >
          <DropdownMenuItem
            onClick={() => {
              setIsDeleting(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-destructive transition-colors focus:bg-destructive/10 focus:text-destructive"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AiFillDelete size={15} />
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
