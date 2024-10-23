import React from "react";
import CourseCard from "../../../../components/cards/CourseCard";
import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICourse } from "@/types";
import GridSection from "@/components/GridSection";
const PopularCourses: React.FC = async () => {
  const text = await getTranslations("popularCourses");
  const axiosInstance = createServerAxiosInstance();
  const coursesRes = await axiosInstance.get(
    "/courses?sort=-ratingsQuantity&limit=3"
  );
  const coursesData = coursesRes.data.data as ICourse[];
  return (
    <GridSection
      heading={text("exploreOurPopularCourses")}
      button={text("exploreAllCourses")}
      href="/courses"
    >
      {coursesData.map((course, index) => (
        <CourseCard key={index} {...course} />
      ))}
    </GridSection>
  );
};

export default PopularCourses;
