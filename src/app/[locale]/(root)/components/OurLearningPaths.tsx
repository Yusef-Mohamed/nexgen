"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ICoursePackage } from "@/types";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { useQuery } from "@tanstack/react-query";
import { createClientAxiosInstance } from "@/app/lib/utils";
import CategoryFilter from "./CategoryFilter";
import LearningPathsSubsection from "./LearningPathsSubsection";
import OneSidedContainer from "@/components/OneSidedContainer";

const fetchLearningPathsByCategory = async (
  categoryId?: string
): Promise<ICoursePackage[]> => {
  try {
    const axiosInstance = createClientAxiosInstance();
    // First get all learning paths, then filter by category on the client side
    // since learning paths don't have a direct category field
    const response = await axiosInstance.get("/coursePackages?limit=50");
    const allLearningPaths = response.data.data as ICoursePackage[];

    if (!categoryId) {
      return allLearningPaths.slice(0, 10);
    }

    // Filter learning paths that contain courses from the selected category
    const filteredLearningPaths = allLearningPaths.filter((learningPath) =>
      learningPath.courses.some((course) => course.category?._id === categoryId)
    );

    return filteredLearningPaths.slice(0, 10);
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return [];
  }
};

const fetchAllLearningPaths = async (): Promise<ICoursePackage[]> => {
  try {
    const axiosInstance = createClientAxiosInstance();
    const response = await axiosInstance.get("/coursePackages?limit=20");
    return response.data.data as ICoursePackage[];
  } catch (error) {
    console.error("Error fetching all learning paths:", error);
    return [];
  }
};

const OurLearningPaths: React.FC = () => {
  const text = useTranslations("learningPaths");
  const {
    categories,
    loading: categoriesLoading,
    selectedCategory,
    setSelectedCategory,
  } = useCategoryFilter();

  const { data: learningPaths = [], isLoading: learningPathsLoading } =
    useQuery({
      queryKey: ["learningPaths", selectedCategory?._id],
      queryFn: () => fetchLearningPathsByCategory(selectedCategory?._id),
      enabled: true, // Always enabled to handle "All" category
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });

  const { data: allLearningPaths = [], isLoading: allLearningPathsLoading } =
    useQuery({
      queryKey: ["allLearningPaths"],
      queryFn: fetchAllLearningPaths,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });

  // Generate localized title for the selected category
  const getCategoryTitle = () => {
    if (!selectedCategory) return undefined;
    return text("categoryTitle", { categoryName: selectedCategory.title });
  };

  return (
    <section className="py-12">
      <div className="mb-8 container">
        <h2 className="h1-5 font-bold mb-6">
          {text("ourPopularLearningPaths")}
        </h2>
        <CategoryFilter
          className="mb-8"
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showAllButton={true}
          loading={categoriesLoading}
        />
      </div>

      <OneSidedContainer>
        <LearningPathsSubsection
          learningPaths={learningPaths}
          loading={learningPathsLoading}
          theme="carousel"
          title={selectedCategory ? getCategoryTitle() : undefined}
        />
      </OneSidedContainer>

      <OneSidedContainer>
        <LearningPathsSubsection
          learningPaths={allLearningPaths}
          loading={allLearningPathsLoading}
          theme="carousel"
          title={text("allLearningPaths")}
        />
      </OneSidedContainer>
    </section>
  );
};

export default OurLearningPaths;
