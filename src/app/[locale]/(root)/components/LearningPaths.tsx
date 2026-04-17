import React from "react";
import LearningPath from "./LearningPath";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { getLocale, getTranslations } from "next-intl/server";
import { ICoursePackage } from "@/types";
import GridSection from "@/components/GridSection";

const LearningPaths: React.FC<{ viewAll?: boolean }> = async ({ viewAll }) => {
  const text = await getTranslations("learningPaths");
  const locale = await getLocale();
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: locale,
  });
  const coursePackagesRes = await axiosInstance.get(
    `/coursePackages${viewAll ? "" : "?limit=3"}`,
  );
  const coursePackages = coursePackagesRes.data.data as ICoursePackage[];
  return (
    <GridSection
      id="learning-paths-section"
      heading={text("heading")}
      button={!viewAll ? text("exploreAllPaths") : ""}
      href="/courses#learning-paths-section"
    >
      {coursePackages.map((_package, index) => (
        <LearningPath key={index} {..._package} />
      ))}
    </GridSection>
  );
};

export default LearningPaths;
