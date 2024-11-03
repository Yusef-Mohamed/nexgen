import { Button } from "@/components/ui/button";
import { IPackage } from "@/types";
import { useTranslations } from "next-intl";
import React from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

const ServiceCard: React.FC<IPackage> = ({
  title,
  highlights,
  price,
  priceAfterDiscount,
}) => {
  const text = useTranslations("services");
  return (
    <div
      className={
        "flex flex-col cardShadow justify-between gap-4 sm:gap-8 self-stretch sm:py-8 py-12 px-6 sm:px-8 bg-background rounded-2xl border-4 border-solid border-primary/10 hover:border-primary/50 transition-colors"
      }
    >
      <h3>{title}</h3>{" "}
      <div>
        <div className="flex items-center gap-1 font-medium whitespace-nowrap">
          <div className="h2">
            ${priceAfterDiscount ? priceAfterDiscount : price}
          </div>
          <span className="h4 text-text-3">/ {text("perMonth")}</span>
        </div>
        {priceAfterDiscount && (
          <h4 className="mt-1 sm:mt-2 text-primary">
            {text("save")} ${price - priceAfterDiscount}
          </h4>
        )}
      </div>
      <Button size="lg" className="w-full ">
        {text("startNow")}
      </Button>
      <div>
        <h4>{text("weOffer")}</h4>
        <ul className="flex flex-col sm:mt-3 mt-1.5 sm:space-y-2 space-y-1">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-center gap-1 sm:gap-2 ">
              <FaRegCircleCheck /> {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;
