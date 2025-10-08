"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { ICategory, ICoursePackage } from "@/types";
import { useTranslations } from "next-intl";
import React from "react";
import { FaRegClock } from "react-icons/fa";
import Image from "next/image";
import { LevelsIcons } from "@/components/icons";
import { cn } from "@/lib/utils";

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
  onCategoryClick,
}) => {
  const text = useTranslations("learningPaths");
  const popularText = useTranslations("popularCourses");

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

  const isFree =
    (priceAfterDiscount && priceAfterDiscount === "0") || price === "0";
  return (
    <div
      className={cn(
        "flex flex-col w-full bg-card rounded-xl border border-primary/20 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 md:p-6 p-3 sm:p-4 h-full",
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={title}
        width={430}
        height={300}
        className="object-cover w-full rounded-2xl courseImage bg-muted"
      />

      <div className="flex-1 md:space-y-4 space-y-2.5 sm:space-y-3 my-5">
        <div className="flex flex-col space-y-1 sm:space-y-1.5">
          {/* Difficulty Level */}
          <div className="flex items-center text-text-2 gap-2">
            <LevelsIcons />
            <span className="h5 font-medium">{getDifficultyLevel(type)}</span>
          </div>

          {/* Category */}
          {category?.title && (
            <div
              className="text-primary h5 capitalize underline"
              onClick={() => onCategoryClick?.(category as ICategory)}
            >
              {category?.title}
            </div>
          )}

          {/* Title */}
          <h3 className="h3 font-bold">{title}</h3>

          {/* Course Count and Duration */}
          <p className="flex items-center gap-2 font-medium text-text-3">
            {courses.length}{" "}
            {text("coursesCount", { count: courses.length }).split(" ")[1]} •
            <FaRegClock /> {(totalDuration / 60).toFixed(1)}{" "}
            {popularText("hours")}
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <span className="h3 font-bold">
            {!isFree && "$"}
            {isFree ? popularText("free") : priceAfterDiscount || price}
          </span>
          {priceAfterDiscount && priceAfterDiscount !== price && !isFree && (
            <span className="text-text-3 line-through">${price}</span>
          )}
        </div>
      </div>

      {/* Call to Action Button */}
      <Button size="lg" className="w-full" asChild>
        <Link href={`/learning-paths/${_id}`}>{text("showDetails")}</Link>
      </Button>
    </div>
  );
};

export const LearningPathSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full bg-white rounded-xl border border-primary/20 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 md:p-6 p-3 sm:p-4 h-full",
        className
      )}
    >
      {/* Image skeleton */}
      <div className="relative">
        <Skeleton className="w-full courseImage rounded-2xl bg-muted" />
        {/* New tag skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="w-16 h-6 rounded-lg" />
        </div>
      </div>

      <div className="flex-1 md:space-y-4 space-y-2.5 sm:space-y-3 my-5">
        <div className="flex flex-col space-y-1 sm:space-y-1.5">
          {/* Difficulty level skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Category skeleton */}
          <Skeleton className="h-5 w-24" />

          {/* Title skeleton */}
          <Skeleton className="h-6 w-full" />

          {/* Duration skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
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

export default LearningPath;
