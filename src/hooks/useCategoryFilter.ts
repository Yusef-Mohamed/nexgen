"use client";

import { useState, useEffect } from "react";
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
  return response.data.data as ICategory[];
};

export const useCategoryFilter = (
  enableSearch = false
): UseCategoryFilterReturn => {
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

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

  // Auto-select behavior based on search mode
  useEffect(() => {
    if (categories.length > 0) {
      if (enableSearch && selectedCategory === null) {
        // For search mode, keep "All" (null) as default
        return;
      } else if (!enableSearch && !selectedCategory) {
        // For non-search mode, select first category
        setSelectedCategory(categories[0]);
      }
    }
  }, [categories, selectedCategory, enableSearch]);

  return {
    categories,
    loading,
    error: queryError ? "Failed to fetch categories" : null,
    selectedCategory,
    setSelectedCategory,
    refetch,
  };
};
