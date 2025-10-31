"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICategory } from "@/types";
import {
  FilterType,
  CourseLevel,
  PathLevels,
} from "@/hooks/useDashboardFilters";

interface AppliedFilter {
  type: string;
  label: string;
  value: string;
  avatar?: string;
}

interface AppliedFiltersDisplayProps {
  filterState: {
    category: string;
    level: CourseLevel | PathLevels;
    instructor: string;
    searchKeyword: string;
  };
  activeFilter: FilterType;
  categories: ICategory[];
  instructors: Array<{
    _id: string;
    name: string;
    profileImg: string;
  }>;
  onRemoveFilter: (filterType: string) => void;
  text: (key: string) => string;
}

export const AppliedFiltersDisplay: React.FC<AppliedFiltersDisplayProps> = ({
  filterState,
  activeFilter,
  categories,
  instructors,
  onRemoveFilter,
  text,
}) => {
  // Create applied filters from current filter state
  const getAppliedFilters = (): AppliedFilter[] => {
    const appliedFilters: AppliedFilter[] = [];

    if (filterState.category && filterState.category !== "all") {
      const category = categories.find((c) => c._id === filterState.category);
      if (category) {
        appliedFilters.push({
          type: "category",
          label: category.title,
          value: filterState.category,
        });
      }
    }

    if (filterState.level && filterState.level !== "all") {
      let levelLabel = "";
      if (activeFilter === "courses") {
        levelLabel =
          filterState.level.charAt(0).toUpperCase() +
          filterState.level.slice(1);
      } else if (activeFilter === "learning-paths") {
        switch (filterState.level) {
          case "beginnerToIntermediate":
            levelLabel = text("beginnerToIntermediate");
            break;
          case "intermediateToAdvanced":
            levelLabel = text("intermediateToAdvanced");
            break;
          case "beginnerToAdvanced":
            levelLabel = text("beginnerToAdvanced");
            break;
          default:
            levelLabel = filterState.level;
        }
      }

      appliedFilters.push({
        type: "level",
        label: levelLabel,
        value: filterState.level,
      });
    }

    if (filterState.instructor && filterState.instructor !== "all") {
      const instructor = instructors.find(
        (i) => i._id === filterState.instructor
      );
      if (instructor) {
        appliedFilters.push({
          type: "instructor",
          label: instructor.name,
          value: filterState.instructor,
          avatar: instructor.profileImg,
        });
      }
    }

    if (filterState.searchKeyword && filterState.searchKeyword.trim() !== "") {
      appliedFilters.push({
        type: "searchKeyword",
        label: `"${filterState.searchKeyword}"`,
        value: filterState.searchKeyword,
      });
    }

    return appliedFilters;
  };

  const appliedFilters = getAppliedFilters();

  if (appliedFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {appliedFilters.map((filter, index) => (
        <div
          key={`${filter.type}-${index}`}
          className="flex items-center border rounded-full border-primary text-primary bg-primary/10 gap-2 px-3 py-2"
        >
          {filter.avatar && (
            <Image
              src={filter.avatar}
              alt={filter.label}
              width={16}
              height={16}
              className="w-4 h-4 rounded-full object-cover"
            />
          )}
          <span className="text-xs">{filter.label}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter(filter.type)}
            className="h-auto text-foreground p-0 ml-1 hover:bg-transparent"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};
