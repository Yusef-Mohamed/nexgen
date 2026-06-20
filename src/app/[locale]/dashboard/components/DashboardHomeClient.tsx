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
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import DashboardContainer from "./DashboardContainer";
import { BookOpen, Filter, Search, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/hooks/useDashboardFilters";

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
  const ref = useRef<HTMLDivElement>(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [draftFilterState, setDraftFilterState] =
    useState<FilterState>(filterState);

  const handleFilterDialogOpenChange = (open: boolean) => {
    if (open) setDraftFilterState(filterState);
    setIsFilterDialogOpen(open);
  };

  const handleDraftFilterChange = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState],
  ) => {
    setDraftFilterState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCancelFilters = () => {
    setDraftFilterState(filterState);
    setIsFilterDialogOpen(false);
  };

  const handleApplyFilters = () => {
    handleFilterChange("searchKeyword", draftFilterState.searchKeyword);
    handleFilterChange("category", draftFilterState.category);
    handleFilterChange("level", draftFilterState.level);
    handleFilterChange("instructor", draftFilterState.instructor);
    setIsFilterDialogOpen(false);
  };

  return (
    <DashboardContainer className="w-full py-6 sm:py-8">
      <div className="space-y-6" ref={ref}>
        <HomeCourses />

        <section className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground">
          <div className="border-b border-primary/10 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
                  <BookOpen className="size-5" />
                </span>
                <div>
                  <h2 className="text-base font-black text-text-1 sm:text-lg">
                    {text("courses")}
                  </h2>
                  <p className="mt-1 text-sm text-text-3">
                    {text("searchCoursesOrEvents")}
                  </p>
                </div>
              </div>

              <FilterTabs
                flat
                options={filterOptions}
                activeValue={activeFilter}
                onChange={(value) => setActiveFilter(value as FilterType)}
              />
            </div>
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background-2 p-3 lg:flex-row lg:items-center lg:justify-between">
              <button
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary/10 bg-clear-ground px-4 text-sm font-bold text-text-2 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                onClick={() => handleFilterDialogOpenChange(true)}
                type="button"
              >
                <SlidersHorizontal className="size-4" />
                {text("advancedFilters")}
              </button>

              <div className="min-w-0 flex-1 lg:flex lg:justify-end">
                <AppliedFiltersDisplay
                  filterState={filterState}
                  activeFilter={activeFilter}
                  categories={categories}
                  instructors={instructors}
                  onRemoveFilter={removeFilter}
                  text={text}
                  variant="inline"
                />
              </div>
            </div>

            <FilteredDataGrid
              courses={courses}
              packages={packages}
              coursePackages={coursePackages}
              isLoadingCourses={isLoadingCourses}
              isLoadingPackages={isLoadingPackages}
              isLoadingCoursePackages={isLoadingCoursePackages}
              activeFilter={activeFilter}
              onCategoryClick={(category) => {
                handleFilterChange("category", category._id);
                ref.current?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </section>
      </div>

      <Dialog
        open={isFilterDialogOpen}
        onOpenChange={handleFilterDialogOpenChange}
      >
        <DialogContent
          isOpen={isFilterDialogOpen}
          className="max-h-[90vh] overflow-y-auto rounded-2xl border-primary/10 bg-clear-ground p-0 shadow-none sm:max-w-xl"
        >
          <DialogHeader className="border-b border-primary/10 px-5 py-4">
            <DialogTitle className="flex items-center gap-2 text-base font-black text-text-1">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Filter className="size-4" />
              </span>
              {text("advancedFilters")}
            </DialogTitle>
            <DialogDescription className="text-sm text-text-3">
              {text("searchCoursesOrEvents")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-text-3" />
              <Input
                value={draftFilterState.searchKeyword}
                className="h-12 w-full rounded-xl border-primary/10 bg-background-2 ps-10 text-sm font-semibold text-text-2 shadow-none placeholder:text-text-3"
                onChange={(e) =>
                  handleDraftFilterChange("searchKeyword", e.target.value)
                }
                placeholder={text("searchWithKeyword")}
              />
            </div>

            <CategoryFilter
              value={draftFilterState.category}
              onChange={(value) => handleDraftFilterChange("category", value)}
              categories={categories}
              label={text("category")}
              allCategoriesLabel={text("allCategories")}
              isLoading={isLoadingCategories}
            />

            <LevelFilter
              value={draftFilterState.level}
              onChange={(value) => handleDraftFilterChange("level", value)}
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
              value={draftFilterState.instructor}
              onChange={(value) => handleDraftFilterChange("instructor", value)}
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

          <div className="flex flex-col-reverse gap-2 border-t border-primary/10 p-5 sm:flex-row sm:justify-end">
            <Button
              className="h-11 rounded-xl border-primary/10 bg-clear-ground px-5 text-sm font-bold text-text-2 shadow-none hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              onClick={handleCancelFilters}
              size="old"
              type="button"
              variant="outline"
            >
              {text("cancel")}
            </Button>
            <Button
              className="h-11 rounded-xl px-5 text-sm font-bold"
              onClick={handleApplyFilters}
              size="old"
              type="button"
              variant="primary"
            >
              {text("applyFilters")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  );
};

export default DashboardHomeClient;
