"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import OurCourses from "./OurCourses";
import OurLearningPaths from "./OurLearningPaths";
import OurServices from "./OurServices";
import { cn } from "@/lib/utils";

type FilterType = "courses" | "learning-paths" | "services";

interface FilterTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-6 py-3 rounded-full font-medium transition-all duration-300 border-2",
      isActive
        ? "bg-primary text-white border-primary shadow-lg"
        : "bg-transparent text-foreground border-border hover:border-primary hover:text-primary"
    )}
  >
    {label}
  </button>
);

const CoursesFilterContent: React.FC = () => {
  const text = useTranslations("coursesPage");
  const [activeFilter, setActiveFilter] = useState<FilterType>("courses");

  const renderContent = () => {
    switch (activeFilter) {
      case "courses":
        return <OurCourses enableSearch={true} />;
      case "learning-paths":
        return <OurLearningPaths enableSearch={true} />;
      case "services":
        return <OurServices enableSearch={true} />;
      default:
        return <OurCourses enableSearch={true} />;
    }
  };

  return (
    <>
      {/* Filter Tabs Section */}
      <section className="container py-8">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <FilterTab
            label={text("courses") || "Courses"}
            isActive={activeFilter === "courses"}
            onClick={() => setActiveFilter("courses")}
          />
          <FilterTab
            label={text("learningPaths") || "Learning Paths"}
            isActive={activeFilter === "learning-paths"}
            onClick={() => setActiveFilter("learning-paths")}
          />
          <FilterTab
            label={text("services") || "Services"}
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
