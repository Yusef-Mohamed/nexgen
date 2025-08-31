"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ICategory } from "@/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFilterProps {
  categories: ICategory[];
  selectedCategory: ICategory | null;
  onCategoryChange: (category: ICategory | null) => void;
  showAllButton?: boolean;
  className?: string;
  loading?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "",
  loading = false,
}) => {
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
          {categories.map((category) => (
            <CarouselItem key={category._id} className="px-2 basis-auto">
              <button
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "rounded-full px-4 py-2 h-auto text-base whitespace-nowrap transition-colors",
                  selectedCategory?._id === category._id
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "bg-transparent border border-text-3 text-text-1 hover:bg-primary hover:border-primary hover:text-primary-foreground"
                )}
              >
                {category.title}
              </button>
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
