import { IBlog } from "@/types";
import { useLocale } from "next-intl";
import Image from "next/image";
import React from "react";
import { GiSandsOfTime } from "react-icons/gi";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import UserAvatar from "../UserAvatar";
import { cn } from "@/lib/utils";
import { ShareButtons } from "./BlogsShareButtons";
const BlogCard: React.FC<IBlog & { inDashboard?: boolean }> = ({
  _id,
  title,
  imageCover,
  createdAt,
  readTime,
  author,
  inDashboard,
}) => {
  const locale = useLocale();
  if (!author) return null;
  return (
    <article className="flex flex-col w-full h-full ">
      <Link
        href={`${inDashboard ? "/dashboard/blogs" : "/blogs"}/${_id}`}
        className="w-full shadow-md rounded-2xl shadow-primary/20"
      >
        <Image
          src={imageCover}
          alt={title}
          width={430}
          height={240}
          className="object-cover w-full rounded-2xl aspect-[1.79]"
        />
      </Link>
      <div className="flex flex-col justify-between flex-grow px-3 mt-5 sm:px-4 sm:mt-6">
        <Link href={`/blogs/${_id}`} className="w-full">
          <h3 className="h5">{title}</h3>
        </Link>
        <div className="flex flex-row items-center justify-start w-full gap-4 mt-3 text-sm sm:text-base sm:gap-6 sm:mt-4 text-text-2">
          <div className="flex items-center gap-2 sm:gap-3 ">
            <GiSandsOfTime />
            <div>
              {readTime} {locale === "ar" ? " د" : " min"}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
            <CiCalendarDate />
            <div>
              {new Date(createdAt).toLocaleDateString(
                locale === "ar" ? "ar-EG" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap sm:gap-3 ">
            <FaRegUser /> <div>{author?.name?.slice(0, 8)}</div>
          </div>
        </div>
      </div>
    </article>
  );
};

interface BlogCardProps extends IBlog {
  isRow?: boolean;
  isMain?: boolean;
  inDashboard?: boolean;
}

export const BlogCard2: React.FC<BlogCardProps> = ({
  _id,
  title,
  imageCover,
  createdAt,
  description,
  isRow,
  author,
  readTime,
  isMain,
  inDashboard,
}) => {
  return (
    <div
      className={cn("flex flex-col w-full h-full", {
        "md:flex-row md:items-center md:gap-12": isRow,
      })}
    >
      <Link
        href={`${inDashboard ? "/dashboard/blogs" : "/blogs"}/${_id}`}
        className={cn("w-full shadow-md rounded-2xl shadow-primary/20", {
          "md:basis-1/2": isRow,
        })}
      >
        <Image
          src={imageCover}
          alt={title}
          width={430}
          height={240}
          className="object-cover w-full rounded-2xl aspect-[1.79]"
        />
      </Link>
      <div
        className={cn(
          "flex flex-col justify-between flex-grow px-3 mt-5 sm:px-4 sm:mt-6",
          {
            "md:basis-1/2": isRow,
          }
        )}
      >
        <Link href={`/blogs/${_id}`} className="w-full">
          <h3 className="h5">{title}</h3>
        </Link>
        <p className="mt-1 text-text-2 sm:mt-2">{description}</p>
        <BlogUserComponent
          author={author}
          readTime={readTime}
          createdAt={createdAt}
        />
        {isMain && (
          <ShareButtons
            id={_id}
            className="flex items-center gap-4 mt-4 sm:mt-6"
          />
        )}
      </div>
    </div>
  );
};
export const BlogUserComponent = ({
  author,
  readTime,
  createdAt,
  className,
}: {
  author?: {
    name: string;
    profileImg: string;
  };
  readTime: number;
  createdAt: string;
  className?: string;
}) => {
  const locale = useLocale();
  return (
    <div className={cn("flex items-center gap-2 mt-2 sm:mt-4", className)}>
      <UserAvatar
        className="w-12 h-12"
        user={{
          name: author?.name || "",
          profileImg: author?.profileImg || "",
        }}
      />
      <div>
        <div className="text-sm text-text-1 sm:text-base">{author?.name}</div>
        <div className="text-xs sm:text-sm text-text-3">
          <span>
            {readTime} {locale === "ar" ? "د" : "min"}
          </span>{" "}
          .{" "}
          <span>
            {new Date(createdAt).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
