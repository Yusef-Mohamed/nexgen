"use client";

import CoursesSubsection from "@/app/[locale]/(root)/components/CoursesSubsection";
import LearningPathsSubsection from "@/app/[locale]/(root)/components/LearningPathsSubsection";
import ServicesSubsection from "@/app/[locale]/(root)/components/ServicesSubsection";
import { ICourse, IPackage, ICoursePackage, ICategory } from "@/types";

interface FilteredDataGridProps {
  courses: ICourse[];
  packages: IPackage[];
  coursePackages: ICoursePackage[];
  isLoadingCourses: boolean;
  isLoadingPackages: boolean;
  isLoadingCoursePackages: boolean;
  activeFilter: "courses" | "learning-paths" | "services";
  onCategoryClick?: (category: ICategory) => void;
}

export const FilteredDataGrid: React.FC<FilteredDataGridProps> = ({
  courses,
  packages,
  coursePackages,
  isLoadingCourses,
  isLoadingPackages,
  isLoadingCoursePackages,
  activeFilter,
  onCategoryClick,
}) => {
  if (activeFilter === "courses")
    return (
      <CoursesSubsection
        courses={courses}
        loading={isLoadingCourses}
        theme="grid"
        gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
        cardClassName="border-primary/10 shadow-none"
        onCategoryClick={onCategoryClick}
      />
    );
  if (activeFilter === "learning-paths")
    return (
      <LearningPathsSubsection
        learningPaths={coursePackages}
        loading={isLoadingCoursePackages}
        theme="grid"
        gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
        cardClassName="border-primary/10 shadow-none"
        onCategoryClick={onCategoryClick}
      />
    );
  if (activeFilter === "services")
    return (
      <ServicesSubsection
        services={packages}
        loading={isLoadingPackages}
        theme="grid"
        gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
        cardClassName="border-primary/10 shadow-none"
        onCategoryClick={onCategoryClick}
      />
    );
  return null;
};
