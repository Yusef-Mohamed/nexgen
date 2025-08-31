"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { IPackage } from "@/types";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import ServicesSubsection from "./ServicesSubsection";
import OneSidedContainer from "@/components/OneSidedContainer";
import { axiosInstance } from "@/app/lib/utils";
import CategoryFilter from "./CategoryFilter";

// Function to fetch services by category
const fetchServicesByCategory = async (
  categoryId?: string
): Promise<IPackage[]> => {
  if (!categoryId) {
    // If no category selected, fetch all services
    const response = await axiosInstance.get("/packages?limit=50");
    return response.data.data;
  }

  // Fetch all services and filter by category on client side
  // Since IPackage has a course field that contains category info
  const response = await axiosInstance.get("/packages?limit=50");
  const allServices: IPackage[] = response.data.data;

  // Filter services where the course belongs to the selected category
  return allServices.filter(
    (service) => service.course.category._id === categoryId
  );
};

// Function to fetch all services
const fetchServices = async (): Promise<IPackage[]> => {
  const response = await axiosInstance.get("/packages?limit=50");
  return response.data.data;
};

const OurServices: React.FC = () => {
  const text = useTranslations("services");

  // Get categories and selected category from the hook
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    loading: categoriesLoading,
  } = useCategoryFilter();

  // Fetch services filtered by category
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["services", selectedCategory?._id],
    queryFn: () => fetchServicesByCategory(selectedCategory?._id),
    enabled: true,
  });

  // Fetch all services
  const { data: allServices = [], isLoading: allServicesLoading } = useQuery({
    queryKey: ["allServices"],
    queryFn: fetchServices,
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
    <section className="py-16">
      <OneSidedContainer>
        <div className="mb-8">
          <h2 className="h1-5 font-bold">{text("heading")}</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showAllButton={true}
            loading={categoriesLoading}
          />
        </div>

        <ServicesSubsection
          services={services}
          loading={servicesLoading}
          theme={"carousel"}
          title={selectedCategory ? getCategoryTitle() : undefined}
        />

        <div className="mt-16">
          <ServicesSubsection
            services={allServices}
            loading={allServicesLoading}
            theme={"carousel"}
            title={text("exploreAllServices")}
          />
        </div>
      </OneSidedContainer>
    </section>
  );
};

export default OurServices;
