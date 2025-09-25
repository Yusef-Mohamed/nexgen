"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { useDashboardFilters, FilterType } from "@/hooks/useDashboardFilters";
import { FilterTabs, FilterOption } from "@/components/filters/FilterTabs";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { LevelFilter } from "@/components/filters/LevelFilter";
import { InstructorFilter } from "@/components/filters/InstructorFilter";
import { FilteredDataGrid } from "@/components/filters/FilteredDataGrid";
import { AppliedFiltersDisplay } from "@/components/filters/AppliedFiltersDisplay";
import HomeCourses from "./HomeCourses";

const DashboardHomeClient: React.FC = () => {
  const text = useTranslations("dashboard");
  const { token } = useAuth();

  const {
    // State
    activeFilter,
    filterState,
    categories,
    instructors,

    // Data
    courses,
    packages,
    coursePackages,

    // Loading states
    isLoadingCategories,
    isLoadingCourses,
    isLoadingPackages,
    isLoadingCoursePackages,

    // Filter handlers
    setActiveFilter,
    handleFilterChange,
    removeFilter,

    // Instructor search
    instructorSearchTerm,
    setInstructorSearchTerm,
    filteredInstructors,
    isInstructorDropdownOpen,
    setIsInstructorDropdownOpen,
  } = useDashboardFilters(token);

  // Filter tabs configuration
  const filterOptions: FilterOption[] = [
    { value: "courses", label: text("courses") },
    { value: "learning-paths", label: text("learningPaths") },
    { value: "services", label: text("services") },
  ];

  return (
    <div className="w-full space-y-6 container py-8">
      <HomeCourses />

      <FilterTabs
        options={filterOptions}
        activeValue={activeFilter}
        onChange={(value) => setActiveFilter(value as FilterType)}
      />
      {/* Advanced Filters */}
      <div className="bg-card cardShadow rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <CategoryFilter
            value={filterState.category}
            onChange={(value) => handleFilterChange("category", value)}
            categories={categories}
            label={text("category")}
            allCategoriesLabel={text("allCategories")}
            isLoading={isLoadingCategories}
          />

          <LevelFilter
            value={filterState.level}
            onChange={(value) => handleFilterChange("level", value)}
            activeFilter={activeFilter}
            label={text("level")}
            allLevelsLabel={text("allLevels")}
            beginnerLabel={text("beginner")}
            intermediateLabel={text("intermediate")}
            advancedLabel={text("advanced")}
            beginnerToIntermediateLabel={text("beginnerToIntermediate")}
            intermediateToAdvancedLabel={text("intermediateToAdvanced")}
            beginnerToAdvancedLabel={text("beginnerToAdvanced")}
          />

          <InstructorFilter
            value={filterState.instructor}
            onChange={(value) => handleFilterChange("instructor", value)}
            instructors={instructors}
            filteredInstructors={filteredInstructors}
            instructorSearchTerm={instructorSearchTerm}
            onSearchTermChange={setInstructorSearchTerm}
            isOpen={isInstructorDropdownOpen}
            onOpenChange={setIsInstructorDropdownOpen}
            label={text("instructor")}
            searchForInstructorLabel={text("searchForInstructor")}
            allInstructorsLabel={text("allInstructors")}
          />
        </div>

        <AppliedFiltersDisplay
          filterState={filterState}
          activeFilter={activeFilter}
          categories={categories}
          instructors={instructors}
          onRemoveFilter={removeFilter}
          text={text}
        />
      </div>

      {/* Content Section */}
      <FilteredDataGrid
        courses={courses}
        packages={packages}
        coursePackages={coursePackages}
        isLoadingCourses={isLoadingCourses}
        isLoadingPackages={isLoadingPackages}
        isLoadingCoursePackages={isLoadingCoursePackages}
        activeFilter={activeFilter}
      />
    </div>
  );
};

export default DashboardHomeClient;
