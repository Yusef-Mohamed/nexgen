import { IBlog } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { Link } from "@/i18n/navigation";
import UserAvatar from "../UserAvatar";
import { cn, getDynamicString } from "@/lib/utils";
import { ShareButtons } from "./BlogsShareButtons";
import {
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineNewspaper,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { Button } from "../ui/button";

const BlogCard: React.FC<
  IBlog & { inDashboard?: boolean; className?: string }
> = ({
  slug,
  title,
  imageCover,
  createdAt,
  readTime,
  author,
  inDashboard,
  className,
}) => {
  const locale = useLocale();
  const text = useTranslations("blogs");
  if (!author) return null;

  const href = `${inDashboard ? "/dashboard/blogs" : "/blogs"}/${slug}`;
  const dateLabel = new Date(createdAt).toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );

  return (
    <article
      className={cn(
        "group flex flex-col w-full h-full relative gap-4 p-4 sm:p-5",
        "rounded-3xl bg-clear-ground border border-primary/10",
        "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
        className,
      )}
    >
      {/* Image */}
      <Link
        href={href}
        className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shrink-0 block"
      >
        <Image
          src={imageCover}
          alt={getDynamicString(title)}
          width={430}
          height={240}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none" />
        {/* Article ribbon */}
        <div className="absolute top-3 end-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-clear-ground text-[11px] font-semibold uppercase tracking-wider">
          <HiOutlineNewspaper className="size-3.5" />
          <span>{text("article")}</span>
        </div>
        {/* Read time pill */}
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Date chip */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
            <HiOutlineCalendarDays className="size-3.5" />
            {dateLabel}
          </span>{" "}
          <div className="inline-flex bg-muted items-center gap-1.5 px-2.5 py-1 rounded-full bg-clear-ground/95 backdrop-blur text-xs font-semibold text-text-1">
            <HiOutlineClock className="size-3.5" />
            <span>{text("minRead", { readTime })}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={href} className="block">
          <h3 className="text-lg sm:text-xl font-bold text-text-1 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {getDynamicString(title)}
          </h3>
        </Link>

        {/* Author row */}
        <div className="flex items-center gap-2 text-xs text-text-3">
          {author.profileImg ? (
            <span className="relative size-6 rounded-full overflow-hidden shrink-0">
              <Image
                src={author.profileImg}
                alt={author.name}
                fill
                className="object-cover"
              />
            </span>
          ) : (
            <span className="size-6 rounded-full bg-muted shrink-0" />
          )}
          <span className="font-medium text-text-2 truncate">
            {author.name}
          </span>
        </div>
      </div>

      {/* Footer: read more */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-primary/10">
        <span className="text-xs text-text-3">{text("readArticle")}</span>
        <Button size="sm" className="rounded-full group/btn h-9 px-4" asChild>
          <Link href={href} className="flex items-center gap-1.5 text-xs!">
            <span>{text("readMore")}</span>
            <HiOutlineArrowRight className="size-3.5 rtl:rotate-180" />
          </Link>
        </Button>
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
  slug,
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
        href={`${inDashboard ? "/dashboard/blogs" : "/blogs"}/${slug}`}
        className={cn(
          "group block w-full overflow-hidden rounded-2xl border border-primary/10",
          {
            "md:basis-1/2": isRow,
          },
        )}
      >
        <Image
          src={imageCover}
          alt={getDynamicString(title)}
          width={430}
          height={240}
          className="object-cover w-full aspect-[1.79] transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div
        className={cn(
          "flex flex-col justify-between flex-grow px-3 mt-5 sm:px-4 sm:mt-6",
          { "md:basis-1/2": isRow },
        )}
      >
        <Link
          href={`${inDashboard ? "/dashboard/blogs" : "/blogs"}/${slug}`}
          className="block"
        >
          <h3 className="text-lg sm:text-xl font-bold text-text-1 leading-snug hover:text-primary transition-colors">
            {getDynamicString(title)}
          </h3>
        </Link>
        <p className="mt-2 text-text-3">{getDynamicString(description)}</p>
        <BlogUserComponent
          author={author}
          readTime={readTime}
          createdAt={createdAt}
        />
        {isMain && (
          <ShareButtons
            id={slug}
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
  const text = useTranslations("blogs");
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
            {readTime} {text("minuteAbbr")}
          </span>{" "}
          ·{" "}
          <span>
            {new Date(createdAt).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
