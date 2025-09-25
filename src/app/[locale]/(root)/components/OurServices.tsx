"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { IPackage } from "@/types";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import ServicesSubsection from "./ServicesSubsection";
import OneSidedContainer from "@/components/OneSidedContainer";
import { axiosInstance } from "@/app/lib/utils";
import CategoryFilter from "./CategoryFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";

interface OurServicesProps {
  enableSearch?: boolean;
}

// Function to fetch services by category
const fetchServicesByCategory = async (
  categoryId?: string,
  searchKeyword?: string
): Promise<IPackage[]> => {
  let url = "/packages?limit=50";
  if (searchKeyword) {
    url += `&keyword=${encodeURIComponent(searchKeyword)}`;
  }

  const response = await axiosInstance.get(url);
  const allServices: IPackage[] = response.data.data;

  if (!categoryId) {
    return allServices;
  }

  // Filter services where the course belongs to the selected category
  return allServices.filter(
    (service) => service.course.category._id === categoryId
  );
};

// Function to fetch popular services
const fetchPopularServices = async (): Promise<IPackage[]> => {
  const url = "/packages?sort=-ratingsQuantity&limit=50";
  const response = await axiosInstance.get(url);
  return response.data.data;
};

const OurServices: React.FC<OurServicesProps> = ({ enableSearch = false }) => {
  const text = useTranslations("services");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchKeyword, setSearchKeyword] = useState(
    searchParams?.get("keyword") || ""
  );

  // Get categories and selected category from the hook
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    loading: categoriesLoading,
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

  // Fetch services filtered by category
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["services", selectedCategory?._id, searchKeyword],
    queryFn: () =>
      fetchServicesByCategory(selectedCategory?._id, searchKeyword),
    enabled: enableSearch ? true : !!selectedCategory,
  });

  // Fetch popular services
  const { data: popularServices = [], isLoading: popularServicesLoading } =
    useQuery({
      queryKey: ["popularServices"],
      queryFn: () => fetchPopularServices(),
      enabled: true,
    });

  // Get category title for display
  const getCategoryTitle = () => {
    if (!selectedCategory) return "";
    const category = categories.find(
      (cat) => cat._id === selectedCategory?._id
    );
    return category
      ? text("categoryTitle", { categoryName: category.title })
      : "";
  };

  return (
    <section className="py-12 space-y-8">
      <div className="container">
        <h2 className="h2 !font-bold mb-6">{text("heading")}</h2>

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
          <ServicesSubsection
            services={services}
            loading={servicesLoading}
            theme={"grid"}
            title={selectedCategory ? getCategoryTitle() : undefined}
          />
        </div>
      ) : (
        <OneSidedContainer>
          <ServicesSubsection
            services={services}
            loading={servicesLoading}
            theme={"carousel"}
            title={selectedCategory ? getCategoryTitle() : undefined}
          />
        </OneSidedContainer>
      )}{" "}
      <OneSidedContainer>
        <ServicesSubsection
          services={popularServices}
          loading={popularServicesLoading}
          theme={"carousel"}
          title={text("ourPopularServices")}
        />
      </OneSidedContainer>
    </section>
  );
};

export default OurServices;
