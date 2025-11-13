"use client";
import { useLocale, useTranslations } from "next-intl";
import UserAvatar from "../UserAvatar";
import { IComment } from "@/types";
import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import TextWithEmojiBox from "../TextWithEmojiBox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { axiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { useAuth } from "../auth-provider";
import { Skeleton } from "../ui/skeleton";

interface CommentCardProps {
  comment: IComment;
  isLast?: boolean;
  isChild?: boolean;
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
}
const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  isChild,
  isLast,
  setComments,
}) => {
  const locale = useLocale();
  const isEn = locale === "en";
  const text = useTranslations("post");
  const [replies, setReplies] = useState<IComment[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const [isRepliesFetched, setIsRepliesFetched] = useState(false);
  const [isFetchingReplies, setIsFetchingReplies] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const getReplies = async () => {
    if (!isRepliesFetched) {
      setIsRepliesFetched(true);
      setIsFetchingReplies(true);
      try {
        const res = await axiosInstance.get(`comments/replies/${comment._id}`);
        setReplies(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsFetchingReplies(false);
      }
    }
  };
  if (isEditing) {
    return (
      <li className="relative mt-2">
        <CommentAction
          parentComment={comment}
          type="edit"
          setComments={setComments}
          isChild={isChild}
          setIsEditing={setIsEditing}
        />
      </li>
    );
  }
  return (
    <li className="relative mt-2">
      <div className="flex items-start gap-2 z-[2] relative">
        <div className="relative">
          <UserAvatar className="relative z-[4]" user={comment.user} />
          {isChild && (
            <div
              style={
                isEn
                  ? {
                      left: "-21px",
                      zIndex: "3",
                    }
                  : { right: "-19px", zIndex: "3" }
              }
              className="border-muted border-b-[2px] border-s-[2px]   h-[20px] w-[21px] absolute aspect-square top-0 "
            />
          )}
        </div>
        <div className="p-2 w-full rounded-md bg-muted">
          <h3 className="font-semibold !text-xs">{comment.user?.name}</h3>
          <p className="text-sm my-0.5">
            {formatContentWithLinks(comment.content)}
          </p>
          {comment.image && (
            <Image
              src={comment.image}
              alt="comment"
              width={400}
              height={400}
              className="mt-2 mb-0.5 max-h-64 rounded-md"
            />
          )}
        </div>
      </div>
      <div className="flex gap-4 items-center mt-1 text-xs text-muted-foreground ms-14">
        <button
          onClick={() => {
            setIsReplying((prev) => !prev);
          }}
          className=""
        >
          {text("reply")}
        </button>
        <button
          onClick={() => {
            getReplies();
          }}
          className=""
        >
          {text("showReplies")}
        </button>
        {user?._id === comment.user?._id && (
          <button
            onClick={() => {
              setIsEditing((prev) => !prev);
            }}
            className=""
          >
            {text("edit")}
          </button>
        )}

        {(user?.role === "admin" || user?._id === comment.user?._id) && (
          <button
            onClick={() => {
              setIsDeleting(true);
            }}
            className=""
          >
            {text("delete")}
          </button>
        )}
      </div>
      {replies.length !== 0 && (
        <div className="absolute flex justify-end h-full px-[20px] top-0 z-[1]">
          <div className="w-0.5 bg-muted h-full -translate-x-1/2"></div>
        </div>
      )}
      {isChild && isLast && (
        <div
          style={
            isEn
              ? {
                  left: "-40px",
                  height: "calc(100% - 20px)",
                }
              : { right: "-40px", height: "calc(100% - 20px)" }
          }
          className="absolute flex justify-end  px-[20px] bottom-0 z-[2]"
        >
          <div className="w-0.5 bg-background h-full -translate-x-1/2"></div>
        </div>
      )}
      {isFetchingReplies && (
        <ul className="ps-10 mt-2 mb-3">
          {[1, 2].map((index) => (
            <CommentSkeleton key={index} isChild={true} />
          ))}
        </ul>
      )}
      {isRepliesFetched && replies.length === 0 && !isFetchingReplies && (
        <p
          className="mt-2 mb-3 text-center"
          onClick={(e) => {
            (e.target as HTMLElement).classList.add("hidden");
          }}
        >
          {text("noReplies")}
        </p>
      )}
      {replies?.length !== 0 && (
        <ul className="ps-10">
          {replies?.map((item, index) => (
            <CommentCard
              key={index}
              comment={item}
              isLast={index === replies?.length - 1}
              isChild={true}
              setComments={setReplies}
            />
          ))}
        </ul>
      )}
      {isReplying && (
        <CommentAction
          parentComment={comment}
          setReplies={setReplies}
          setIsReplying={setIsReplying}
          type="reply"
        />
      )}
      {isDeleting && (
        <DeleteComment
          comment={comment}
          setComments={setComments}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          isChild={isChild}
        />
      )}
    </li>
  );
};

const CommentAction: React.FC<{
  setReplies?: React.Dispatch<React.SetStateAction<IComment[]>>;
  parentComment: IComment;
  setIsReplying?: React.Dispatch<React.SetStateAction<boolean>>;
  type: "reply" | "edit";
  setComments?: React.Dispatch<React.SetStateAction<IComment[]>>;
  isChild?: boolean;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setReplies,
  parentComment,
  setIsReplying,
  type,
  setComments,
  isChild,
  setIsEditing,
}) => {
  const text = useTranslations("post");
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const [comment, setComment] = useState(
    type === "edit" ? parentComment.content : ""
  );
  const inputRef = useRef(null);
  const { user, token } = useAuth();

  const handleSend = async () => {
    if (!user?.authToReview) {
      toast.error(text("youShouldBuyCourseOrServiceToDoThisAction"));
      return;
    }
    setIsLoading(true);

    try {
      if (type === "reply") {
        const newReply: IComment = {
          _id: Date.now().toString(),
          content: comment,
          user: user,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          repiles: [],
          image: media ? URL.createObjectURL(media) : "",
          post: parentComment.post,
        };
        if (setReplies) setReplies((prev) => [...prev, newReply]); // Optimistic update
        const res = await axiosInstance.put(
          `comments/replyToComment/${parentComment._id}`,
          {
            content: comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (setReplies)
          setReplies((prev) =>
            prev.map((item) =>
              item._id === newReply._id ? res.data.data : item
            )
          );
        if (setIsReplying) setIsReplying(false);
      } else if (type === "edit") {
        const res = await axiosInstance.put(
          `comments${isChild ? "/editReplyComment" : ""}/${parentComment._id}`,
          {
            content: comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (setComments) {
          setComments((prev) =>
            prev.map((item) =>
              item._id === parentComment._id ? res.data.data : item
            )
          );
        }
        if (setIsEditing) setIsEditing(false);
      }
      setComment("");
      setMedia(null);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("", { "ms-14": type === "reply", "ms-2": type === "edit" })}
    >
      <TextWithEmojiBox
        handleSend={handleSend}
        inputRef={inputRef}
        isLoading={isLoading}
        media={media}
        setMedia={setMedia}
        setText={setComment}
        text={comment}
        placeholder={text("writeComment")}
        className="px-0 border-none"
      />
    </div>
  );
};

const DeleteComment: React.FC<{
  comment: IComment;
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
  isChild?: boolean;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ comment, setComments, isDeleting, setIsDeleting, isChild }) => {
  const text = useTranslations("post");
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuth();

  const handleDelete = async () => {
    if (!user?.authToReview) {
      toast.error(text("youShouldBuyCourseOrServiceToDoThisAction"));
      return;
    }
    setIsLoading(true);

    const tempCommentId = comment._id;

    setComments((prev) => prev.filter((item) => item._id !== tempCommentId)); // Optimistic update

    try {
      await axiosInstance.delete(
        `comments${isChild ? "/deleteReplyComment" : ""}/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
      setComments((prev) => [...prev, comment]); // Revert if delete fails
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isDeleting} onOpenChange={(open) => setIsDeleting(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{text("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {text("youWillNotBeAbleToRevert")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={() => setIsDeleting(false)}
            variant={"outline"}
            disabled={isLoading}
          >
            {text("cancel")}
          </Button>
          <Button disabled={isLoading} onClick={handleDelete}>
            {text("delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Utility function to detect and format links
const formatContentWithLinks = (content: string) => {
  // Split content by newlines first
  const lines = content.split("\n");

  return lines.map((line, lineIndex) => {
    // Split each line by spaces to get words
    const words = line.split(" ");

    const formattedWords = words.map((word, wordIndex) => {
      // Check if word is a URL (starts with http://, https://, or www.)
      const urlRegex = /^(https?:\/\/|www\.)/i;
      const isUrl = urlRegex.test(word);

      if (isUrl) {
        // Ensure URL has protocol
        const url = word.startsWith("www.") ? `https://${word}` : word;
        return (
          <a
            key={`${lineIndex}-${wordIndex}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {word}
          </a>
        );
      }

      return <span key={`${lineIndex}-${wordIndex}`}>{word}</span>;
    });

    return (
      <span key={lineIndex}>
        {formattedWords.map((word, index) => (
          <span key={index}>
            {word}
            {index < formattedWords.length - 1 && " "}
          </span>
        ))}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

const CommentSkeleton: React.FC<{ isChild?: boolean }> = () => {
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

export default CommentCard;
