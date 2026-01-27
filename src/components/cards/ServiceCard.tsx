"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { ICategory, IPackage } from "@/types";
import { useTranslations } from "next-intl";
import React from "react";
import { FaRegClock } from "react-icons/fa6";
import Image from "next/image";
import { cn, getDynamicString } from "@/lib/utils";
import CardBadges from "./CardBadges";

const ServiceCard: React.FC<
  IPackage & {
    className?: string;
    onCategoryClick?: (category: ICategory) => void;
  }
> = ({
  title,
  price,
  priceAfterDiscount,
  _id,
  subscriptionDurationDays,
  course,
  createdAt,
  className,
  onCategoryClick,
}) => {
  const text = useTranslations("services");

  // Use course image or default image
  const imageUrl = course?.image || "/images/hero.png";

  const isFree =
    (priceAfterDiscount && priceAfterDiscount === 0) || price === 0;

  return (
    <div
      className={cn(
        "flex flex-col w-full border  hover:border-secondary hover:outline-secondary rounded-[40px] border-primary/20 transition-all duration-300 p-6 h-full relative gap-5",
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
        {/* Category Row */}
        <div className="flex items-center justify-end w-full">
          <div
            className="bg-secondary/10 px-3 py-1 rounded-full cursor-pointer"
            onClick={() => onCategoryClick?.(course?.category as ICategory)}
          >
            <span className="text-secondary text-lg">
              {getDynamicString(course?.category?.title) || "Service"}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-text-1 leading-tight">
          {getDynamicString(title)}
        </h3>

        {/* Duration Row */}
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center gap-1">
            <FaRegClock className="size-[18px] text-text-3" />
            <span className="text-base text-text-3">
              {subscriptionDurationDays} {text("day")}
            </span>
          </div>
        </div>
      </div>

      {/* Button and Price Row */}
      <div className="flex items-center gap-3 w-full">
        <Button
          size="lg"
          className="rounded-full  flex-1"
          asChild
        >
          <Link href={`/services/${_id}`}>{text("startNow")}</Link>
        </Button>
        <div className="flex items-start gap-0.5 justify-end min-w-[103px]">
          <span className="text-2xl font-medium text-foreground">
            {!isFree && "$"}
            {isFree ? text("free") || "Free" : priceAfterDiscount || price}
          </span>
          {priceAfterDiscount && priceAfterDiscount !== price && !isFree && (
            <span className="text-xs text-destructive line-through">
              {price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const ServiceCardSkeleton: React.FC<{ className?: string }> = ({
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
        {/* Category Row skeleton */}
        <div className="flex items-center justify-end w-full">
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-9 w-full" />

        {/* Duration Row skeleton */}
        <div className="flex items-center justify-end w-full">
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

export default ServiceCard;
