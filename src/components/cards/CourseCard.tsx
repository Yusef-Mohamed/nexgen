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
import StarRating from "../StarRating";
import { cn } from "@/lib/utils";

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
        "flex flex-col w-full bg-card rounded-xl border border-primary/20 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 md:p-6 p-3 sm:p-4 h-full",
        className
      )}
    >
      <Image
        src={image}
        alt={title}
        width={430}
        height={300}
        className="object-cover w-full rounded-2xl courseImage bg-muted"
      />

      <div className="flex-1 md:space-y-4 space-y-2.5 sm:space-y-3 my-5">
        <div className=" flex flex-col space-y-1 sm:space-y-1.5">
          <div className="flex items-center text-text-2 gap-2">
            <LevelsIcons />
            <span className="h5 font-medium">{getDifficultyLevel(type)}</span>
          </div>
          <h3>{title}</h3>
          <div
            className="text-primary h5 capitalize underline cursor-pointer"
            onClick={() => onCategoryClick?.(category as ICategory)}
          >
            {category?.title || type}
          </div>{" "}
          <p className="flex items-center gap-2 font-medium text-text-3">
            <FaRegClock /> {(courseDuration / 60).toFixed(1)} {text("hours")}
          </p>
        </div>

        <StarRating
          rating={ratingsAverage}
          containerClassName="flex items-center gap-1"
          iconClassName="size-5"
          showRating={true}
          showCount={true}
          count={ratingsQuantity}
          countClassName="h5"
          ratingClassName="h4"
        />

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <span className="h3 font-bold">
            {!isFree && "$"}
            {isFree ? text("free") : priceAfterDiscount || price}
          </span>
          {priceAfterDiscount > 0 && !isFree && (
            <span className="text-text-3 line-through">${price}</span>
          )}
        </div>
      </div>

      {/* Call to Action Button */}
      <Button size="lg" className="w-full" asChild>
        <Link href={`/courses/${_id}`}>{text("learnMore")}</Link>
      </Button>
    </div>
  );
};

export const CourseReviewOverView: React.FC<{
  ratingsAverage: number;
  ratingsQuantity: number;
}> = ({ ratingsAverage, ratingsQuantity }) => {
  return (
    <div className="flex items-center gap-2 my-2 sm:my-3 whitespace-nowrap">
      <FaStar className="text-xl text-gold" />
      <div className="text-xs sm:text-base text-text-3">
        ({ratingsQuantity})
      </div>
      <div className="text-base font-medium sm:text-xl">{ratingsAverage}</div>
    </div>
  );
};

export const CourseCardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full bg-card rounded-xl border border-primary/20 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 md:p-6 p-3 sm:p-4 h-full",
        className
      )}
    >
      {/* Image skeleton */}
      <Skeleton className="w-full courseImage rounded-2xl bg-muted" />

      <div className="flex-1 md:space-y-4 space-y-2.5 sm:space-y-3 my-5">
        <div className="flex flex-col space-y-1 sm:space-y-1.5">
          {/* Difficulty level skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Title skeleton */}
          <Skeleton className="h-6 w-full" />

          {/* Category skeleton */}
          <Skeleton className="h-5 w-24" />

          {/* Duration skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Star rating skeleton */}
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-5 h-5 rounded" />
            ))}
          </div>
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Pricing skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Button skeleton */}
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
};

export default CourseCard;
