"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import OurCourses from "./OurCourses";
import OurLearningPaths from "./OurLearningPaths";
import OurServices from "./OurServices";
import { Button } from "@/components/ui/button";

type FilterType = "courses" | "learning-paths" | "services";

interface FilterTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ label, isActive, onClick }) => (
  <Button
    onClick={onClick}
    variant={isActive ? "default" : "outline"}
    size="old"
    className="rounded-full font-medium grow transition-all duration-300 h-12! text-base"
  >
    {label}
  </Button>
);

const CoursesFilterContent: React.FC = () => {
  const text = useTranslations("coursesPage");
  const [activeFilter, setActiveFilter] = useState<FilterType>("courses");

  const renderContent = () => {
    switch (activeFilter) {
      case "courses":
        return (
          <OurCourses
            enableSearch={true}
            showAllCategories={false}
            gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          />
        );
      case "learning-paths":
        return (
          <OurLearningPaths
            enableSearch={true}
            showAllCategories={false}
            gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          />
        );
      case "services":
        return (
          <OurServices
            enableSearch={true}
            showAllCategories={false}
            gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          />
        );
      default:
        return (
          <OurCourses
            enableSearch={true}
            showAllCategories={false}
            gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          />
        );
    }
  };

  return (
    <>
      {/* Filter Tabs Section */}
      <section className="container py-8 pb-0">
        <div className="flex flex-wrap gap-2">
          <FilterTab
            label={text("courses")}
            isActive={activeFilter === "courses"}
            onClick={() => setActiveFilter("courses")}
          />
          <FilterTab
            label={text("learningPaths")}
            isActive={activeFilter === "learning-paths"}
            onClick={() => setActiveFilter("learning-paths")}
          />
          <FilterTab
            label={text("services")}
            isActive={activeFilter === "services"}
            onClick={() => setActiveFilter("services")}
          />
        </div>
      </section>

      {/* Dynamic Content Based on Filter */}
      {renderContent()}
    </>
  );
};

export default CoursesFilterContent;
