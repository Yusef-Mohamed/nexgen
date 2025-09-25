"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ICourse } from "@/types";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/app/lib/utils";
import CategoryFilter from "./CategoryFilter";
import CoursesSubsection from "./CoursesSubsection";
import OneSidedContainer from "@/components/OneSidedContainer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";

interface OurCoursesProps {
  enableSearch?: boolean;
  gridClassName?: string;
}

const fetchCoursesByCategory = async (
  categoryId?: string,
  searchKeyword?: string
): Promise<ICourse[]> => {
  try {
    let params = "?limit=10";

    if (categoryId) {
      params += `&category=${categoryId}`;
    }

    if (searchKeyword) {
      params += `&keyword=${encodeURIComponent(searchKeyword)}`;
    }

    const response = await axiosInstance.get(`/courses${params}`);
    return response.data.data as ICourse[];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

const fetchPopularCourses = async (): Promise<ICourse[]> => {
  try {
    const params = "?sort=-ratingsQuantity&limit=20";

    const response = await axiosInstance.get(`/courses${params}`);
    return response.data.data as ICourse[];
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    return [];
  }
};

const OurCourses: React.FC<OurCoursesProps> = ({
  enableSearch = false,
  gridClassName,
}) => {
  const text = useTranslations("popularCourses");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchKeyword, setSearchKeyword] = useState(
    searchParams?.get("keyword") || ""
  );

  const {
    categories,
    loading: categoriesLoading,
    selectedCategory,
    setSelectedCategory,
  } = useCategoryFilter(enableSearch);

  // Update URL search params when search keyword changes
  useEffect(() => {
    if (!enableSearch) return;

    const params = new URLSearchParams(searchParams?.toString());
    if (searchKeyword) {
      params.set("keyword", searchKeyword);
    } else {
      params.delete("keyword");
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [searchKeyword, searchParams, pathname, router, enableSearch]);

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", selectedCategory?._id, searchKeyword],
    queryFn: () => fetchCoursesByCategory(selectedCategory?._id, searchKeyword),
    enabled: enableSearch ? true : !!selectedCategory, // Always enabled in search mode
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: popularCourses = [], isLoading: popularCoursesLoading } =
    useQuery({
      queryKey: ["popularCourses"],
      queryFn: () => fetchPopularCourses(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });

  // Generate localized title for the selected category
  const getCategoryTitle = () => {
    if (!selectedCategory) return undefined;
    return text("categoryTitle", { categoryName: selectedCategory.title });
  };

  return (
    <section className="py-12 space-y-8">
      <div className="container">
        <h2 className="h2 !font-bold mb-6">{text("ourPopularCourses")}</h2>

        {/* Search Bar */}
        {enableSearch && (
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={text("searchCourses") || "Search courses..."}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <CategoryFilter
          className="mb-8"
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showAllButton={true}
          loading={categoriesLoading}
          enableSearch={enableSearch}
        />
      </div>
      {enableSearch ? (
        <div className="container">
          <CoursesSubsection
            courses={courses}
            loading={coursesLoading}
            theme={"grid"}
            title={getCategoryTitle()}
            gridClassName={gridClassName}
          />
        </div>
      ) : (
        <OneSidedContainer>
          <CoursesSubsection
            courses={courses}
            loading={coursesLoading}
            theme={"carousel"}
            title={getCategoryTitle()}
            gridClassName={gridClassName}
          />
        </OneSidedContainer>
      )}{" "}
      <OneSidedContainer>
        <CoursesSubsection
          courses={popularCourses}
          loading={popularCoursesLoading}
          theme={"carousel"}
          title={text("ourPopularCourses")}
        />
      </OneSidedContainer>
    </section>
  );
};

export default OurCourses;
