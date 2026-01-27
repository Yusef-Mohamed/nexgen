"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, Tag, Gift } from "lucide-react";

interface CardBadgesProps {
  price: number;
  priceAfterDiscount: number;
  createdAt: string; // ISO string
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

  // Check if course was created within the last 6 months
  const isNew = (() => {
    try {
      const createdDate = new Date(createdAt);
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return createdDate > sixMonthsAgo;
    } catch (e) {
      return false;
    }
  })();

  const badges = [];

  // Add FREE badge if course is free
  if (isFree) {
    badges.push({
      text: t("free"),
      variant: "success",
      icon: Gift,
      animate: {},
    });
  }

  // Add SALE badge if course has discount
  if (hasDiscount) {
    const discountPercent = Math.round(
      ((price - priceAfterDiscount) / price) * 100
    );
    badges.push({
      text: `-${discountPercent}%`,
      variant: "destructive",
      icon: Tag,
      animate: {
        scale: [1, 1.05, 1],
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
      },
    });
  }

  // Add NEW badge if course was created recently
  if (isNew) {
    badges.push({
      text: t("new"),
      variant: "primary",
      icon: Sparkles,
      animate: {
        y: [0, -2, 0],
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
      },
    });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute top-5 start-5 z-20 flex flex-wrap gap-2",
        className
      )}
    >
      {badges.map((badge, index) => (
        <span
          key={index}
          className={cn(
            "px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest leading-none rounded-lg flex items-center gap-1.5",
            "backdrop-blur-xl border border-white/40 shadow-xl",
            "transition-all duration-300 hover:scale-110 select-none",
            badge.variant === "success" &&
              "bg-green/80 text-white border-green/20",
            badge.variant === "primary" &&
              "bg-primary/80 text-white border-primary/20",
            badge.variant === "destructive" &&
              "bg-destructive/80 text-white border-destructive/20"
          )}
        >
          <badge.icon className="size-3.5" />
          {badge.text}
        </span>
      ))}
    </div>
  );
};

export default CardBadges;
