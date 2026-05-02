"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { ICategory, ICoursePackage } from "@/types";
import { useTranslations } from "next-intl";
import React from "react";
import { FaRegClock } from "react-icons/fa";
import Image from "next/image";
import { LevelsIcons } from "@/components/icons";
import { cn, getDynamicString } from "@/lib/utils";
import CardBadges from "@/components/cards/CardBadges";
import { HiOutlineArrowRight, HiOutlineBookOpen } from "react-icons/hi2";

const LearningPath: React.FC<
  ICoursePackage & {
    className?: string;
    onCategoryClick?: (category: ICategory) => void;
  }
> = ({
  title,
  courses,
  price,
  priceAfterDiscount,
  slug,
  type,
  className,
  image,
  category,
  createdAt,
  onCategoryClick,
}) => {
  const text = useTranslations("learningPaths");
  const popularText = useTranslations("popularCourses");
  const countText = useTranslations("learningPathPage");

  const getDifficultyLevel = (type: string) => {
    switch (type?.toLowerCase()) {
      case "beginnertointermediate":
        return popularText("beginnerToIntermediate");
      case "intermediatetoadvanced":
        return popularText("intermediateToAdvanced");
      case "beginnertoadvanced":
        return popularText("beginnerToAdvanced");
      default:
        return popularText("beginnerToIntermediate");
    }
  };

  const totalDuration = courses.reduce(
    (total, course) => total + (course.courseDuration || 0),
    0,
  );

  const imageUrl = image || "/images/hero.png";

  const isFree = priceAfterDiscount === 0 || price === 0;
  const hasDiscount =
    priceAfterDiscount && priceAfterDiscount !== price && !isFree;

  return (
    <div
      className={cn(
        "group flex flex-col w-full h-full relative gap-4 p-4 sm:p-5",
        "rounded-3xl bg-clear-ground border border-primary/10",
        "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
        className,
      )}
    >
      <CardBadges
        price={price}
        priceAfterDiscount={priceAfterDiscount || 0}
        createdAt={createdAt}
      />

      {/* Image */}
      <Link
        href={`/learning-paths/${slug}`}
        className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shrink-0 block"
      >
        <Image
          src={imageUrl}
          alt={getDynamicString(title)}
          title={getDynamicString(title)}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 start-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-clear-ground/95 backdrop-blur text-xs font-semibold text-text-1">
          <LevelsIcons className="size-3.5 shrink-0" />
          <span>{getDifficultyLevel(type)}</span>
        </div>
        {/* Path indicator */}
        <div className="absolute top-3 end-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-clear-ground text-[11px] font-semibold uppercase tracking-wider">
          <HiOutlineBookOpen className="size-3.5" />
          <span>{text("path")}</span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col gap-3">
        {/* Category + courses chip */}
        <div className="flex items-center justify-between gap-2">
          {category?.title ? (
            <button
              type="button"
              onClick={() => onCategoryClick?.(category as ICategory)}
              className="text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary/15 px-2.5 py-1 rounded-full transition-colors truncate max-w-[60%]"
            >
              {getDynamicString(category?.title)}
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
            <HiOutlineBookOpen className="size-3.5" />
            <span>{countText("coursesCount", { count: courses.length })}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/learning-paths/${slug}`} className="block">
          <h3 className="text-lg sm:text-xl font-bold text-text-1 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {getDynamicString(title)}
          </h3>
        </Link>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-text-3">
          <div className="flex items-center gap-1.5">
            <FaRegClock className="size-3.5" />
            <span>
              {(totalDuration / 60)?.toFixed(0)} {popularText("hours")}
            </span>
          </div>
          <span className="size-1 rounded-full bg-text-3/40" />
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-text-2">
              {text("coursesIncludedCount", { count: courses.length })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-primary/10">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-xl font-bold leading-none",
              isFree ? "text-green" : "text-text-1",
            )}
          >
            {isFree
              ? popularText("free")
              : `$${priceAfterDiscount || price || 0}`}
          </span>
          {hasDiscount && (
            <span className="text-xs text-text-3 line-through">
              ${price || 0}
            </span>
          )}
        </div>
        <Button size="sm" className="rounded-full group/btn h-9 px-4" asChild>
          <Link
            href={`/learning-paths/${slug}`}
            className="flex items-center gap-1.5"
          >
            <span>{text("showDetails")}</span>
            <HiOutlineArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const LearningPathSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full h-full relative gap-4 p-4 sm:p-5 rounded-3xl bg-clear-ground border border-primary/10",
        className,
      )}
    >
      <div className="absolute top-4 start-4 z-10 flex gap-2">
        <Skeleton className="w-12 h-6 rounded-full" />
        <Skeleton className="w-10 h-6 rounded-full" />
      </div>

      <Skeleton className="w-full aspect-[16/10] rounded-2xl bg-muted" />

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-primary/10">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </div>
  );
};

export default LearningPath;
