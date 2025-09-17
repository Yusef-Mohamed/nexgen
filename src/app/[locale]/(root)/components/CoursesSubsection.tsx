"use client";

import React from "react";
import CourseCard, {
  CourseCardSkeleton,
} from "../../../../components/cards/CourseCard";
import { ICourse } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

interface CoursesSubsectionProps {
  courses: ICourse[];
  loading: boolean;
  theme?: "carousel" | "grid";
  title?: string;
}

const CoursesSubsection: React.FC<CoursesSubsectionProps> = ({
  courses,
  loading,
  theme = "carousel",
  title,
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
        {title && <h2 className="mb-6 capitalize font-semibold">{title}</h2>}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ms-2 md:-ms-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <CarouselItem key={index} className="ps-4 basis-auto">
                    <CourseCardSkeleton className="lg:w-[26.5rem] w-[17rem] sm:w-[20rem] md:w-[23rem]" />
                  </CarouselItem>
                ))
              : courses.length > 0
              ? courses.map((course) => (
                  <CarouselItem key={course._id} className="ps-4 basis-auto">
                    <CourseCard
                      {...course}
                      className="lg:w-[26.5rem] w-[17rem] sm:w-[20rem] md:w-[23rem]"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
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
                <CourseCard key={course._id} {...course} />
              ))
            : null}
        </div>
      </div>
    );
  }

  return null;
};

export default CoursesSubsection;
