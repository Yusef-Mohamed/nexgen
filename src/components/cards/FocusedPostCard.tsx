import { IComment, IPost, IReact, IUser } from "@/types";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import UserAvatar from "../UserAvatar";
import { emojis } from "@/constants";
import { FaChevronLeft, FaChevronRight, FaRegComment } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import CommentCard from "./CommentCard";
import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next";
import TextWithEmojiBox from "../TextWithEmojiBox";
import { toast } from "react-toastify";
import ImageWithZoom from "../ImageWithZoom";
import { createClientAxiosInstance, getClientCookie } from "@/app/lib/utils";
interface FocusedPostCardProps {
  post: IPost;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}
const FocusedPostCard: React.FC<FocusedPostCardProps> = ({
  post,
  isOpen,
  setIsOpen,
}) => {
  const text = useTranslations("post");
  const [selectedImage, setSelectedImage] = useState(0);
  const allImages = [post.imageCover, ...post.images];
  const [comments, setComments] = useState<IComment[]>([]);
  const [reacts, setReacts] = useState<IReact[]>([]);
  const token = getCookie("token");
  const user = getClientCookie("user", true) as IUser;
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
      axiosInstance
        .get(`reacts/post/${post?._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setReacts(res.data.data);
        });
    }
  }, [isOpen, post]);
  // create & update comment
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const inputRef = useRef(null);
  const handleCommentSubmit = async () => {
    if (!user.authToReview) {
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
  // create react
  const [isReacting, setIsReacting] = useState(false);
  const myReact: IReact | undefined = useMemo(() => {
    return reacts.find((react) => react?.user?._id === user?._id);
  }, [reacts]);
  const addReactToPost = async (type: keyof typeof emojis) => {
    if (!user.authToReview) {
      toast.error(text("youShouldBuyCourseOrServiceToDoThisAction"));
      return;
    }
    setIsReacting(true);
    const axiosInstance = createClientAxiosInstance();
    let actionType = "create";
    let thisReact = myReact;
    if (thisReact) {
      if (thisReact.type === type) {
        actionType = "delete";
      } else {
        actionType = "update";
      }
    }
    if (actionType === "create") {
      thisReact = {
        _id: Date.now().toString(), // Temporary ID for optimistic update
        type,
        user,
        post: post._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    if (thisReact && actionType === "delete") {
      setReacts((prev) =>
        prev.filter((react) => react?._id !== thisReact?._id)
      );
    }
    if (thisReact && actionType === "update") {
      setReacts((prev) =>
        prev.map((react) =>
          react?._id === thisReact?._id ? { ...react, type } : react
        )
      );
    }
    if (thisReact && actionType === "create") {
      setReacts((prev) => [...prev, thisReact]);
    }
    try {
      await axiosInstance.post(
        `reacts/post/${post?._id}`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      if (actionType === "create") {
        setReacts((prev) =>
          prev.filter((react) => react?._id !== thisReact?._id)
        );
      }
      if (actionType === "update") {
        setReacts((prev) =>
          prev.map((react) =>
            react?._id === thisReact?._id ? thisReact : react
          )
        );
      }
      if (actionType === "delete" && thisReact) {
        setReacts((prev) => [...prev, thisReact]);
      }
    }
    setIsReacting(false);
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          setIsOpen(value);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-hidden bg-clear-ground p-0 gap-0">
          <DialogHeader className="sticky top-0 z-10 p-4 text-center border-b bg-clear-ground">
            <DialogTitle className="text-center">
              {text("userPost", {
                name: post.user.name,
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full rounded-md max-h-[80vh] overflow-auto">
            <div className="p-3 sm:p-6">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                <UserAvatar size="lg" user={post.user} />
                <div className="flex flex-col">
                  <h3>{post.user.name}</h3>
                  <span className="max-sm:text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
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
            <div className="flex items-center mt-2 justify-evenly sm:mt-4">
              <div className="relative w-full group/unit">
                <div className="absolute items-center justify-center hidden gap-4 px-4 py-1 translate-x-1/2 border rounded-md bg-muted bottom-full right-1/2 group-hover/unit:flex">
                  {Object.entries(emojis).map(([key, value]) => (
                    <button
                      className="relative text-lg hover:scale-125 group"
                      key={key}
                      disabled={isReacting}
                      onClick={
                        isReacting
                          ? () => {}
                          : () => {
                              addReactToPost(key as keyof typeof emojis);
                            }
                      }
                    >
                      <span className="absolute hidden p-2 text-xs font-semibold scale-90 translate-x-1/2 rounded-md bg-muted -top-12 right-1/2 group-hover:block">
                        {text(key)}
                      </span>
                      {value}
                    </button>
                  ))}
                </div>
                <button
                  className={cn(
                    "flex hover:bg-muted transition-all w-full items-center justify-center gap-2 text-lg py-1 rounded-md",
                    {
                      "bg-muted": myReact,
                    }
                  )}
                >
                  {emojis[myReact?.type ? myReact?.type : "like"]}
                  {text(myReact?.type ? myReact?.type : "like")} (
                  {reacts.length})
                </button>
              </div>
              <button className="flex items-center justify-center w-full gap-2 py-1 text-lg transition-all rounded-md hover:bg-muted">
                <FaRegComment /> {text("comment")} ({comments.length})
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
