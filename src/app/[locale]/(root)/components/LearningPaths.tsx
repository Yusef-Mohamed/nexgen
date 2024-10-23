import React from "react";
import LearningPath from "./LearningPath";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { getTranslations } from "next-intl/server";
import { ICoursePackage } from "@/types";
import GridSection from "@/components/GridSection";

const LearningPaths: React.FC = async () => {
  const text = await getTranslations("learningPaths");
  const axiosInstance = createServerAxiosInstance();
  const coursePackagesRes = await axiosInstance.get("/coursePackages");
  const coursePackages = coursePackagesRes.data.data as ICoursePackage[];
  return (
    <GridSection heading={text("heading")}>
      {coursePackages.map((_package, index) => (
        <LearningPath key={index} {..._package} />
      ))}
    </GridSection>
  );
};

export default LearningPaths;
