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
import { HiOutlineArrowRight, HiOutlineSparkles } from "react-icons/hi2";

const ServiceCard: React.FC<
  IPackage & {
    className?: string;
    onCategoryClick?: (category: ICategory) => void;
  }
> = ({
  title,
  price,
  priceAfterDiscount,
  slug,
  subscriptionDurationDays,
  course,
  createdAt,
  className,
  image,
  onCategoryClick,
}) => {
  const text = useTranslations("services");

  const imageUrl = image || "/images/hero.png";

  const isFree =
    (priceAfterDiscount && priceAfterDiscount === 0) || price === 0;
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
        href={`/services/${slug}`}
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
        {/* Service indicator */}
        <div className="absolute top-3 end-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/90 text-clear-ground text-[11px] font-semibold uppercase tracking-wider">
          <HiOutlineSparkles className="size-3.5" />
          <span>{text("service")}</span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col gap-3">
        {/* Category + duration */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onCategoryClick?.(course?.category as ICategory)}
            className="text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary/15 px-2.5 py-1 rounded-full transition-colors truncate max-w-[60%]"
          >
            {getDynamicString(course?.category?.title) || text("service")}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-text-3 shrink-0">
            <FaRegClock className="size-3.5" />
            <span>
              {subscriptionDurationDays} {text("day")}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/services/${slug}`} className="block">
          <h3 className="text-lg sm:text-xl font-bold text-text-1 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {getDynamicString(title)}
          </h3>
        </Link>

        {course?.title && (
          <div className="flex items-center gap-1.5 text-xs text-text-3">
            <span className="text-text-2 font-medium truncate">
              {getDynamicString(course.title)}
            </span>
          </div>
        )}
      </div>

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
            href={`/services/${slug}`}
            className="flex items-center gap-1.5"
          >
            <span>{text("startNow")}</span>
            <HiOutlineArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5" />
          </Link>
        </Button>
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
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-primary/10">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
};

export default ServiceCard;
