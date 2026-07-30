"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ICategory, IPackage } from "@/types";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import ServicesSubsection from "./ServicesSubsection";
import OneSidedContainer from "@/components/OneSidedContainer";
import { axiosInstance } from "@/app/lib/utils";
import CategoryFilter from "./CategoryFilter";
import SearchInput from "@/components/SearchInput";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getDynamicString } from "@/lib/utils";
import SectionHeader from "@/components/SectionHeader";

interface OurServicesProps {
  enableSearch?: boolean;
  gridClassName?: string;
  showAllCategories?: boolean;
  onCategoryClick?: (category: ICategory) => void;
}

// Function to fetch services by category (server-side filter)
const fetchServicesByCategory = async (
  categoryId?: string,
  searchKeyword?: string,
): Promise<IPackage[]> => {
  const params = new URLSearchParams();
  params.set("limit", "50");
  if (categoryId) {
    params.set("category", categoryId);
  }
  if (searchKeyword) {
    params.set("keyword", searchKeyword);
  }
  const response = await axiosInstance.get(`/packages?${params.toString()}`);
  return response.data.data as IPackage[];
};

const OurServices: React.FC<OurServicesProps> = ({
  enableSearch = false,
  gridClassName = "",
  showAllCategories = enableSearch,
  onCategoryClick,
}) => {
  const text = useTranslations("services");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentQueryString = searchParams?.toString() || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams?.get("keyword") || "",
  );

  // Get categories and selected category from the hook
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    loading: categoriesLoading,
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

  // Fetch services filtered by category
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["services", selectedCategory?._id, searchKeyword],
    queryFn: () =>
      fetchServicesByCategory(selectedCategory?._id, searchKeyword),
    enabled: showAllCategories && enableSearch ? true : !!selectedCategory,
  });

  // Get category title for display
  const getCategoryTitle = () => {
    if (!selectedCategory) return "";
    const category = categories.find(
      (cat) => cat._id === selectedCategory?._id,
    );
    return category
      ? text("categoryTitle", {
          categoryName: getDynamicString(category.title),
        })
      : "";
  };

  return (
    <section className="py-12 space-y-8">
      <div className="container space-y-6" ref={containerRef}>
        <SectionHeader
          eyebrow={text("weOffer")}
          heading={text("ourPopularServices")}
          description={text("popularDescription")}
          tone="secondary"
        />

        {/* Search Bar */}
        {enableSearch && (
          <SearchInput
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder={text("searchServices")}
          />
        )}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            containerRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          showAllButton={showAllCategories}
          loading={categoriesLoading}
        />
      </div>
      {enableSearch ? (
        <div className="container">
          <ServicesSubsection
            services={services}
            loading={servicesLoading}
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
          <ServicesSubsection
            services={services}
            loading={servicesLoading}
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
    </section>
  );
};

export default OurServices;
