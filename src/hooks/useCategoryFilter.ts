"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/app/lib/utils";
import { ICategory } from "@/types";

interface UseCategoryFilterReturn {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  selectedCategory: ICategory | null;
  setSelectedCategory: (category: ICategory | null) => void;
  refetch: () => void;
}

const fetchCategories = async (): Promise<ICategory[]> => {
  const response = await axiosInstance.get("/categories?limit=1000");
  return (response.data.data as ICategory[]).reverse();
};

export const useCategoryFilter = (
  enableSearch = false,
  selectFirstCategory = !enableSearch,
): UseCategoryFilterReturn => {
  const [selectedCategoryState, setSelectedCategory] =
    useState<ICategory | null>(null);

  const {
    data: categories = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  const selectedCategory =
    categories.length > 0 && selectFirstCategory && !selectedCategoryState
      ? categories[0]
      : selectedCategoryState;

  return {
    categories,
    loading,
    error: queryError ? "Failed to fetch categories" : null,
    selectedCategory,
    setSelectedCategory,
    refetch,
  };
};
