"use client";
import { IPost } from "@/types";
import Image from "next/image";
import { useLocale } from "next-intl";
import { emojis } from "@/constants";
import { cn, getReactionText } from "@/lib/utils";

interface PostReactionsProps {
  post: IPost;
}

const PostReactions: React.FC<PostReactionsProps> = ({ post }) => {
  const locale = useLocale();

  if (
    !post.reactionTypes ||
    typeof post.reactionTypes !== "object" ||
    Array.isArray(post.reactionTypes) ||
    Object.keys(post.reactionTypes).length === 0
  ) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {Object.entries(post.reactionTypes as unknown as Record<string, number>)
        .sort(([, a], [, b]) => b - a)
        .map(([reactionType], index) => (
          <Image
            key={reactionType}
            width={20}
            height={20}
            src={`/reactions/${
              emojis[reactionType as keyof typeof emojis]
            }.png`}
            alt={reactionType}
            className={cn("size-5 bg-background rounded-full", {
              "-ms-2": index !== 0,
            })}
          />
        ))}
      <span className="px-1 text-sm text-muted-foreground">
        {getReactionText(
          post.reactionsCount,
          !!post.loggedUserReaction,
          locale
        )}
      </span>
    </div>
  );
};

export default PostReactions;
