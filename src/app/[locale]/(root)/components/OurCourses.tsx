"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ICourse } from "@/types";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { useQuery } from "@tanstack/react-query";
import { createClientAxiosInstance } from "@/app/lib/utils";
import CategoryFilter from "./CategoryFilter";
import CoursesSubsection from "./CoursesSubsection";
import OneSidedContainer from "@/components/OneSidedContainer";

const fetchCoursesByCategory = async (
  categoryId?: string
): Promise<ICourse[]> => {
  try {
    const axiosInstance = createClientAxiosInstance();
    const params = categoryId
      ? `?category=${categoryId}&limit=10`
      : "?limit=10";
    const response = await axiosInstance.get(`/courses${params}`);
    return response.data.data as ICourse[];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

const fetchAllCourses = async (): Promise<ICourse[]> => {
  try {
    const axiosInstance = createClientAxiosInstance();
    const response = await axiosInstance.get("/courses?limit=20");
    return response.data.data as ICourse[];
  } catch (error) {
    console.error("Error fetching all courses:", error);
    return [];
  }
};

const OurCourses: React.FC = () => {
  const text = useTranslations("popularCourses");
  const {
    categories,
    loading: categoriesLoading,
    selectedCategory,
    setSelectedCategory,
  } = useCategoryFilter();

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", selectedCategory?._id],
    queryFn: () => fetchCoursesByCategory(selectedCategory?._id),
    enabled: !!selectedCategory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: allCourses = [], isLoading: allCoursesLoading } = useQuery({
    queryKey: ["allCourses"],
    queryFn: fetchAllCourses,
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
        <h2 className="h1-5 font-bold mb-6">{text("ourPopularCourses")}</h2>
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
        <CoursesSubsection
          courses={courses}
          loading={coursesLoading}
          theme="carousel"
          title={getCategoryTitle()}
        />
      </OneSidedContainer>
      <OneSidedContainer>
        <CoursesSubsection
          courses={allCourses}
          loading={allCoursesLoading}
          theme="carousel"
          title={text("allCourses")}
        />
      </OneSidedContainer>
    </section>
  );
};

export default OurCourses;
