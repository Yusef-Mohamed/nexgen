import { IPagination } from "@/types";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";

interface UseInfiniteScrollOptions<T> {
  fetchData: (
    page: number,
    search?: string,
    helpers?: {
      setPaginationData: Dispatch<SetStateAction<IPagination | null>>;
    },
  ) => Promise<T[]>;
  initialPage?: number;
  search?: string;
  dependencies?: unknown[];
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
    null,
  );
  const [page, setPage] = useState(initialPage);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const initialLoadDone = useRef(false);
  const isLoadingRef = useRef(false);
  const observerAttached = useRef(false);
  const currentPageRef = useRef(initialPage); // Track current page in a ref to avoid closure issues

  // Check if there's more data to load based on the pagination data
  const hasMore = useMemo(() => {
    if (!paginationData) return true;
    return currentPageRef.current < paginationData.numberOfPages;
  }, [paginationData, currentPageRef.current]);

  // Function to fetch more data
  const fetchMoreData = useCallback(async () => {
    // Prevent duplicate requests using ref
    if (isLoadingRef.current || !hasMore) {
      return;
    }

    const pageToFetch = currentPageRef.current;

    setIsLoading(true);
    isLoadingRef.current = true;

    try {
      const newItems = await fetchData(pageToFetch, search, {
        setPaginationData,
      });

      if (pageToFetch === initialPage) {
        setData(newItems);
      } else {
        setData((prev) => [...prev, ...newItems]);
      }

      initialLoadDone.current = true;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetchData, search, hasMore, initialPage]);

  // Handle page changes safely
  const incrementPage = useCallback(() => {
    if (isLoadingRef.current || !hasMore) return;

    const nextPage = currentPageRef.current + 1;
    currentPageRef.current = nextPage;
    setPage(nextPage);
  }, [hasMore]);

  // Reset everything when dependencies change
  const resetData = useCallback(() => {
    setData([]);
    setPaginationData(null);
    currentPageRef.current = initialPage;
    setPage(initialPage);
    initialLoadDone.current = false;
    observerAttached.current = false;
  }, [initialPage]);

  // Reset and load new data when dependencies change
  useEffect(() => {
    resetData();
  }, [...dependencies, search]);

  // Load initial data
  useEffect(() => {
    if (page === initialPage) {
      fetchMoreData();
    }
  }, [fetchMoreData, page === initialPage]);

  // Setup intersection observer with better cleanup
  useEffect(() => {
    // Skip if no observer element or already attached
    if (!observerRef.current) {
      return;
    }

    observerAttached.current = true;

    const observerElement = observerRef.current;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0].isIntersecting;

      if (
        isIntersecting &&
        !isLoadingRef.current &&
        hasMore &&
        initialLoadDone.current
      ) {
        incrementPage();
        fetchMoreData();
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "200px",
      threshold: 0.1,
    });

    observer.observe(observerElement);

    return () => {
      observer.disconnect();
      observerAttached.current = false;
    };
  }, [fetchMoreData, hasMore, incrementPage]);

  return {
    data,
    isLoading,
    observerRef,
    setPaginationData,
    setData,
    resetData,
    hasMore,
    page: currentPageRef.current,
    loadMore: incrementPage,
  };
}
