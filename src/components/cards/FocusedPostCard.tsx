import { safetyError } from "@/lib/safety-contract";
import { CommunityPublishingNotice, CommunitySafetyActions, useSafetyHidden } from "@/components/community-safety";
import { IComment, IPost } from "@/types";
import { SetStateAction, useEffect, useRef, useState } from "react";
import UserAvatar from "../UserAvatar";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CommentCard from "./CommentCard";
import TextWithEmojiBox from "../TextWithEmojiBox";
import { toast } from "react-toastify";
import ImageWithZoom from "../ImageWithZoom";
import { axiosInstance } from "@/app/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "../auth-provider";
import { Button } from "../ui/button";
import ReactionComponent from "../ReactionComponent";
import { cn, getCommentText } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import PostReactions from "./PostReactions";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import Image from "next/image";

interface FocusedPostCardProps {
  post: IPost;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  inCommunity?: boolean;
}

const FocusedPostCard: React.FC<FocusedPostCardProps> = ({
  post,
  isOpen,
  setIsOpen,
}) => {
  const hidden = useSafetyHidden(post.user?._id);
  const text = useTranslations("post");
  const locale = useLocale();
  const pathname = usePathname();
  const isInstructorDashboard = pathname.includes("instructor-dashboard");
  const [selectedImage, setSelectedImage] = useState(0);
  const allImages = [undefined, "pending", "approved"].includes((post as typeof post & { moderationState?: string }).moderationState)
    ? [post.imageCover, ...post.images].filter(Boolean) : [];
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (isOpen && post) {
      setIsLoadingComments(true);
      axiosInstance
        .get(`comments/post/${post?._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setComments(res.data.data);
        })
        .finally(() => {
          setIsLoadingComments(false);
        });
    }
  }, [isOpen, post, token]);

  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleCommentSubmit = async () => {
    const currentUser = user;

    if (!currentUser?.authToReview && !currentUser?.isInstructor) {
      toast.error(text("youShouldBuyCourseOrServiceToDoThisAction"));
      return;
    }

    setIsLoading(true);
    const newComment: IComment = {
      _id: Date.now().toString(),
      content: commentText,
      user: currentUser,
      createdAt: new Date().toISOString(),
      post: post._id,
      image: media ? URL.createObjectURL(media) : "",
      repiles: [],
      updatedAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);

    try {
      const formData = new FormData();
      formData.append("content", commentText);
      if (media) formData.append("image", media);

      const res = await axiosInstance.post(
        `comments/post/${post?._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === newComment._id ? res.data.data : comment,
        ),
      );
      setCommentText("");
      setMedia(null);
      toast.success(text("commentHasBeenAdded"));
    } catch (error) {
      console.log(error);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== newComment._id),
      );
      toast.error(safetyError(error, locale));
    } finally {
      setIsLoading(false);
    }
  };

  const goToImage = (direction: "next" | "previous") => {
    setSelectedImage((prev) => {
      if (direction === "next") {
        return prev === allImages.length - 1 ? 0 : prev + 1;
      }

      return prev === 0 ? allImages.length - 1 : prev - 1;
    });
  };

  if (hidden) return null;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
      }}
    >
      <DialogContent className="flex max-h-[94vh] gap-0 overflow-hidden rounded-2xl border-primary/10 bg-clear-ground p-0 shadow-2xl sm:max-w-[1120px]">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {text("userPost", {
              name: post.user?.name,
            })}
          </DialogTitle>
          <DialogDescription>{post.content}</DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
          <section className="relative flex min-h-[22rem] flex-col bg-background-2 lg:min-h-[38rem]">
            <Button
              aria-label="Close"
              className="absolute end-4 top-4 z-20 rounded-full bg-clear-ground/90 shadow-sm backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              size="icon"
              type="button"
              variant="outline"
            >
              <X className="size-4" />
            </Button>

            <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 lg:p-6">
              {allImages.length > 1 && (
                <div className="pointer-events-none absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 justify-between">
                  <button
                    className="pointer-events-auto inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-primary/10 bg-clear-ground/90 text-text-2 shadow-sm backdrop-blur-sm transition-colors hover:text-primary"
                    onClick={() => goToImage("previous")}
                    type="button"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    className="pointer-events-auto inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-primary/10 bg-clear-ground/90 text-text-2 shadow-sm backdrop-blur-sm transition-colors hover:text-primary"
                    onClick={() => goToImage("next")}
                    type="button"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              )}

              <ImageWithZoom
                width={960}
                height={960}
                src={allImages[selectedImage]}
                alt=""
                className="max-h-[58vh] w-full rounded-2xl object-contain lg:max-h-[72vh]"
              />
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-primary/10 bg-clear-ground/80 p-3">
                {allImages.map((image, index) => (
                  <button
                    className={cn(
                      "relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border bg-background-2 transition-all",
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-primary/10 hover:border-primary/40",
                    )}
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    type="button"
                  >
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="64px"
                      src={image}
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="flex min-h-0 flex-col border-s border-primary/10">
            <CommunityPublishingNotice />
            <CommunitySafetyActions kind="post" targetId={post._id} authorId={post.user?._id} entity={post} />
            <div className="border-b border-primary/10 p-5">
              <PostAuthor
                isInstructorDashboard={isInstructorDashboard}
                post={post}
              />
              <p className="mt-4 text-sm leading-6 text-text-2">
                {post.content.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    {index !== post.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            <div className="border-b border-primary/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <PostReactions post={post} />
                <div className="inline-flex items-center gap-2 rounded-full bg-background-2 px-3 py-2 text-xs font-semibold text-text-3">
                  <MessageCircle className="size-4" />
                  {getCommentText(post.commentsCount ?? 0, locale)}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ReactionComponent post={post} />
                <button
                  className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-1 text-sm font-semibold text-text-3 transition-all hover:bg-primary/10 hover:text-primary"
                  onClick={() => inputRef.current?.focus()}
                  type="button"
                >
                  <MessageCircle className="size-4" />
                  {text("comment")}
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-5">
              {isLoadingComments ? (
                <ul className="flex flex-col gap-4">
                  {[1, 2, 3].map((index) => (
                    <CommentSkeleton key={index} />
                  ))}
                </ul>
              ) : (
                <ul className="flex flex-col gap-4">
                  {comments.map((comment, index) => (
                    <CommentCard
                      key={comment._id || index}
                      comment={comment}
                      isLast={index === comments.length - 1}
                      isChild={false}
                      setComments={setComments}
                    />
                  ))}
                  {comments?.length === 0 && (
                    <li className="rounded-2xl border border-primary/10 bg-background-2 p-6 text-center text-sm text-text-3">
                      {text("noComments")}
                    </li>
                  )}
                </ul>
              )}
            </div>

            <TextWithEmojiBox
              text={commentText}
              setText={setCommentText}
              isLoading={isLoading}
              media={media}
              setMedia={setMedia}
              inputRef={inputRef}
              handleSend={handleCommentSubmit}
              className="border-t border-primary/10 bg-clear-ground p-4"
              textClassName="min-h-14 rounded-2xl border-primary/10 bg-background-2 pb-9"
              placeholder={text("writeComment")}
            />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PostAuthor: React.FC<{
  isInstructorDashboard: boolean;
  post: IPost;
}> = ({ isInstructorDashboard, post }) => {
  const profileHref = `${
    isInstructorDashboard ? "/instructor-dashboard" : "/dashboard"
  }/community/profile/${post.user._id}`;

  const content = (
    <>
      <UserAvatar user={post.user} className="size-12" />
      <div className="min-w-0">
        <h4 className="truncate text-sm font-bold text-text-1">
          {post.user.name}
        </h4>
        <span className="text-xs text-text-3">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
    </>
  );

  return (
    <Link
      className="flex items-center gap-3 rounded-xl transition-colors hover:text-primary"
      href={profileHref}
    >
      {content}
    </Link>
  );
};

const CommentSkeleton = () => {
  return (
    <li className="relative">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="w-full rounded-2xl bg-background-2 p-3">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-1 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </li>
  );
};

export default FocusedPostCard;
