import React from "react";
import CourseCard from "../../../../components/cards/CourseCard";
import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICourse } from "@/types";
import GridSection from "@/components/GridSection";
const PopularCourses: React.FC<{ viewAll?: boolean }> = async ({ viewAll }) => {
  const text = await getTranslations("popularCourses");
  const axiosInstance = createServerAxiosInstance();
  const coursesRes = await axiosInstance.get(
    `/courses?sort=-ratingsQuantity${viewAll ? "" : "&limit=3"}`
  );
  const coursesData = coursesRes.data.data as ICourse[];
  return (
    <GridSection
      id="courses-section"
      heading={
        viewAll ? text("ourPopularCourses") : text("exploreOurPopularCourses")
      }
      button={!viewAll ? text("exploreAllCourses") : ""}
      href="/courses#courses-section"
    >
      {coursesData.map((course, index) => (
        <CourseCard key={index} {...course} />
      ))}
    </GridSection>
  );
};

export default PopularCourses;
