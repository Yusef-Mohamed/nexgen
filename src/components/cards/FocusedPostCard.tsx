import { IComment, IPost } from "@/types";
import { SetStateAction, useEffect, useRef, useState } from "react";
import UserAvatar from "../UserAvatar";
import { FaChevronLeft, FaChevronRight, FaRegComment } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import CommentCard from "./CommentCard";
import TextWithEmojiBox from "../TextWithEmojiBox";
import { toast } from "react-toastify";
import ImageWithZoom from "../ImageWithZoom";
import { axiosInstance } from "@/app/lib/utils";
import { Link, usePathname } from "@/i18n/routing";
import { useAuth } from "../auth-provider";
import { MdClose } from "react-icons/md";
import { Button } from "../ui/button";
import ReactionComponent from "../ReactionComponent";
import { getCommentText } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import PostReactions from "./PostReactions";

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
  inCommunity,
}) => {
  const text = useTranslations("post");
  const [selectedImage, setSelectedImage] = useState(0);
  const allImages = [post.imageCover, ...post.images];
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

  // create & update comment
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const inputRef = useRef(null);

  const handleCommentSubmit = async () => {
    if (!user?.authToReview && !user?.isInstructor) {
      toast.error(text("youShouldBuyCourseOrServiceToDoThisAction"));
      return;
    }
    setIsLoading(true);
    const newComment: IComment = {
      _id: Date.now().toString(), // Temporary ID for optimistic update
      content: commentText,
      user: user,
      createdAt: new Date().toISOString(),
      post: post._id,
      image: media ? URL.createObjectURL(media) : "",
      repiles: [],
      updatedAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]); // Optimistically update comments

    try {
      const formData = new FormData();

      formData.append("content", commentText);
      if (media) formData.append("image", media);
      const res = await axiosInstance.post(
        `comments/post/${post?._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === newComment._id ? res.data.data : comment
        )
      );
      setCommentText("");
      setMedia(null);
      toast.success(text("commentHasBeenAdded"));
    } catch (error) {
      console.log(error);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== newComment._id)
      ); // Revert if failed
      toast.error(text("commentFailed"));
    } finally {
      setIsLoading(false);
    }
  };
  const locale = useLocale();
  const pathname = usePathname();
  const isInstructorDashboard = pathname.includes("instructor-dashboard");
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          setIsOpen(value);
        }}
      >
        <DialogContent className="sm:max-w-2xl flex flex-col max-h-[95%] overflow-hidden bg-clear-ground p-0 gap-0">
          <DialogHeader className="flex sticky top-0 z-10 px-4 flex-row justify-between items-center p-2 space-y-0 text-center border-b bg-clear-ground">
            <DialogTitle>
              {text("userPost", {
                name: post.user?.name,
              })}
            </DialogTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              className="text-xl"
              size="icon"
            >
              <MdClose />
            </Button>
          </DialogHeader>
          <div className="overflow-auto flex-grow w-full rounded-md">
            <div className="p-3">
              {inCommunity ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={`${
                      isInstructorDashboard
                        ? "/instructor-dashboard"
                        : "/dashboard"
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
            <div className={"relative"}>
              {allImages.length > 1 && (
                <div
                  className="flex absolute right-0 top-1/2 justify-between px-4 w-full -translate-y-1/2"
                  style={{
                    direction: "ltr",
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedImage((prev) =>
                        prev === 0 ? allImages.length - 1 : prev - 1
                      );
                    }}
                    className="flex justify-center items-center w-8 h-8 rounded-full bg-fade text-clearbg-clear-ground"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage((prev) =>
                        prev === allImages.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="flex justify-center items-center w-8 h-8 rounded-full bg-fade text-clearbg-clear-ground"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}

              <div className="flex justify-center items-center bg-muted">
                <ImageWithZoom
                  width={600}
                  height={600}
                  src={allImages[selectedImage]}
                  alt=""
                  className="w-full max-h-[50vh] aspect-square  object-contain"
                />
              </div>
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
              <ul className="px-2 pt-1">
                {isLoadingComments ? (
                  <>
                    {[1, 2, 3].map((index) => (
                      <CommentSkeleton key={index} />
                    ))}
                  </>
                ) : (
                  <>
                    {comments.map((comment, index) => (
                      <CommentCard
                        key={index}
                        comment={comment}
                        isLast={index === comments.length - 1}
                        isChild={false}
                        setComments={setComments}
                      />
                    ))}
                    {comments?.length === 0 && (
                      <li>
                        <p className="text-center text-muted-foreground">
                          {text("noComments")}
                        </p>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>

          <TextWithEmojiBox
            text={commentText}
            setText={setCommentText}
            isLoading={isLoading}
            media={media}
            setMedia={setMedia}
            inputRef={inputRef}
            handleSend={handleCommentSubmit}
            className="sticky bottom-0 z-10 p-4 border-t bg-clear-ground"
            placeholder={text("writeComment")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const CommentSkeleton = () => {
  return (
    <li className="relative mt-2">
      <div className="flex items-start gap-2 z-[2] relative">
        <div className="relative">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <div className="p-2 w-full rounded-md bg-muted">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="flex gap-4 items-center mt-1 text-xs ms-14">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-16" />
      </div>
    </li>
  );
};

export default FocusedPostCard;
