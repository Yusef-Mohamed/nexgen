"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/app/lib/utils";
import { ICategory, ICourse, IPackage, ICoursePackage } from "@/types";
import { useDebounce } from "./useDebounce";
import { useSearchParams } from "next/navigation";

export type FilterType = "courses" | "learning-paths" | "services";
export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all";
export type PathLevels =
  | "beginnerToIntermediate"
  | "intermediateToAdvanced"
  | "beginnerToAdvanced"
  | "all";
export type Duration = "short" | "medium" | "long" | "all";
export type PriceRange = [number, number];

export interface AppliedFilter {
  type: string;
  label: string;
  value: string;
  avatar?: string;
}

export interface FilterState {
  category: string;
  level: CourseLevel | PathLevels;
  instructor: string;
  searchKeyword: string;
  duration?: Duration;
  priceRange?: PriceRange;
}

export interface Instructor {
  _id: string;
  name: string;
  profileImg: string;
}

export interface UseDashboardFiltersReturn {
  // State
  activeFilter: FilterType;
  filterState: FilterState;
  categories: ICategory[];
  instructors: Instructor[];

  // Data
  courses: ICourse[];
  packages: IPackage[];
  coursePackages: ICoursePackage[];

  // Loading states
  isLoadingCategories: boolean;
  isLoadingInstructors: boolean;
  isLoadingCourses: boolean;
  isLoadingPackages: boolean;
  isLoadingCoursePackages: boolean;

  // Filter handlers
  setActiveFilter: (filter: FilterType) => void;
  handleFilterChange: (
    key: keyof FilterState,
    value: string | PriceRange,
  ) => void;
  removeFilter: (filterType: string) => void;
  clearAllFilters: () => void;

  // Instructor search
  instructorSearchTerm: string;
  setInstructorSearchTerm: (term: string) => void;
  filteredInstructors: Instructor[];
  isInstructorDropdownOpen: boolean;
  setIsInstructorDropdownOpen: (open: boolean) => void;
}

// Fetch functions
const fetchCategories = async (): Promise<ICategory[]> => {
  const response = await axiosInstance("/categories");
  return response.data.data as ICategory[];
};

const fetchInstructors = async (): Promise<Instructor[]> => {
  const response = await axiosInstance("/users/instructors/withActiveCourses");
  return response.data.data as Instructor[];
};

const fetchCourses = async (filters: {
  category?: string;
  level?: string;
  instructor?: string;
  search?: string;
}): Promise<ICourse[]> => {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }
  if (filters.level && filters.level !== "all") {
    params.append("type", filters.level);
  }
  if (filters.instructor && filters.instructor !== "all") {
    params.append("instructor", filters.instructor);
  }
  if (filters.search) {
    params.append("keyword", filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `/courses?${queryString}` : "/courses";

  const response = await axiosInstance(url);
  return response.data.data as ICourse[];
};

const fetchPackages = async (filters: {
  category?: string;
  level?: string;
  instructor?: string;
  search?: string;
}): Promise<IPackage[]> => {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }
  if (filters.level && filters.level !== "all") {
    params.append("type", filters.level);
  }
  if (filters.instructor && filters.instructor !== "all") {
    params.append("instructor", filters.instructor);
  }
  if (filters.search) {
    params.append("keyword", filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `/packages?${queryString}` : "/packages";

  const response = await axiosInstance(url);
  return response.data.data as IPackage[];
};

const fetchCoursePackages = async (filters: {
  category?: string;
  level?: string;
  instructor?: string;
  search?: string;
}): Promise<ICoursePackage[]> => {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }
  if (filters.level && filters.level !== "all") {
    params.append("type", filters.level);
  }
  if (filters.instructor && filters.instructor !== "all") {
    params.append("instructor", filters.instructor);
  }
  if (filters.search) {
    params.append("keyword", filters.search);
  }

  const queryString = params.toString();
  const url = queryString
    ? `/coursePackages?${queryString}`
    : "/coursePackages";

  const response = await axiosInstance(url);
  return response.data.data as ICoursePackage[];
};

export const useDashboardFilters = (
  token: string | null,
): UseDashboardFiltersReturn => {
  const searchParams = useSearchParams();

  // State
  const [activeFilter, setActiveFilterState] = useState<FilterType>("courses");
  const [filterState, setFilterState] = useState<FilterState>({
    category: "all",
    level: "all",
    instructor: "all",
    searchKeyword: searchParams.get("search") || "",
  });

  const [isInstructorDropdownOpen, setIsInstructorDropdownOpen] =
    useState(false);
  const [instructorSearchTerm, setInstructorSearchTerm] = useState("");

  // Debounce search keyword
  const debouncedSearchKeyword = useDebounce(filterState.searchKeyword, 500);

  const setActiveFilter = useCallback((filter: FilterType) => {
    setActiveFilterState(filter);
    setFilterState((prev) => ({
      ...prev,
      level: "all",
    }));
  }, []);

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch instructors
  const { data: instructors = [], isLoading: isLoadingInstructors } = useQuery({
    queryKey: ["instructors"],
    queryFn: fetchInstructors,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch courses with filters
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: [
      "courses",
      filterState.category,
      filterState.level,
      filterState.instructor,
      debouncedSearchKeyword,
    ],
    queryFn: () =>
      fetchCourses({
        category: filterState.category,
        level: filterState.level,
        instructor: filterState.instructor,
        search: debouncedSearchKeyword,
      }),
    enabled: !!token && activeFilter === "courses",
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch packages with filters
  const { data: packages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: [
      "packages",
      filterState.category,
      filterState.level,
      filterState.instructor,
      debouncedSearchKeyword,
    ],
    queryFn: () =>
      fetchPackages({
        category: filterState.category,
        level: filterState.level,
        instructor: filterState.instructor,
        search: debouncedSearchKeyword,
      }),
    enabled: !!token && activeFilter === "services",
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch course packages with filters
  const { data: coursePackages = [], isLoading: isLoadingCoursePackages } =
    useQuery({
      queryKey: [
        "coursePackages",
        filterState.category,
        filterState.level,
        filterState.instructor,
        debouncedSearchKeyword,
      ],
      queryFn: () =>
        fetchCoursePackages({
          category: filterState.category,
          level: filterState.level,
          instructor: filterState.instructor,
          search: debouncedSearchKeyword,
        }),
      enabled: !!token && activeFilter === "learning-paths",
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    });

  // Filter change handler
  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string | PriceRange) => {
      setFilterState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  // Remove individual filter
  const removeFilter = useCallback((filterType: string) => {
    setFilterState((prev) => ({
      ...prev,
      [filterType]:
        filterType === "priceRange"
          ? [0, 1000]
          : filterType === "level"
            ? "all"
            : filterType === "duration"
              ? "all"
              : filterType === "category"
                ? "all"
                : filterType === "instructor"
                  ? "all"
                  : "",
    }));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilterState({
      category: "all",
      level: "all",
      instructor: "all",
      searchKeyword: "",
    });
  }, []);

  // Filtered instructors based on search term
  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name
      ?.toLowerCase()
      .includes(instructorSearchTerm?.toLowerCase()),
  );

  return {
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
    isLoadingInstructors,
    isLoadingCourses,
    isLoadingPackages,
    isLoadingCoursePackages,

    // Filter handlers
    setActiveFilter,
    handleFilterChange,
    removeFilter,
    clearAllFilters,

    // Instructor search
    instructorSearchTerm,
    setInstructorSearchTerm,
    filteredInstructors,
    isInstructorDropdownOpen,
    setIsInstructorDropdownOpen,
  };
};
