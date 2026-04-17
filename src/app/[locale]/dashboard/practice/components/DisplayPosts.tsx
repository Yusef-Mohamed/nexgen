"use client";
import { useAuth } from "@/components/auth-provider";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import CreatePractice from "./CreatePractice";
import { IAnalytic } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import AnalyticCard, {
  AnalyticCardSkeleton,
} from "@/components/cards/AnalticCard";
import { FilterTabs, FilterOption } from "@/components/filters/FilterTabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getDynamicString } from "@/lib/utils";
import { useFilterPackages } from "@/hooks/useFilterPackages";

const DisplayPosts = () => {
  const text = useTranslations("practice");
  const inputs = useTranslations("Forms");
  const { token, user } = useAuth();
  const [show, setShow] = useState<"completed" | "onProgress" | "addNew">(
    "completed",
  );
  const [selectedCourse, setSelectedCourse] = useState("");
  const [haveError, setHaveError] = useState(false);
  const { packages, isLoadingPackages } = useFilterPackages({
    enable: true,
    onlyActive: false,
  });
  const fetchPosts = useCallback(
    async (page: number, search?: string): Promise<IAnalytic[]> => {
      try {
        if (haveError || !selectedCourse) {
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
        if (selectedCourse) {
          filtersParams.append("course", selectedCourse);
        }

        const filters = filtersParams.toString();

        const res = await axiosInstance(
          `/analytics/user-analytic${filters ? "?" + filters : ""}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, setHaveError, haveError, user, show, selectedCourse],
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
    dependencies: [show, selectedCourse], // Add show and selectedCourse as dependencies to trigger reset
  });
  const handleShowChange = (newShow: typeof show) => {
    setShow(newShow);
    resetData(); // Reset the data when show changes
  };
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    resetData(); // Reset the data when course changes
  };

  // Filter tabs configuration
  const filterOptions: FilterOption[] = user?.isMarketer
    ? [
        { value: "completed", label: text("completed") },
        { value: "onProgress", label: text("onProgress") },
      ]
    : [
        { value: "completed", label: text("completed") },
        { value: "onProgress", label: text("onProgress") },
        { value: "addNew", label: text("addNew") },
      ];
  useEffect(() => {
    if (packages.length > 0) {
      setSelectedCourse(packages[0].course._id);
    }
  }, [packages]);
  return (
    <section className="mx-auto space-y-4 w-full max-w-6xl">
      {/* Course Filter */}{" "}
      <FilterTabs
        options={filterOptions}
        activeValue={show}
        onChange={(value) => handleShowChange(value as typeof show)}
      />
      <div className="flex items-center gap-4 p-3 rounded-md cardShadow bg-background">
        <div>
          <Label htmlFor="course" className="text-sm sr-only">
            {inputs("course")}:
          </Label>
          <Select
            value={selectedCourse}
            onValueChange={handleCourseChange}
            disabled={isLoadingPackages}
          >
            <SelectTrigger className="gap-4 bg-muted w-fit rounded text-muted-foreground border-none text-xs !h-10">
              <SelectValue
                placeholder={
                  isLoadingPackages ? text("loading") : inputs("SelectCourse")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {packages.map((pkg) => (
                <SelectItem value={pkg.course._id} key={pkg.course._id}>
                  {getDynamicString(pkg.course.title)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {show === "addNew" ? (
        <div className="p-4 cardShadow bg-background rounded-md">
          <CreatePractice />
        </div>
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
          {!haveError && (
            <div
              ref={observerRef}
              className="h-24 w-full my-8"
              style={{ visibility: posts.length > 0 ? "visible" : "hidden" }}
              data-testid="scroll-observer"
            />
          )}
        </div>
      )}
    </section>
  );
};

export default DisplayPosts;
