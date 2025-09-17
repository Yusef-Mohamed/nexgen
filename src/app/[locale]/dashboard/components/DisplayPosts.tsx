"use client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { axiosInstance } from "@/app/lib/utils";
import PostCard, { SkeletonPostCard } from "@/components/cards/PostCard";
import GetFocusedPost from "./GetFocusedPost";
import { IPost } from "@/types";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import HomeEvents from "./HomeEvents";
import HomeCourses from "./HomeCourses";

const DisplayPosts = ({ userId }: { userId?: string }) => {
  const { token } = useAuth();
  const text = useTranslations("post");
  const [haveError, setHaveError] = useState(false);
  const [searchTerm] = useState("");

  const fetchPosts = useCallback(
    async (page: number, search?: string): Promise<IPost[]> => {
      try {
        if (haveError) {
          return [];
        }

        const filtersParams = new URLSearchParams();
        filtersParams.append("limit", "4");
        filtersParams.append("page", `${page}`);

        if (userId) {
          filtersParams.append("type", "feed");
          filtersParams.append("user", userId);
        }

        if (search) filtersParams.append("search", search);

        const filters = filtersParams.toString();

        const res = await axiosInstance(
          `/posts${filters ? "?" + filters : ""}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.data as IPost[];

        if (res.data.paginationResult) {
          setPaginationData(res.data.paginationResult);
        }

        return data;
      } catch (e) {
        console.error("Error fetching posts:", e);
        setHaveError(true);
        return [];
      }
    },
    [token, userId, haveError]
  );

  const {
    data: posts,
    isLoading,
    observerRef,
    setPaginationData,
    hasMore,
  } = useInfiniteScroll<IPost>({
    fetchData: fetchPosts,
    search: searchTerm,
    dependencies: [userId],
  });

  const renderLoader = () => {
    if (!isLoading) return null;
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <SkeletonPostCard key={`skeleton-${i}`} />
        ))}
      </div>
    );
  };

  const renderEmptyState = () => {
    if (posts.length > 0 || isLoading) return null;
    return (
      <div className="w-full p-6 text-center rounded-lg bg-muted">
        <p className="text-lg font-medium">{text("no_posts_found")}</p>
      </div>
    );
  };

  if (!userId) {
    return (
      <section className="flex-1 w-full max-w-2xl px-4 py-6 mx-auto space-y-3 sm:px-4 sm:py-12 sm:space-y-6">
        <HomeEvents />
        <HomeCourses />

        {haveError && (
          <p className="text-center text-destructive">
            {text("something_went_wrong")}
          </p>
        )}

        {renderEmptyState()}

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {renderLoader()}

        <div
          ref={observerRef}
          className="w-full h-24 my-8"
          style={{ visibility: hasMore ? "visible" : "hidden" }}
          data-testid="scroll-observer"
        />
        <GetFocusedPost />
      </section>
    );
  }

  return (
    <>
      {haveError && (
        <p className="text-center text-destructive">
          {text("something_went_wrong")}
        </p>
      )}

      {renderEmptyState()}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {renderLoader()}

      <div
        ref={observerRef}
        className="w-full h-24 my-8"
        style={{ visibility: hasMore ? "visible" : "hidden" }}
        data-testid="scroll-observer"
      />
      <GetFocusedPost />
    </>
  );
};

export default DisplayPosts;
