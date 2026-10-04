"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import PostCard, { SkeletonPostCard } from "@/components/cards/PostCard";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { IPagination, IPost } from "@/types";
import CreatePost from "./CreatePost";

const DisplayCommunityAnalytics = ({ category }: { category: string }) => {
  const { token, user } = useAuth();
  const locale = useLocale();
  const text = useTranslations("post");
  const communityText = useTranslations("community");
  const cache = useQueryClient();
  const observerRef = useRef<HTMLDivElement>(null);
  const {
    data, isPending, isError, isFetching, isFetchingNextPage,
    hasNextPage, fetchNextPage, refetch,
  } = useInfiniteQuery({
    queryKey: ["community-posts", user?._id, locale, category],
    enabled: Boolean(token),
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const response = await axiosInstance.get<{ data: IPost[]; paginationResult: IPagination }>(
        "/posts/categories",
        {
          params: { page: pageParam, limit: 4, ...(category ? { category } : {}) },
          signal,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    getNextPageParam: ({ paginationResult }) =>
      paginationResult.currentPage < paginationResult.numberOfPages
        ? paginationResult.currentPage + 1
        : undefined,
  });

  useEffect(() => {
    const element = observerRef.current;
    if (!element || !hasNextPage || isFetching || isError) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void fetchNextPage();
    }, { rootMargin: "200px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isError]);

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <section className="w-full space-y-5">
      <CreatePost
        defaultCategory={category}
        onCreated={() => void cache.invalidateQueries({ queryKey: ["community-posts"] })}
      />
      {isError && (
        <div role="alert" className="space-y-2 text-center">
          <p className="text-destructive">{text("something_went_wrong")}</p>
          <button type="button" className="font-semibold text-primary" onClick={() => void (data ? fetchNextPage() : refetch())}>
            {communityText("tryAgain")}
          </button>
        </div>
      )}
      {posts.map((post) => <PostCard key={post._id} inCommunity post={post} />)}
      {(isPending || isFetchingNextPage) && <SkeletonPostCard />}
      {!isPending && !isError && posts.length === 0 && (
        <p className="rounded-2xl border border-primary/10 bg-clear-ground p-6 text-center text-text-3">{text("no_posts_found")}</p>
      )}
      <div ref={observerRef} className="h-4" />
      {hasNextPage && !isError && (
        <button type="button" disabled={isFetching} onClick={() => void fetchNextPage()} className="mx-auto block rounded-full border border-primary/10 px-5 py-2 text-sm font-semibold text-primary disabled:opacity-50">
          {isFetchingNextPage ? communityText("loading") : communityText("loadMore")}
        </button>
      )}
    </section>
  );
};

export default DisplayCommunityAnalytics;
