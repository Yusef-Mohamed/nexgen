"use client";
import { ICategory, ICourse } from "@/types";
import React from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { FaStar, FaRegClock } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { LevelsIcons } from "../icons";
import { cn, getDynamicString } from "@/lib/utils";
import CardBadges from "./CardBadges";
import { HiOutlineArrowRight } from "react-icons/hi2";

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
  slug,
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
  const hasDiscount =
    priceAfterDiscount > 0 && priceAfterDiscount < price && !isFree;

  return (
    <div
      className={cn(
        "group flex flex-col w-full h-full relative gap-4 p-4 sm:p-5",
        "rounded-3xl bg-clear-ground border border-primary/10",
        "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
        className,
      )}
    >
      {/* Card Badges */}
      <CardBadges
        price={price}
        priceAfterDiscount={priceAfterDiscount}
        createdAt={createdAt}
      />

      {/* Image */}
      <Link
        href={`/courses/${slug}`}
        className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shrink-0 block"
      >
        <Image
          src={image}
          alt={getDynamicString(title)}
          title={getDynamicString(title)}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Bottom gradient + level pill */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 start-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-clear-ground/95 backdrop-blur text-xs font-semibold text-text-1">
          <LevelsIcons className="size-3.5 shrink-0" />
          <span>{getDifficultyLevel(type)}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Category + rating */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onCategoryClick?.(category as ICategory)}
            className="text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary/15 px-2.5 py-1 rounded-full transition-colors truncate max-w-[60%]"
          >
            {getDynamicString(category?.title) || type}
          </button>
          <div className="flex items-center gap-1.5 shrink-0">
            <FaStar className="size-4 text-gold" />
            <span className="text-sm font-semibold text-text-1">
              {ratingsAverage?.toFixed(1) || 0}
            </span>
            <span className="text-xs text-text-3">
              ({ratingsQuantity.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/courses/${slug}`} className="block">
          <h3 className="text-lg sm:text-xl font-bold text-text-1 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {getDynamicString(title)}
          </h3>
        </Link>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-text-3">
          <div className="flex items-center gap-1.5">
            <FaRegClock className="size-3.5" />
            <span>
              {(courseDuration / 60)?.toFixed(0)} {text("hours")}
            </span>
          </div>
          {instructor?.name && (
            <>
              <span className="size-1 rounded-full bg-text-3/40" />
              <div className="flex items-center gap-1.5 min-w-0">
                {instructor.profileImg ? (
                  <span className="relative size-5 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={instructor.profileImg}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="size-5 rounded-full bg-muted shrink-0" />
                )}
                <span className="truncate font-medium text-text-2">
                  {instructor.name}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer: price + CTA */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-primary/10">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-xl font-bold leading-none",
              isFree ? "text-green" : "text-text-1",
            )}
          >
            {isFree ? text("free") : `$${priceAfterDiscount || price}`}
          </span>
          {hasDiscount && (
            <span className="text-xs text-text-3 line-through">${price}</span>
          )}
        </div>
        <Button size="sm" className="rounded-full group/btn h-9 px-4" asChild>
          <Link
            href={`/courses/${slug}`}
            className="flex items-center gap-1.5 text-xs!"
          >
            <span>{text("learnMore")}</span>
            <HiOutlineArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5" />
          </Link>
        </Button>
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
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-primary/10">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
};

export default CourseCard;
