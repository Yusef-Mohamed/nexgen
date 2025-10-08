"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { ICategory, IPackage } from "@/types";
import { useTranslations } from "next-intl";
import React from "react";
import { FaRegClock } from "react-icons/fa6";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
        "flex flex-col w-full bg-white rounded-xl border border-primary/20 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 md:p-6 p-3 sm:p-4 h-full",
        className
      )}
    >
      {/* Image */}
      <Image
        src={imageUrl}
        alt={title}
        width={430}
        height={300}
        className="object-cover w-full rounded-2xl courseImage bg-muted"
      />

      <div className="flex-1 md:space-y-4 space-y-2.5 sm:space-y-3 my-5">
        <div className="flex flex-col space-y-1 sm:space-y-1.5">
          <div
            className="text-primary h5 capitalize underline"
            onClick={() => onCategoryClick?.(course?.category as ICategory)}
          >
            {course?.category?.title || "Service"}
          </div>

          {/* Title */}
          <h3 className="h3 font-bold">{title}</h3>

          <p className="flex items-center gap-2 font-medium text-text-3">
            <FaRegClock /> {subscriptionDurationDays} {text("day")}
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <span className="h3 font-bold">
            {!isFree && "$"}
            {isFree ? "Free" : priceAfterDiscount || price}
          </span>
          {priceAfterDiscount && priceAfterDiscount !== price && !isFree && (
            <span className="text-text-3 line-through">${price}</span>
          )}
        </div>
      </div>

      {/* Call to Action Button */}
      <Button size="lg" className="w-full" asChild>
        <Link href={`/services/${_id}`}>{text("startNow")}</Link>
      </Button>
    </div>
  );
};

export const ServiceCardSkeleton: React.FC<{ className?: string }> = ({
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
      <Skeleton className="w-full courseImage rounded-2xl bg-muted" />

      <div className="flex-1 md:space-y-4 space-y-2.5 sm:space-y-3 my-5">
        <div className="flex flex-col space-y-1 sm:space-y-1.5">
          {/* Service type skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-16" />
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

        {/* Highlights skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <div className="space-y-1">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
};

export default ServiceCard;
