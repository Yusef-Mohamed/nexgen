"use client";

import React from "react";
import LearningPath, { LearningPathSkeleton } from "./LearningPath";
import { ICoursePackage } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface LearningPathsSubsectionProps {
  gridClassName?: string;
  learningPaths: ICoursePackage[];
  loading: boolean;
  theme?: "carousel" | "grid";
  title?: string;
  cardClassName?: string;
}

const LearningPathsSubsection: React.FC<LearningPathsSubsectionProps> = ({
  gridClassName,
  learningPaths,
  loading,
  theme = "carousel",
  title,
  cardClassName,
}) => {
  const text = useTranslations("learningPaths");

  if (learningPaths.length === 0) {
    return (
      <div className="relative">
        {title && <h2 className="mb-6 capitalize">{title}</h2>}
        <h3 className="pt-8 pb-12 text-text-2 text-center">
          {text("noLearningPaths")}
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
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ms-2 md:-ms-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <CarouselItem key={index} className="ps-4 basis-auto">
                    <LearningPathSkeleton
                      className={cn(
                        "lg:w-[26.5rem] w-[17rem] sm:w-[20rem] md:w-[23rem]",
                        cardClassName
                      )}
                    />
                  </CarouselItem>
                ))
              : learningPaths.length > 0
              ? learningPaths.map((learningPath) => (
                  <CarouselItem
                    key={learningPath._id}
                    className="ps-4 basis-auto "
                  >
                    <LearningPath
                      {...learningPath}
                      className={cn(
                        "lg:w-[26.5rem] w-[17rem] sm:w-[20rem] md:w-[23rem]",
                        cardClassName
                      )}
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
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            gridClassName
          )}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <LearningPathSkeleton key={index} className={cardClassName} />
              ))
            : learningPaths.length > 0
            ? learningPaths.map((learningPath) => (
                <LearningPath
                  key={learningPath._id}
                  {...learningPath}
                  className={cardClassName}
                />
              ))
            : null}
        </div>
      </div>
    );
  }

  return null;
};

export default LearningPathsSubsection;
