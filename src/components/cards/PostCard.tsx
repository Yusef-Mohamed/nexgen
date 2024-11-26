"use client";
import { IPost } from "@/types";
import UserAvatar from "../UserAvatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaRegComment } from "react-icons/fa6";
import { AiOutlineLike } from "react-icons/ai";
import { useState } from "react";
import FocusedPostCard from "./FocusedPostCard";
interface PostCardProps {
  post: IPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const text = useTranslations("post");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full p-3 rounded-md cardShadow sm:p-6 bg-background">
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
        <div
          onClick={() => {
            setIsOpen(true);
          }}
          className={cn(`grid grid-cols-1 gap-0.5`, {
            "grid-cols-2": post.images.length === 1,
          })}
        >
          <Image
            width={600}
            height={600}
            src={post.imageCover}
            alt=""
            className="object-cover w-full aspect-video"
          />
          {post.images.length === 1 && (
            <Image
              width={600}
              height={600}
              src={post.images[0]}
              alt=""
              className="object-cover w-full aspect-video"
            />
          )}
          {post.images.length > 1 && (
            <div className="grid grid-cols-2 gap-0.5 w-full">
              <Image
                width={600}
                height={600}
                src={post.images[0]}
                alt=""
                className="object-cover w-full aspect-video"
              />
              <div className="relative w-full">
                <Image
                  width={100}
                  height={100}
                  src={post.images[1]}
                  alt=""
                  className="object-cover w-full aspect-video"
                />
                <div className="flex items-center justify-center bg-background opacity-25 z-[1] w-full h-full absolute top-0 right-0" />
                <div className="flex items-center justify-center z-[2] w-full h-full absolute top-0 right-0">
                  <span className="text-4xl font-bold">
                    +{post.images.length - 1}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center mt-2 justify-evenly sm:mt-4">
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-2 py-1 text-lg transition-all rounded-md sm:px-4 sm:py-2 max-sm:text-sm hover:bg-muted"
          >
            <AiOutlineLike /> {text("like")} ({post.reactionsCount})
          </button>
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-2 py-1 text-lg transition-all rounded-md sm:px-4 sm:py-2 max-sm:text-sm hover:bg-muted"
          >
            <FaRegComment /> {text("comment")} ({post.commentsCount})
          </button>
        </div>
      </div>
      <FocusedPostCard post={post} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
export const SkeletonPostCard = () => {
  return (
    <>
      <div className="w-full rounded-md bg-background animate-pulse">
        <div className="flex items-center gap-2 px-4 pt-4 my-2 sm:my-4">
          <div className="w-12 h-12 rounded-full bg-muted-foreground animate-pulse"></div>
          <div className="flex flex-col gap-2">
            <div className="w-12 h-2 rounded-xl bg-muted-foreground animate-pulse" />
            <div className="w-16 h-1 rounded-xl bg-muted-foreground animate-pulse" />
          </div>
        </div>
        <div className="px-5 my-2 sm:my-4">
          <div className="w-full h-2 mb-2 rounded-xl bg-muted-foreground animate-pulse" />
          <div className="w-1/2 h-2 rounded-xl bg-muted-foreground animate-pulse" />
        </div>
        <div className="w-full aspect-video bg-muted-foreground animate-pulse" />
        <div className="flex items-center justify-center gap-4 p-2 m-2 border-t">
          <button className="w-full h-8 py-1 rounded-md bg-muted-foreground animate-pulse"></button>
          <button className="w-full h-8 py-1 rounded-md bg-muted-foreground animate-pulse"></button>
        </div>
      </div>
    </>
  );
};

export default PostCard;
