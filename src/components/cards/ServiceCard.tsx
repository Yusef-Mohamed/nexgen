"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { IPackage } from "@/types";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

const ServiceCard: React.FC<IPackage> = ({
  title,
  highlights,
  price,
  priceAfterDiscount,
  _id,
  subscriptionDurationDays,
}) => {
  const text = useTranslations("services");
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const visibleHighlights = showAllHighlights
    ? highlights
    : highlights.slice(0, 5);
  const hasMoreHighlights = highlights.length > 5;

  return (
    <div
      className={
        "flex flex-col cardShadow gap-4 sm:gap-8 self-stretch sm:py-8 py-12 px-6 sm:px-8 bg-background rounded-2xl border-4 border-solid border-primary/10 hover:border-primary/50 transition-colors"
      }
    >
      <h3>{title}</h3>{" "}
      <div>
        <div className="flex items-center gap-1 font-medium whitespace-nowrap">
          <div className="h2">
            ${priceAfterDiscount ? priceAfterDiscount : price}
          </div>
          <span className="h4 text-text-3">
            / {subscriptionDurationDays} {text("day")}
          </span>
        </div>
        {priceAfterDiscount && (
          <h4 className="mt-1 sm:mt-2 text-primary">
            {text("save")} ${price - priceAfterDiscount}
          </h4>
        )}
      </div>
      <Button asChild size="lg" className="w-full ">
        <Link href={`/checkout/service/${_id}`}>{text("startNow")}</Link>
      </Button>
      <div>
        <h4>{text("weOffer")}</h4>
        <ul className="flex flex-col sm:mt-3 mt-1.5 sm:space-y-2 space-y-1">
          {visibleHighlights.map((highlight, index) =>
            highlight.length > 0 ? (
              <li key={index} className="">
                <FaRegCircleCheck className="inline text-primary" /> {highlight}
              </li>
            ) : null
          )}
        </ul>
        {hasMoreHighlights && (
          <Button
            variant="ghost"
            className="mt-2 text-primary hover:text-primary/80"
            onClick={() => setShowAllHighlights(!showAllHighlights)}
          >
            {showAllHighlights ? text("showLess") : text("showMore")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
