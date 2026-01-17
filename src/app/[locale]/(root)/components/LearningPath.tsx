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
  _id,
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
  // Get difficulty level based on type
  const getDifficultyLevel = (type: string) => {
    switch (type?.toLowerCase()) {
      case "beginnerToIntermediate":
        return popularText("beginnerToIntermediate");
      case "intermediateToAdvanced":
        return popularText("intermediateToAdvanced");
      case "beginnerToAdvanced":
        return popularText("beginnerToAdvanced");
      default:
        return popularText("beginnerToIntermediate");
    }
  };

  // Calculate total duration from all courses
  const totalDuration = courses.reduce(
    (total, course) => total + (course.courseDuration || 0),
    0
  );

  // Use first course image or default image
  const imageUrl = image || "/images/hero.png";

  const isFree = priceAfterDiscount === 0 || price === 0;
  return (
    <div
      className={cn(
        "flex flex-col w-full border hover:border-secondary hover:outline-secondary rounded-[40px] border-transparent outline outline-1  outline-primary/20 transition-all duration-300 p-6 h-full relative gap-5",
        className
      )}
    >
      {/* Card Badges */}
      <CardBadges
        price={price}
        priceAfterDiscount={priceAfterDiscount || 0}
        createdAt={createdAt}
      />

      {/* Image */}
      <div className="relative w-full aspect-[38/29] rounded-[24px] overflow-hidden shrink-0">
        <Image
          src={imageUrl}
          alt={getDynamicString(title)}
          title={getDynamicString(title)}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Level and Category Row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-end gap-1.5">
            <LevelsIcons className="size-6 shrink-0" />
            <span className="text-lg font-medium text-text-2">
              {getDifficultyLevel(type)}
            </span>
          </div>
          {category?.title && (
            <div
              className="bg-secondary/10 px-3 py-1 rounded-full cursor-pointer"
              onClick={() => onCategoryClick?.(category as ICategory)}
            >
              <span className="text-secondary text-lg">
                {getDynamicString(category?.title)}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-text-1 leading-tight">
          {getDynamicString(title)}
        </h3>

        {/* Course Count and Duration Row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-text-1">
              {countText("coursesCount", { count: courses.length })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaRegClock className="size-[18px] text-text-3" />
            <span className="text-base text-text-3">
              {(totalDuration / 60)?.toFixed(0)} {popularText("hours")}
            </span>
          </div>
        </div>
      </div>

      {/* Button and Price Row */}
      <div className="flex items-center gap-3 w-full">
        <Button size="lg" className="rounded-full  flex-1" asChild>
          <Link href={`/learning-paths/${_id}`}>{text("showDetails")}</Link>
        </Button>
        <div className="flex items-start gap-0.5 justify-end min-w-[103px]">
          <span className="text-2xl font-medium text-foreground">
            {!isFree && "$"}
            {isFree ? popularText("free") : priceAfterDiscount || price || 0}
          </span>
          {priceAfterDiscount && priceAfterDiscount !== price && !isFree && (
            <span className="text-xs text-destructive line-through">
              {price || 0}
            </span>
          )}
        </div>
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
        "flex flex-col w-full border hover:border-secondary hover:outline-secondary rounded-[40px] border-transparent outline outline-1 outline-primary/20 transition-all duration-300 p-6 h-full relative gap-5",
        className
      )}
    >
      {/* Card Badges skeleton */}
      <div className="absolute top-4 start-4 z-10 flex gap-2">
        <Skeleton className="w-12 h-6 rounded-sm" />
        <Skeleton className="w-10 h-6 rounded-sm" />
      </div>

      {/* Image skeleton */}
      <Skeleton className="w-full aspect-[38/29] rounded-[24px] bg-muted" />

      <div className="flex-1 flex flex-col gap-3">
        {/* Level and Category Row skeleton */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-end gap-1.5">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-9 w-full" />

        {/* Course Count and Duration Row skeleton */}
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-1">
            <Skeleton className="w-[18px] h-[18px] rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      {/* Button and Price Row skeleton */}
      <div className="flex items-center gap-3 w-full">
        <Skeleton className="h-[60px] flex-1 rounded-full" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
};

export default LearningPath;
