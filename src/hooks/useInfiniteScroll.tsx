import { IPagination } from "@/types";
import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions<T> {
  fetchData: (page: number, search?: string) => Promise<T[]>;
  initialPage?: number;
  search?: string;
  dependencies?: unknown[]; // Add dependencies array for reset trigger
}

export function useInfiniteScroll<T>({
  fetchData,
  initialPage = 1,
  search = "",
  dependencies = [],
}: UseInfiniteScrollOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState<IPagination | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMoreData = useCallback(async () => {
    if (
      isLoading ||
      (paginationData && paginationData.numberOfPages <= currentPage)
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const fetchedData = await fetchData(currentPage, search);
      if (currentPage === initialPage) {
        setData(fetchedData);
      } else {
        setData((prevData) => [...prevData, ...fetchedData]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, fetchData, paginationData, search, currentPage, initialPage]);

  const resetData = useCallback(() => {
    setData([]);
    setPaginationData(null);
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Reset data when dependencies change
  useEffect(() => {
    resetData();
    loadMoreData();
  }, [...dependencies, search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage !== initialPage) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
      observer.disconnect();
    };
  }, [currentPage, initialPage]);

  return {
    data,
    isLoading,
    observerRef,
    setPaginationData,
    setData,
    resetData,
  };
}
