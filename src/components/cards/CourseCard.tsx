"use client";
import { ICategory, ICourse } from "@/types";
import React from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { FaStar, FaRegClock } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { LevelsIcons } from "../icons";
import { cn, getDynamicString } from "@/lib/utils";
import CardBadges from "./CardBadges";

const CourseCard: React.FC<
  ICourse & {
    className?: string;
    onCategoryClick?: (category: ICategory) => void;
  }
> = ({
  title,
  ratingsQuantity,
  price,
  priceAfterDiscount,
  _id,
  type,
  courseDuration,
  category,
  image,
  ratingsAverage,
  createdAt,
  instructor,
  className,
  onCategoryClick,
}) => {
  const text = useTranslations("popularCourses");

  // Get difficulty level based on type
  const getDifficultyLevel = (type: string) => {
    switch (type?.toLowerCase()) {
      case "beginner":
        return text("beginner");
      case "intermediate":
        return text("intermediate");
      case "advanced":
        return text("advanced");
      default:
        return text("beginner");
    }
  };
  const isFree =
    (priceAfterDiscount && priceAfterDiscount === 0) || price === 0;
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
        priceAfterDiscount={priceAfterDiscount}
        createdAt={createdAt}
      />

      {/* Image */}
      <div className="relative w-full aspect-[38/29] rounded-[24px] overflow-hidden shrink-0">
        <Image
          src={image}
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
          <div
            className="bg-secondary/10 px-3 py-1 rounded-full cursor-pointer"
            onClick={() => onCategoryClick?.(category as ICategory)}
          >
            <span className="text-secondary text-lg">
              {getDynamicString(category?.title) || type}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-text-1 leading-tight">
          {getDynamicString(title)}
        </h3>

        {/* Rating and Duration Row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="relative size-8 shrink-0">
              <FaStar className="size-full text-gold" />
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xl font-medium text-muted-foreground
              "
              >
                {ratingsAverage?.toFixed(1) || 0}
              </span>
              <span className="text-sm text-muted-foreground">
                ({ratingsQuantity.toLocaleString()})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <FaRegClock className="size-[18px] text-text-3" />
            <span className="text-base text-text-3">
              {(courseDuration / 60)?.toFixed(0)} {text("hours")}
            </span>
          </div>
        </div>

        {/* Instructor */}
        {instructor && (
          <div className="flex items-center gap-1.5">
            {instructor.profileImg ? (
              <div className="relative size-10 rounded-full overflow-hidden shrink-0">
                <Image
                  src={instructor.profileImg}
                  alt={instructor.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-10 rounded-full bg-muted shrink-0" />
            )}
            <span className="text-base font-semibold text-text-1">
              {instructor.name}
            </span>
          </div>
        )}
      </div>

      {/* Button and Price Row */}
      <div className="flex items-center gap-3 w-full">
        <Button size="lg" className="rounded-full  flex-1" asChild>
          <Link href={`/courses/${_id}`}>{text("learnMore")}</Link>
        </Button>
        <div className="flex items-start gap-0.5 justify-end min-w-[103px]">
          <span className="text-2xl font-medium text-foreground">
            {!isFree && "$"}
            {isFree ? text("free") : priceAfterDiscount || price}
          </span>
          {priceAfterDiscount > 0 && priceAfterDiscount < price && !isFree && (
            <span className="text-xs text-destructive line-through">
              {price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const CourseReviewOverView: React.FC<{
  ratingsAverage: number;
  ratingsQuantity: number;
}> = ({ ratingsAverage, ratingsQuantity }) => {
  return (
    <div className="flex items-center gap-2 my-2 sm:my-3 whitespace-nowrap">
      <FaStar className="text-xl text-gold" />{" "}
      <div className="text-base font-medium sm:text-xl">
        {ratingsAverage || 0}
      </div>
      <div className="text-xs sm:text-base text-text-3">
        ({ratingsQuantity})
      </div>
    </div>
  );
};

export const CourseCardSkeleton: React.FC<{ className?: string }> = ({
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

        {/* Rating and Duration Row skeleton */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-[18px] h-[18px] rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Instructor skeleton */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
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

export default CourseCard;
