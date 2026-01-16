"use client";
import PostCard, { SkeletonPostCard } from "@/components/cards/PostCard";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { IPost } from "@/types";
import { useCallback, useEffect, useState } from "react";
import CommunityFilters from "./CommunityFilters";
import { axiosInstance } from "@/app/lib/utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useTranslations } from "next-intl";
import CreatePost from "./CreatePost";
import { useAuth } from "@/components/auth-provider";
import { Link } from "@/i18n/routing";
const DisplayCommunityAnalytics = () => {
  const { token, user } = useAuth();
  const text = useTranslations("dashboard");
  const communityText = useTranslations("community");
  const [haveError, setHaveError] = useState(false);
  const { searchParams } = useCustomSearchParams();
  const fetchPosts = useCallback(
    async (page: number): Promise<IPost[]> => {
      try {
        if (haveError) {
          return [];
        }
        const filtersParams = new URLSearchParams(searchParams);
        let sharedTo = filtersParams.get("sharedTo");
        filtersParams.delete("sharedTo");
        if (sharedTo === "services") {
          const serviceId = filtersParams.get("service");
          if (!serviceId) return [];
          filtersParams.delete("service");
          sharedTo = `/packages/${serviceId}`;
        } else if (sharedTo === "students") sharedTo = "?type=profile";
        else if (sharedTo === "courses") {
          const courseId = filtersParams.get("course");
          if (!courseId) return [];
          filtersParams.delete("course");
          sharedTo = `/courses/${courseId}`;
        } else {
          return [];
        }
        filtersParams.append("limit", "4");
        if (page) filtersParams.append("page", `${page}`);
        const filters = filtersParams.toString()
          ? `${sharedTo.startsWith("?") ? "&" : "?"}${filtersParams.toString()}`
          : "";

        const res = await axiosInstance(`/posts${sharedTo}${filters}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.data as IPost[];
        setPaginationData(res.data.paginationResult);
        return data;
      } catch (e) {
        console.log(e);
        setHaveError(true);
        return [];
      }
    },
    [token, setHaveError, haveError, searchParams]
  );
  const {
    data: posts,
    isLoading,
    observerRef,
    setPaginationData,
    setData,
  } = useInfiniteScroll<IPost>({
    fetchData: fetchPosts,
    search: searchParams.toString(),
  });

  useEffect(() => {
    setData([]); // Reset data when filters change
  }, [searchParams.toString(), setData]);

  // Show welcome message for users without review access
  if (user && !user.authToReview && !user.isInstructor) {
    return (
      <section className="flex-1 w-full space-y-3 sm:space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {communityText("welcomeToNexgenAcademy")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {communityText("welcomeMessage")}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {communityText("goToCourseList")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 w-full space-y-3 sm:space-y-6">
      <CommunityFilters />
      <CreatePost setData={setData} />
      {haveError && (
        <p className="text-center text-destructive">
          {text("something_went_wrong")}
        </p>
      )}
      {posts.map((post) => (
        <PostCard key={post._id} inCommunity post={post} />
      ))}
      {isLoading &&
        Array.from({ length: 1 }).map((_, i) => <SkeletonPostCard key={i} />)}
      {!haveError && (
        <div
          ref={observerRef}
          className="h-24 w-full my-8"
          style={{ visibility: posts.length > 0 ? "visible" : "hidden" }}
          data-testid="scroll-observer"
        />
      )}
    </section>
  );
};

export default DisplayCommunityAnalytics;
