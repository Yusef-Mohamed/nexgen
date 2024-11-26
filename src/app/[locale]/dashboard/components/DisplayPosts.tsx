"use client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { createClientAxiosInstance } from "@/app/lib/utils";
import PostCard, { SkeletonPostCard } from "@/components/cards/PostCard";
import GetFocusedPost from "./GetFocusedPost";
import { IPost } from "@/types";
import { getCookie } from "cookies-next";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
const DisplayPosts = () => {
  const token = getCookie("token");
  const text = useTranslations("post");
  const [haveError, setHaveError] = useState(false);
  const fetchPosts = useCallback(
    async (page: number, search?: string): Promise<IPost[]> => {
      try {
        if (haveError) {
          return [];
        }
        const filtersParams = new URLSearchParams(search);
        filtersParams.append("limit", "4");
        filtersParams.append("page", `${page}`);
        if (search) filtersParams.append("search", search);
        const filters = filtersParams.toString();
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance(
          `/posts${filters ? "?" + filters : ""}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data.data as IPost[];
        setPaginationData(res.data.paginationResult);

        return data;
      } catch (e) {
        console.log(e);
        setHaveError(true);
        return [];
      }
    },
    [token, setHaveError, haveError]
  );
  const {
    data: posts,
    isLoading,
    observerRef,
    setPaginationData,
  } = useInfiniteScroll<IPost>({
    fetchData: fetchPosts,
  });
  return (
    <section className="flex-1 w-full max-w-2xl px-4 py-6 mx-auto space-y-3 sm:px-4 sm:py-12 sm:space-y-6">
      {haveError && (
        <p className="text-center text-destructive">
          {text("something_went_wrong")}
        </p>
      )}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => <SkeletonPostCard key={i} />)}
      <div ref={observerRef} />
      <GetFocusedPost />
    </section>
  );
};

export default DisplayPosts;
