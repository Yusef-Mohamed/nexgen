"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { HiLightningBolt, HiSparkles, HiGift } from "react-icons/hi";

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
  const t = useTranslations("badges");

  // Check if course is free
  const isFree =
    (priceAfterDiscount && priceAfterDiscount === 0) || price === 0;

  // Check if course has discount
  const hasDiscount = priceAfterDiscount > 0 && priceAfterDiscount < price;

  // Check if course was created within the last 30 days
  const isNew = (() => {
    const createdDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  })();

  const badges = [];

  // Add NEW badge
  if (isNew) {
    badges.push({
      text: t("new"),
      icon: <HiSparkles className="text-[13px]" />,
      className: "bg-sky-600 text-white border-sky-500 shadow-sky-200/50",
    });
  }

  // Add SALE badge
  if (hasDiscount) {
    badges.push({
      text: t("sale"),
      icon: <HiLightningBolt className="text-[13px]" />,
      className: "bg-rose-600 text-white border-rose-500 shadow-rose-200/50",
    });
  }

  // Add FREE badge
  if (isFree) {
    badges.push({
      text: t("free"),
      icon: <HiGift className="text-[13px]" />,
      className:
        "bg-emerald-600 text-white border-emerald-500 shadow-emerald-200/50",
    });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute top-4 start-4 z-10 flex flex-wrap gap-2",
        className
      )}
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest rounded-full border shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-default select-none",
            badge.className
          )}
        >
          {badge.icon}
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

export default CardBadges;
