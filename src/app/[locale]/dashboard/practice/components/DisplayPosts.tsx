"use client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import CreatePractice from "./CreatePractice";
import { IAnalytic } from "@/types";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import AnalyticCard, {
  AnalyticCardSkeleton,
} from "@/components/cards/AnalticCard";

const DisplayPosts = () => {
  const text = useTranslations("practice");
  const { token, user } = useAuth();
  const [show, setShow] = useState<"completed" | "onProgress" | "addNew">(
    "onProgress"
  );
  const [haveError, setHaveError] = useState(false);

  const fetchPosts = useCallback(
    async (page: number, search?: string): Promise<IAnalytic[]> => {
      console.log("fetchPosts");
      try {
        if (haveError) {
          return [];
        }

        const filtersParams = new URLSearchParams(search);
        filtersParams.append("limit", "4");
        filtersParams.append("page", `${page}`);

        if (show === "completed") {
          filtersParams.append("isSeen", "1");
        } else if (show === "onProgress") {
          filtersParams.append("isSeen", "0");
        }
        if (user?.isMarketer) filtersParams.append("asMarketer", "1");

        const filters = filtersParams.toString();
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance(
          `/analytics/user-analytic/${user?._id}${
            filters ? "?" + filters : ""
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data.data as IAnalytic[];
        setPaginationData(res.data.paginationResult);

        return data;
      } catch (e) {
        console.error(e);
        setHaveError(true);
        return [];
      }
    },
    [token, setHaveError, haveError, user, show]
  );

  const {
    data: posts,
    setPaginationData,
    setData,
    resetData,
    isLoading,
    observerRef,
  } = useInfiniteScroll<IAnalytic>({
    fetchData: fetchPosts,
    dependencies: [show], // Add show as a dependency to trigger reset
  });
  const handleShowChange = (newShow: typeof show) => {
    setShow(newShow);
    resetData(); // Reset the data when show changes
  };

  return (
    <section className="mx-auto space-y-4 w-full max-w-4xl">
      <div className="flex overflow-hidden items-center rounded-full border w-fit">
        {(user?.isMarketer
          ? (["completed", "onProgress"] as const)
          : (["completed", "onProgress", "addNew"] as const)
        ).map((item) => (
          <Button
            key={item}
            variant={show === item ? "default" : "outline"}
            className="rounded-none border-none min-w-28 sm:min-w-32"
            onClick={() => handleShowChange(item)}
          >
            {text(item)}
          </Button>
        ))}
      </div>

      {show === "addNew" ? (
        <CreatePractice />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <AnalyticCard
              key={post._id}
              analytic={post}
              setAnalytics={setData}
            />
          ))}
          {!isLoading && posts.length === 0 && !haveError && (
            <div className="p-4 text-center text-muted-foreground">
              {text("noPostsFound")}
            </div>
          )}
          {haveError && (
            <div className="p-4 text-center text-destructive">
              {text("errorLoadingPosts")}
            </div>
          )}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <AnalyticCardSkeleton key={i} />
            ))}
          {!haveError && <div ref={observerRef} />}
        </div>
      )}
    </section>
  );
};

export default DisplayPosts;
