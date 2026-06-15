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
    return (
      <div className="inline-flex min-h-8 items-center rounded-full border border-primary/10 bg-background-2 px-3 text-xs font-semibold text-text-3">
        {getReactionText(post.reactionsCount, false, locale)}
      </div>
    );
  }

  return (
    <div className="inline-flex min-h-8 items-center gap-2 rounded-full border border-primary/10 bg-background-2 px-3 py-1">
      <span className="flex items-center">
        {Object.entries(post.reactionTypes as unknown as Record<string, number>)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([reactionType], index) => (
            <Image
              key={reactionType}
              width={24}
              height={24}
              src={`/reactions/${
                emojis[reactionType as keyof typeof emojis]
              }.png`}
              alt={reactionType}
              className={cn(
                "size-6 rounded-full border border-clear-ground bg-background",
                {
                  "-ms-2": index !== 0,
                },
              )}
            />
          ))}
      </span>
      <span className="text-xs font-semibold text-text-3">
        {getReactionText(
          post.reactionsCount,
          !!post.loggedUserReaction,
          locale,
        )}
      </span>
    </div>
  );
};

export default PostReactions;
