"use client";

import React from "react";
import ServiceCard, {
  ServiceCardSkeleton,
} from "../../../../components/cards/ServiceCard";
import { ICategory, IPackage } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CAROUSEL_CLASSES } from "@/constants";

interface ServicesSubsectionProps {
  gridClassName?: string;
  services: IPackage[];
  loading: boolean;
  theme?: "carousel" | "grid";
  title?: string;
  cardClassName?: string;
  onCategoryClick?: (category: ICategory) => void;
}

const ServicesSubsection: React.FC<ServicesSubsectionProps> = ({
  gridClassName,
  services,
  loading,
  theme = "carousel",
  title,
  cardClassName,
  onCategoryClick,
}) => {
  const text = useTranslations("services");

  // Show "No services found" only when not loading and no services exist
  if (!loading && services.length === 0) {
    return (
      <div className="relative">
        {title && <h2 className="mb-6 capitalize">{title}</h2>}
        <h3 className="pt-8 pb-12 text-text-2 text-center">
          {text("noServices")}
        </h3>
      </div>
    );
  }

  if (theme === "carousel") {
    return (
      <div className="relative">
        {title && <h2 className="mb-6 capitalize">{title}</h2>}
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className={CAROUSEL_CLASSES.content}>
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className={CAROUSEL_CLASSES.item}
                  >
                    <ServiceCardSkeleton className={CAROUSEL_CLASSES.card} />
                  </CarouselItem>
                ))
              : services.length > 0
              ? services.map((service) => (
                  <CarouselItem
                    key={service._id}
                    className={CAROUSEL_CLASSES.item}
                  >
                    <ServiceCard
                      {...service}
                      className={CAROUSEL_CLASSES.card}
                      onCategoryClick={onCategoryClick}
                    />
                  </CarouselItem>
                ))
              : null}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  if (theme === "grid") {
    return (
      <div>
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        )}
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            gridClassName
          )}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <ServiceCardSkeleton
                  key={index}
                  className={cardClassName}
                />
              ))
            : services.length > 0
            ? services.map((service) => (
                <ServiceCard
                  key={service._id}
                  {...service}
                  className={cardClassName}
                  onCategoryClick={onCategoryClick}
                />
              ))
            : null}
        </div>
      </div>
    );
  }

  return null;
};

export default ServicesSubsection;
