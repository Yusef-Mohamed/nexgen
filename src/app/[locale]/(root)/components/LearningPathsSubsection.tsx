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

interface LearningPathsSubsectionProps {
  learningPaths: ICoursePackage[];
  loading: boolean;
  theme?: "carousel" | "grid";
  title?: string;
}

const LearningPathsSubsection: React.FC<LearningPathsSubsectionProps> = ({
  learningPaths,
  loading,
  theme = "carousel",
  title,
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
                    <LearningPathSkeleton className="lg:w-[26.5rem] w-[17rem] sm:w-[20rem] md:w-[23rem]" />
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
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <LearningPathSkeleton key={index} />
              ))
            : learningPaths.length > 0
            ? learningPaths.map((learningPath) => (
                <LearningPath key={learningPath._id} {...learningPath} />
              ))
            : null}
        </div>
      </div>
    );
  }

  return null;
};

export default LearningPathsSubsection;
