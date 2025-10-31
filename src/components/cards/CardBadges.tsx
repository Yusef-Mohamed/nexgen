"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface CardBadgesProps {
  price: number;
  priceAfterDiscount: number;
  createdAt: string;
  className?: string;
}

const CardBadges: React.FC<CardBadgesProps> = ({
  price,
  priceAfterDiscount,
  createdAt,
  className,
}) => {
  // Check if course is free
  const isFree = priceAfterDiscount === 0 || price === 0;

  // Check if course has discount
  const hasDiscount = priceAfterDiscount > 0 && priceAfterDiscount < price;

  // Check if course was created within the last year
  const isNew = (() => {
    const createdDate = new Date(createdAt);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return createdDate > oneYearAgo;
  })();

  const badges = [];

  // Add FREE badge if course is free
  if (!isFree) {
    badges.push({
      text: "FREE",
      className: "bg-green/10 text-green",
    });
  }

  // Add NEW badge if course was created within the last year
  if (isNew) {
    badges.push({
      text: "NEW",
      className: "bg-primary/10 text-primary",
    });
  }

  // Add SALE badge if course has discount
  if (hasDiscount) {
    badges.push({
      text: "SALE",
      className: "bg-destructive/10 text-destructive",
    });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={cn("absolute top-4 start-4 z-10 flex gap-2", className)}>
      {badges.map((badge, index) => (
        <span key={index} className="bg-white rounded-sm">
          <span
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-sm ",
              badge.className
            )}
          >
            {badge.text}
          </span>
        </span>
      ))}
    </div>
  );
};

export default CardBadges;
