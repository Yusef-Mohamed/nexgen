import { IPost } from "@/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
    post.loggedUserReaction?.type || null
  );
  const { user, token } = useAuth();

  const addReactToPost = async (type: keyof typeof emojis) => {
    if (!user?.authToReview) {
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
        }
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
    <div className="relative w-full group/unit">
      <div className="absolute items-center justify-center gap-2 py-1 px-2 translate-x-1/2 border rounded-full bg-background bottom-full right-1/2 flex opacity-0 scale-90 group-hover/unit:opacity-100 group-hover/unit:scale-100 transition-all w-fit">
        {Object.entries(emojis).map(([key, value]) => (
          <button
            className="relative size-8 hover:scale-[1.4] group transition-transform"
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
            <span className="absolute hidden py-0.5 px-1.5 text-2xs font-semibold scale-90 translate-x-1/2 rounded bg-background -top-1 -translate-y-full right-1/2 group-hover:block">
              {text(key)}
            </span>
            <Image
              width={64}
              height={64}
              src={`/reactions/${value}.png`}
              className="size-8"
              alt={value}
            />
          </button>
        ))}
      </div>
      <button
        className={cn(
          "flex hover:bg-muted transition-all h-7 w-full items-center justify-center gap-2 text-sm py-1 rounded"
        )}
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
