"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/app/lib/utils";
import { ICoursePackage } from "@/types";
import OneSidedContainer from "@/components/OneSidedContainer";
import LearningPathsSubsection from "./LearningPathsSubsection";

const getPopularLearningPaths = async (): Promise<ICoursePackage[]> => {
  try {
    const res = await axiosInstance.get(
      `/coursePackages?sort=-ratingsQuantity&limit=20`
    );
    return res.data.data as ICoursePackage[];
  } catch (error) {
    console.error("Error fetching popular learning paths:", error);
    return [];
  }
};

const PopularLearningPaths: React.FC = () => {
  const text = useTranslations("learningPaths");

  const { data: learningPaths = [], isLoading } = useQuery({
    queryKey: ["popularLearningPaths"],
    queryFn: getPopularLearningPaths,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <OneSidedContainer className="pb-8">
      <LearningPathsSubsection
        learningPaths={learningPaths}
        loading={isLoading}
        theme={"carousel"}
        title={text("ourPopularLearningPaths")}
      />
    </OneSidedContainer>
  );
};

export default PopularLearningPaths;
