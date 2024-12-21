"use client";
import PostCard, { SkeletonPostCard } from "@/components/cards/PostCard";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { IPost } from "@/types";
import { useCallback, useState } from "react";
import CommunityFilters from "./CommunityFilters";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useTranslations } from "next-intl";
import CreatePost from "./CreatePost";
import { useAuth } from "@/components/auth-provider";
const DisplayCommunityAnalytics = () => {
  const { token } = useAuth();
  const text = useTranslations("dashboard");
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
          sharedTo = "/packages";
          if (!filtersParams.get("service")) return [];
          filtersParams.set("package", filtersParams.get("service") as string);
          filtersParams.delete("service");
        } else if (sharedTo === "students") sharedTo = "?type=profile";
        else if (sharedTo === "courses") {
          sharedTo = "/courses";
          if (!filtersParams.get("course")) return [];
        } else {
          return [];
        }
        filtersParams.append("limit", "4");
        if (page) filtersParams.append("page", `${page}`);
        const filters = filtersParams.toString()
          ? `${sharedTo.startsWith("?") ? "&" : "?"}${filtersParams.toString()}`
          : "";
        const axiosInstance = await createClientAxiosInstance();
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
  } = useInfiniteScroll<IPost>({
    fetchData: fetchPosts,
    search: searchParams.toString(),
  });
  return (
    <section className="flex-1 w-full max-w-2xl px-4 py-6 mx-auto space-y-3 sm:px-4 sm:py-12 sm:space-y-6">
      <CommunityFilters />
      <CreatePost />
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
      {!haveError && <div ref={observerRef} />}
    </section>
  );
};

export default DisplayCommunityAnalytics;
