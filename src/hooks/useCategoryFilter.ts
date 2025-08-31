"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClientAxiosInstance } from "@/app/lib/utils";
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
  const axiosInstance = createClientAxiosInstance();
  const response = await axiosInstance.get("/categories?limit=1000");
  return response.data.data as ICategory[];
};

export const useCategoryFilter = (): UseCategoryFilterReturn => {
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

  // Auto-select first category if none is selected and categories are available
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  return {
    categories,
    loading,
    error: queryError ? "Failed to fetch categories" : null,
    selectedCategory,
    setSelectedCategory,
    refetch,
  };
};
