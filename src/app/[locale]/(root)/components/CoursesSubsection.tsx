"use client";

import React from "react";
import CourseCard, {
  CourseCardSkeleton,
} from "../../../../components/cards/CourseCard";
import { ICategory, ICourse } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CAROUSEL_CLASSES } from "@/constants";

interface CoursesSubsectionProps {
  gridClassName?: string;
  courses: ICourse[];
  loading: boolean;
  theme?: "carousel" | "grid";
  title?: string;
  cardClassName?: string;
  onCategoryClick?: (category: ICategory) => void;
}

const CoursesSubsection: React.FC<CoursesSubsectionProps> = ({
  gridClassName,
  courses,
  loading,
  theme = "carousel",
  title,
  cardClassName,
  onCategoryClick,
}) => {
  const text = useTranslations("popularCourses");

  // Show "No courses found" only when not loading and no courses exist
  if (!loading && courses.length === 0) {
    return (
      <div className="relative">
        {title && <h2 className="mb-6 capitalize">{title}</h2>}
        <h3 className="pt-8 pb-12 text-text-2 text-center  ">
          {" "}
          {text("noCourses")}
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
                    <CourseCardSkeleton
                      className={cn(CAROUSEL_CLASSES.card, cardClassName)}
                    />
                  </CarouselItem>
                ))
              : courses.length > 0
              ? courses.map((course) => (
                  <CarouselItem
                    key={course._id}
                    className={CAROUSEL_CLASSES.item}
                  >
                    <CourseCard
                      {...course}
                      className={cn(CAROUSEL_CLASSES.card, cardClassName)}
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
        {title && <h2 className="mb-6 capitalize">{title}</h2>}

        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
            gridClassName
          )}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={cn("space-y-3", cardClassName)}
                >
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))
            : courses.length > 0
            ? courses.map((course) => (
                <CourseCard
                  key={course._id}
                  {...course}
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

export default CoursesSubsection;
