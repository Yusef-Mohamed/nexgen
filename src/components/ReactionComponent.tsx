import { IPost } from "@/types";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { emojis } from "@/constants";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "../components/auth-provider";
import { toast } from "react-toastify";
import { AiOutlineLike } from "react-icons/ai";
import Image from "next/image";

interface ReactionComponentProps {
  post: IPost;
  onReactionUpdate?: (reactionType: string | null) => void;
}

const ReactionComponent: React.FC<ReactionComponentProps> = ({
  post,
  onReactionUpdate,
}) => {
  const text = useTranslations("post");
  const [isReacting, setIsReacting] = useState(false);
  const [reaction, setReaction] = useState<string | null>(
    post.loggedUserReaction?.type || null,
  );
  const [isFocused, setIsFocused] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, token } = useAuth();

  const openReactions = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsFocused(true);
  };

  const scheduleCloseReactions = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsFocused(false);
      closeTimerRef.current = null;
    }, 240);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const addReactToPost = async (type: keyof typeof emojis) => {
    if (!user?.authToReview && !user?.isInstructor) {
      toast.error(text("youShouldBuyCourseOrServiceToDoThisAction"));
      return;
    }
    setIsReacting(true);

    let actionType = "create";

    if (post.loggedUserReaction) {
      if (post.loggedUserReaction.type === type) {
        actionType = "delete";
      } else {
        actionType = "update";
      }
    }

    try {
      await axiosInstance.post(
        `reacts/post/${post._id}`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (onReactionUpdate) {
        if (actionType === "delete") {
          onReactionUpdate(null);
        } else {
          onReactionUpdate(type);
        }
      }

      if (actionType === "delete") {
        setReaction(null);
      } else {
        setReaction(type);
      }
    } catch (error) {
      console.log(error);
      toast.error(text("reactionFailed"));
    } finally {
      setIsReacting(false);
    }
  };

  return (
    <div
      className="relative w-full"
      onFocus={openReactions}
      onMouseEnter={openReactions}
      onMouseLeave={scheduleCloseReactions}
    >
      <div
        className={cn(
          "absolute bottom-full start-1/2 z-20 mb-2 flex w-fit -translate-x-1/2 translate-y-1 items-center justify-center gap-1 rounded-2xl border border-primary/10 bg-clear-ground px-2 py-2 opacity-0 ring-1 ring-primary/5 transition-all duration-200 rtl:translate-x-1/2",
          {
            "pointer-events-auto -translate-y-2 opacity-100": isFocused,
            "pointer-events-none": !isFocused,
          },
        )}
      >
        {Object.entries(emojis).map(([key, value]) => (
          <button
            className="group relative size-9 cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
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
            <span className="absolute -top-1 start-1/2 hidden -translate-x-1/2 -translate-y-full scale-90 rounded bg-background px-1.5 py-0.5 text-2xs font-semibold group-hover:block rtl:translate-x-1/2">
              {text(key)}
            </span>
            <Image
              width={64}
              height={64}
              src={`/reactions/${value}.png`}
              className="size-8 transition-transform group-hover:scale-125"
              alt={value}
            />
          </button>
        ))}
      </div>
      <button
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-1 text-sm font-semibold text-text-3 transition-all hover:bg-primary/10 hover:text-primary",
        )}
        type="button"
      >
        {reaction ? (
          <Image
            width={20}
            height={20}
            src={`/reactions/${
              emojis[reaction ? (reaction as keyof typeof emojis) : "like"]
            }.png`}
            alt={reaction ? reaction : "like"}
          />
        ) : (
          <AiOutlineLike />
        )}
        {text(reaction ? reaction : "like")}
      </button>
    </div>
  );
};

export default ReactionComponent;
