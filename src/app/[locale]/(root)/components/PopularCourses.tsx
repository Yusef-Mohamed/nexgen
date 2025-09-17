"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/app/lib/utils";
import { ICourse } from "@/types";
import OneSidedContainer from "@/components/OneSidedContainer";
import CoursesSubsection from "./CoursesSubsection";

const getCourses = async (): Promise<ICourse[]> => {
  try {
    const coursesRes = await axiosInstance.get(
      `/courses?sort=-ratingsQuantity`
    );
    return coursesRes.data.data as ICourse[];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

const PopularCourses: React.FC<{ viewAll?: boolean }> = () => {
  const text = useTranslations("popularCourses");

  const { data: coursesData = [], isLoading } = useQuery({
    queryKey: ["popularCourses"],
    queryFn: () => getCourses(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <OneSidedContainer className="pb-8">
      <CoursesSubsection
        courses={coursesData}
        loading={isLoading}
        theme={"carousel"}
        title={text("ourPopularCourses")}
      />
    </OneSidedContainer>
  );
};

export default PopularCourses;
