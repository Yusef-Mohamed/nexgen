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
import { createClientAxiosInstance } from "@/app/lib/utils";
import { Link } from "@/i18n/routing";
import { useAuth } from "../auth-provider";
import { MdClose } from "react-icons/md";
import { Button } from "../ui/button";
import ReactionComponent from "../ReactionComponent";
import { getCommentText } from "@/lib/utils";
import { emojis } from "@/constants";

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
  const { token, user } = useAuth();

  useEffect(() => {
    const axiosInstance = createClientAxiosInstance();
    if (isOpen && post) {
      axiosInstance
        .get(`comments/post/${post?._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setComments(res.data.data);
        });
    }
  }, [isOpen, post]);

  // create & update comment
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const inputRef = useRef(null);

  const handleCommentSubmit = async () => {
    if (!user?.authToReview) {
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

    const axiosInstance = createClientAxiosInstance();
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
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          setIsOpen(value);
        }}
      >
        <DialogContent className="sm:max-w-2xl flex flex-col max-h-[95%] overflow-hidden bg-clear-ground p-0 gap-0">
          <DialogHeader className="sticky top-0 z-10 flex flex-row items-center justify-between p-4 space-y-0 text-center border-b bg-clear-ground">
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
          <div className="flex-grow w-full overflow-auto rounded-md">
            <div className="p-3 sm:p-6">
              {inCommunity ? (
                <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                  <Link href={`/dashboard/community/profile/${post.user?._id}`}>
                    <UserAvatar user={post.user} />
                  </Link>
                  <div className="flex flex-col">
                    <Link
                      href={`/dashboard/community/profile/${post.user?._id}`}
                    >
                      <h4>{post.user?.name}</h4>
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
                    <h4>{post.user?.name}</h4>
                    <span className="text-sm max-sm:text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
              <p className="my-2 sm:my-4 max-sm:text-sm">{post.content}</p>
            </div>
            <div className={"relative"}>
              {allImages.length > 1 && (
                <div
                  className="absolute right-0 flex justify-between w-full px-4 -translate-y-1/2 top-1/2 "
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
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-fade text-clearbg-clear-ground"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage((prev) =>
                        prev === allImages.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-fade text-clearbg-clear-ground"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center bg-muted">
                <ImageWithZoom
                  width={600}
                  height={600}
                  src={allImages[selectedImage]}
                  alt=""
                  className="w-full max-h-[50vh] aspect-square  object-contain"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center px-4">
                {post.reactionTypes && post.reactionTypes.length > 0 && (
                  <>
                    {post.reactionTypes.map((reaction) => (
                      <span key={reaction}>{emojis[reaction]}</span>
                    ))}
                    <span className="px-2">{post.reactionsCount}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm">
                {getCommentText(post.commentsCount ?? 0, locale)}
              </div>
            </div>
            <div className="flex items-center px-4 py-2 mt-2 border-y justify-evenly sm:mt-4 ">
              <ReactionComponent post={post} />
              <button
                onClick={() => {
                  setIsOpen(true);
                }}
                className="flex items-center justify-center w-full gap-2 py-1 text-lg transition-all rounded-md hover:bg-muted"
              >
                <FaRegComment /> {text("comment")}
              </button>
            </div>
            <ul className="px-6 pt-4 mb-8">
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
            </ul>
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

export default FocusedPostCard;
