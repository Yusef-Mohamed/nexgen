"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ICourse } from "@/types";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/app/lib/utils";
import CategoryFilter from "./CategoryFilter";
import CoursesSubsection from "./CoursesSubsection";
import OneSidedContainer from "@/components/OneSidedContainer";
import SearchInput from "@/components/SearchInput";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getDynamicString } from "@/lib/utils";
import SectionHeader from "@/components/SectionHeader";

interface OurCoursesProps {
  enableSearch?: boolean;
  gridClassName?: string;
  showAllCategories?: boolean;
}

const fetchCoursesByCategory = async (
  categoryId?: string,
  searchKeyword?: string,
): Promise<ICourse[]> => {
  try {
    let params = "?limit=10";

    if (categoryId) {
      params += `&category=${categoryId}`;
    }

    if (searchKeyword) {
      params += `&keyword=${encodeURIComponent(searchKeyword)}`;
    }
    console.log(`/courses${params}`);
    const response = await axiosInstance.get(`/courses${params}`);
    return response.data.data as ICourse[];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

const OurCourses: React.FC<OurCoursesProps> = ({
  enableSearch = false,
  gridClassName,
  showAllCategories = enableSearch,
}) => {
  const text = useTranslations("popularCourses");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentQueryString = searchParams?.toString() || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams?.get("keyword") || "",
  );

  const {
    categories,
    loading: categoriesLoading,
    selectedCategory,
    setSelectedCategory,
  } = useCategoryFilter(enableSearch, !showAllCategories);

  // Update URL search params when search keyword changes
  useEffect(() => {
    if (!enableSearch) return;

    const params = new URLSearchParams(currentQueryString);
    if (searchKeyword) {
      params.set("keyword", searchKeyword);
    } else {
      params.delete("keyword");
    }

    const nextQueryString = params.toString();
    if (nextQueryString === currentQueryString) return;

    const newUrl = nextQueryString
      ? `${pathname}?${nextQueryString}`
      : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchKeyword, currentQueryString, pathname, router, enableSearch]);

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", selectedCategory?._id, searchKeyword],
    queryFn: () => fetchCoursesByCategory(selectedCategory?._id, searchKeyword),
    enabled: showAllCategories && enableSearch ? true : !!selectedCategory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Generate localized title for the selected category
  const getCategoryTitle = () => {
    if (!selectedCategory) return undefined;
    return text("categoryTitle", {
      categoryName: getDynamicString(selectedCategory.title),
    });
  };
  return (
    <section className="py-12 space-y-8">
      <div className="container space-y-6" ref={containerRef}>
        <SectionHeader
          eyebrow={text("popularEyebrow")}
          heading={text("ourPopularCourses")}
          description={text("exploreOurPopularCourses")}
          tone="secondary"
        />

        {/* Search Bar */}
        {enableSearch && (
          <SearchInput
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder={text("searchCourses")}
          />
        )}

        <CategoryFilter
          className="mb-2"
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showAllButton={showAllCategories}
          loading={categoriesLoading}
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
            onCategoryClick={(category) => {
              setSelectedCategory(category);
              containerRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
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
            onCategoryClick={(category) => {
              setSelectedCategory(category);
              containerRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </OneSidedContainer>
      )}{" "}
    </section>
  );
};

export default OurCourses;
