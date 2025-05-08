import { IPost } from "@/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { emojis } from "@/constants";
import { cn } from "@/lib/utils";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "../components/auth-provider";
import { toast } from "react-toastify";

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
    const axiosInstance = createClientAxiosInstance();
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
            "bg-muted": reaction,
          }
        )}
      >
        {emojis[reaction ? (reaction as keyof typeof emojis) : "like"]}
        {text(reaction ? reaction : "like")}
      </button>
    </div>
  );
};

export default ReactionComponent;
