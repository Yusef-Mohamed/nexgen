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
import { ClipboardCheck, SlidersHorizontal, UsersRound } from "lucide-react";

type ForceRole = "student" | "instructor" | "marketer";

const DisplayPosts = ({ forceRole }: { forceRole?: ForceRole }) => {
  const text = useTranslations("practice");
  const inputs = useTranslations("Forms");
  const { token, user } = useAuth();
  const [show, setShow] = useState<"completed" | "onProgress" | "addNew">(
    "completed",
  );
  const [activeRole, setActiveRole] = useState<ForceRole>(
    forceRole ?? "student",
  );
  const [selectedCourse, setSelectedCourse] = useState("");
  const [haveError, setHaveError] = useState(false);
  const { packages, isLoadingPackages } = useFilterPackages({
    enable: true,
    onlyActive: false,
    role: activeRole,
  });
  const fetchPosts = useCallback(
    async (page: number, search?: string): Promise<IAnalytic[]> => {
      try {
        if (!selectedCourse || show === "addNew") {
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
        filtersParams.append("forceRole", activeRole);

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
    [token, setHaveError, user, show, selectedCourse, activeRole],
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
    dependencies: [show, selectedCourse, activeRole],
  });
  const handleShowChange = (newShow: typeof show) => {
    setHaveError(false);
    setShow(newShow);
    resetData();
  };
  const handleCourseChange = (courseId: string) => {
    setHaveError(false);
    setSelectedCourse(courseId);
    resetData();
  };

  const handleRoleChange = (role: ForceRole) => {
    setHaveError(false);
    setActiveRole(role);
    setSelectedCourse("");
    if (role !== "student" && show === "addNew") {
      setShow("completed");
    }
    resetData();
  };

  const eligibleRoles = [
    { value: "student" as const, label: text("roleUser") },
    ...(user?.isInstructor
      ? [{ value: "instructor" as const, label: text("roleInstructor") }]
      : []),
    ...(user?.isMarketer
      ? [{ value: "marketer" as const, label: text("roleMarketer") }]
      : []),
  ];

  const filterOptions: FilterOption[] =
    activeRole === "student"
      ? [
          { value: "completed", label: text("completed") },
          { value: "onProgress", label: text("onProgress") },
          { value: "addNew", label: text("addNew") },
        ]
      : [
          { value: "completed", label: text("completed") },
          { value: "onProgress", label: text("onProgress") },
        ];
  useEffect(() => {
    setHaveError(false);
    setSelectedCourse((currentCourse) => {
      if (packages.length === 0) return "";
      const isStillAvailable = packages.some(
        (pkg) => pkg.course._id === currentCourse,
      );
      return isStillAvailable ? currentCourse : packages[0].course._id;
    });
  }, [packages]);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4">
      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
        <div className="border-b border-primary/10 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
                <ClipboardCheck className="size-5" />
              </span>
              <div className="min-w-0">
                <h1 className="text-base font-black text-text-1 sm:text-lg">
                  {text("title")}
                </h1>
                <p className="mt-1 text-sm leading-6 text-text-3">
                  {text("description")}
                </p>
              </div>
            </div>

            <FilterTabs
              flat
              options={filterOptions}
              activeValue={show}
              onChange={(value) => handleShowChange(value as typeof show)}
            />
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {eligibleRoles.length > 1 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background-2 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-text-2">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UsersRound className="size-4" />
                </span>
                <div>
                  <p>{text("viewAs")}</p>
                  <p className="mt-0.5 text-xs font-medium text-text-3">
                    {text("viewAsDescription")}
                  </p>
                </div>
              </div>
              <Select
                value={activeRole}
                onValueChange={(value) =>
                  handleRoleChange(value as ForceRole)
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl border-primary/10 bg-clear-ground text-xs font-bold text-text-2 shadow-none sm:w-fit sm:min-w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eligibleRoles.map((role) => (
                    <SelectItem value={role.value} key={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background-2 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-text-2">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <SlidersHorizontal className="size-4" />
              </span>
              {inputs("course")}
            </div>
            <div>
              <Label htmlFor="course" className="sr-only text-sm">
                {inputs("course")}:
              </Label>
              <Select
                value={selectedCourse}
                onValueChange={handleCourseChange}
                disabled={isLoadingPackages}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border-primary/10 bg-clear-ground text-xs font-bold text-text-2 shadow-none sm:w-fit sm:min-w-56">
                  <SelectValue
                    placeholder={
                      isLoadingPackages
                        ? text("loading")
                        : inputs("SelectCourse")
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
            <div className="rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
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
                <div className="rounded-2xl border border-primary/10 bg-background-2 p-8 text-center text-sm font-bold text-text-3">
                  {text("noPostsFound")}
                </div>
              )}
              {haveError && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-sm font-bold text-destructive">
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
                  className="my-8 h-24 w-full"
                  style={{
                    visibility: posts.length > 0 ? "visible" : "hidden",
                  }}
                  data-testid="scroll-observer"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DisplayPosts;
