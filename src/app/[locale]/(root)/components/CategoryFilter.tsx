"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ICategory } from "@/types";
import { cn, getDynamicString } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface CategoryFilterProps {
  categories: ICategory[];
  selectedCategory: ICategory | null;
  onCategoryChange: (category: ICategory | null) => void;
  showAllButton?: boolean;
  className?: string;
  loading?: boolean;
  enableSearch?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "",
  loading = false,
  enableSearch = false,
}) => {
  const text = useTranslations("common");

  return (
    <div className={cn("w-full", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {/* All Button - only show when search is enabled */}
          {enableSearch && (
            <CarouselItem className="px-2 basis-auto">
              <Button
                onClick={() => onCategoryChange(null)}
                className={cn(
                  "rounded-full px-4 py-2 whitespace-nowrap transition-colors",
                )}
                variant={selectedCategory ? "outline" : "default"}
              >
                {text("all")}
              </Button>
            </CarouselItem>
          )}

          {categories.map((category) => (
            <CarouselItem key={category._id} className="px-2 basis-auto">
              <Button
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "rounded-full px-4 py-2 whitespace-nowrap transition-colors",
                )}
                variant={
                  selectedCategory?._id === category._id ? "default" : "outline"
                }
              >
                {getDynamicString(category.title)}
              </Button>
            </CarouselItem>
          ))}
          {loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem key={index} className="px-2 basis-auto">
                <Skeleton className="h-10 w-24 rounded-full" />
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CategoryFilter;
