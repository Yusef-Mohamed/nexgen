"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ICoursePackage } from "@/types";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { useQuery } from "@tanstack/react-query";
import CategoryFilter from "./CategoryFilter";
import LearningPathsSubsection from "./LearningPathsSubsection";
import OneSidedContainer from "@/components/OneSidedContainer";
import SearchInput from "@/components/SearchInput";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/app/lib/utils";
import { usePathname, useRouter } from "@/i18n/routing";

interface OurLearningPathsProps {
  enableSearch?: boolean;
  gridClassName?: string;
}

const fetchLearningPathsByCategory = async (
  categoryId?: string,
  searchKeyword?: string
): Promise<ICoursePackage[]> => {
  try {
    // First get all learning paths, then filter by category on the client side
    // since learning paths don't have a direct category field
    let url = "/coursePackages?limit=50";
    if (searchKeyword) {
      url += `&keyword=${encodeURIComponent(searchKeyword)}`;
    }
    const response = await axiosInstance.get(url);
    const allLearningPaths = response.data.data as ICoursePackage[];

    if (!categoryId) {
      return allLearningPaths.slice(0, 10);
    }

    // Filter learning paths that contain courses from the selected category
    const filteredLearningPaths = allLearningPaths.filter((learningPath) =>
      learningPath.courses.some((course) => course.category?._id === categoryId)
    );

    return filteredLearningPaths.slice(0, 10);
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return [];
  }
};

const fetchPopularLearningPaths = async (): Promise<ICoursePackage[]> => {
  try {
    const url = "/coursePackages?sort=-ratingsQuantity&limit=20";
    const response = await axiosInstance.get(url);
    return response.data.data as ICoursePackage[];
  } catch (error) {
    console.error("Error fetching popular learning paths:", error);
    return [];
  }
};

const OurLearningPaths: React.FC<OurLearningPathsProps> = ({
  enableSearch = false,
  gridClassName = "",
}) => {
  const text = useTranslations("learningPaths");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
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

  const { data: learningPaths = [], isLoading: learningPathsLoading } =
    useQuery({
      queryKey: ["learningPaths", selectedCategory?._id, searchKeyword],
      queryFn: () =>
        fetchLearningPathsByCategory(selectedCategory?._id, searchKeyword),
      enabled: enableSearch ? true : !!selectedCategory,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });

  const {
    data: popularLearningPaths = [],
    isLoading: popularLearningPathsLoading,
  } = useQuery({
    queryKey: ["popularLearningPaths"],
    queryFn: () => fetchPopularLearningPaths(),
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
      <div className="container" ref={containerRef}>
        <h2 className="h2 !font-bold mb-6">
          {text("ourPopularLearningPaths")}
        </h2>

        {/* Search Bar */}
        {enableSearch && (
          <SearchInput
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder={text("searchLearningPaths")}
          />
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
          <LearningPathsSubsection
            learningPaths={learningPaths}
            loading={learningPathsLoading}
            theme={"grid"}
            title={selectedCategory ? getCategoryTitle() : undefined}
            gridClassName={gridClassName}
            onCategoryClick={(category) => {
              setSelectedCategory(category);
              containerRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>
      ) : (
        <OneSidedContainer>
          <LearningPathsSubsection
            learningPaths={learningPaths}
            loading={learningPathsLoading}
            theme={"carousel"}
            title={selectedCategory ? getCategoryTitle() : undefined}
            gridClassName={gridClassName}
            onCategoryClick={(category) => {
              setSelectedCategory(category);
              containerRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </OneSidedContainer>
      )}{" "}
      <OneSidedContainer>
        <LearningPathsSubsection
          learningPaths={popularLearningPaths}
          loading={popularLearningPathsLoading}
          theme={"carousel"}
          title={text("ourPopularLearningPaths")}
          onCategoryClick={(category) => {
            setSelectedCategory(category);
            containerRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </OneSidedContainer>
    </section>
  );
};

export default OurLearningPaths;
