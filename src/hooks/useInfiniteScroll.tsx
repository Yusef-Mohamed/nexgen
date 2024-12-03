import { IPagination } from "@/types";
import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions<T> {
  fetchData: (page: number, search?: string) => Promise<T[]>;
  initialPage?: number;
  search?: string;
}

export function useInfiniteScroll<T>({
  fetchData,
  initialPage = 1,
  search = "",
}: UseInfiniteScrollOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState<IPagination | null>(
    null
  );
  const observerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreData = useCallback(async () => {
    if (
      isLoading ||
      (paginationData &&
        paginationData.numberOfPages <= paginationData.currentPage)
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const fetchedData = await fetchData(
        (paginationData?.currentPage || 0) + 1 || initialPage,
        search
      );
      if (!paginationData) setData(fetchedData);
      else setData((prevData) => [...prevData, ...fetchedData]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, fetchData, paginationData, search, initialPage]);
  useEffect(() => {
    setData([]);
    setPaginationData(null); // reset pagination data
    loadMoreData(); // Initial load for new search
  }, [search]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
      observer.disconnect();
    };
  }, [loadMoreData]);

  return { data, isLoading, observerRef, setPaginationData, setData };
}
