"use client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { ICourse } from "@/types";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

// Course Card Component
const CourseCard = ({ course }: { course: ICourse }) => {
  const text = useTranslations("courses");

  const getCourseStatus = (course: ICourse) => {
    const isActive = course.status === "active";

    return {
      type: "status" as const,
      isActive,
      text: isActive ? text("active") : text("inactive"),
      variant: (isActive ? "default" : "secondary") as "default" | "secondary",
    };
  };

  const status = getCourseStatus(course);

  return (
    <Card
      key={course._id}
      className="flex md:flex-row flex-col sm:p-6 p-4 overflow-hidden"
    >
      <div className="flex-shrink-0 md:w-48 w-full aspect-[1656/931] relative">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover aspect-[1656/931] rounded-md"
        />
      </div>

      <CardContent className="flex-1 md:p-6 p-4 flex flex-col justify-between">
        <div className="flex md:flex-row flex-col gap-4 justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>

            <p
              className={cn(
                "font-semibold text-muted-foreground",
                course.status !== "active" ? "text-destructive" : "text-green"
              )}
            >
              {status.text}
            </p>
          </div>

          <Button
            variant="outline"
            className="flex !text-sm max-md:w-full items-center gap-2"
            asChild
          >
            <Link href={`/instructor-dashboard/courses/${course._id}`}>
              <Edit className="w-4 h-4" />
              {text("course_details")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Course Loader Component
const CourseLoader = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={`skeleton-${i}`}
          className="flex md:flex-row flex-col sm:p-6 p-4 overflow-hidden"
        >
          <div className="flex-shrink-0 md:w-48 w-full aspect-[1656/931] relative">
            <Skeleton className="h-full w-full rounded-md" />
          </div>

          <CardContent className="flex-1 md:p-6 p-4 flex flex-col justify-between">
            <div className="flex md:flex-row flex-col gap-4 justify-between items-start">
              <div className="flex-1">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <Skeleton className="h-9 w-40 max-md:w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Empty State Component
const EmptyState = ({
  courses,
  isLoading,
}: {
  courses: ICourse[];
  isLoading: boolean;
}) => {
  const text = useTranslations("courses");

  if (courses.length > 0 || isLoading) return null;

  return (
    <div className="w-full p-6 text-center rounded-lg bg-muted">
      <p className="text-lg font-medium">{text("no_courses_found")}</p>
    </div>
  );
};

// Search and Filters Component
const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
}) => {
  const text = useTranslations("courses");

  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute end-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={text("search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{text("all")}</SelectItem>
          <SelectItem value="active">{text("active")}</SelectItem>
          <SelectItem value="inactive">{text("inactive")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

// Error State Component
const ErrorState = ({ haveError }: { haveError: boolean }) => {
  const text = useTranslations("courses");

  if (!haveError) return null;

  return (
    <p className="text-center text-destructive">
      {text("something_went_wrong")}
    </p>
  );
};

// Main MyCourses Component
const MyCourses = () => {
  const { token, user } = useAuth();
  const [haveError, setHaveError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchCourses = useCallback(
    async (page: number, search?: string): Promise<ICourse[]> => {
      try {
        if (haveError || !user?._id) {
          return [];
        }

        const filtersParams = new URLSearchParams();
        filtersParams.append("limit", "10");
        filtersParams.append("page", `${page}`);

        if (search) filtersParams.append("search", search);
        if (filterType !== "all") {
          // Map filter values to API status values
          const statusMap: Record<string, string> = {
            active: "published",
            inactive: "inActive",
          };
          filtersParams.append("status", statusMap[filterType] || filterType);
        }

        const filters = filtersParams.toString();
        const axiosInstance = createClientAxiosInstance();

        const res = await axiosInstance(
          // `/courses/instructorCourses/${user._id}${filters ? "?" + filters : ""}`,
          `/courses${filters ? "?" + filters : ""}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.data as ICourse[];

        if (res.data.paginationResult) {
          setPaginationData(res.data.paginationResult);
        }

        return data;
      } catch (e) {
        console.error("Error fetching courses:", e);
        setHaveError(true);
        return [];
      }
    },
    [token, user?._id, haveError, filterType]
  );

  const {
    data: courses,
    isLoading,
    observerRef,
    setPaginationData,
    hasMore,
  } = useInfiniteScroll<ICourse>({
    fetchData: fetchCourses,
    search: searchTerm,
    dependencies: [user?._id, filterType],
  });

  return (
    <div className="w-full container mx-auto sm:py-8 py-6 space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
        />
      </div>

      {/* Error State */}
      <ErrorState haveError={haveError} />

      {/* Empty State */}
      <EmptyState courses={courses} isLoading={isLoading} />

      {/* Courses List */}
      <div className="space-y-4">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* Loading State */}
      <CourseLoader isLoading={isLoading} />

      {/* Infinite Scroll Observer */}
      <div
        ref={observerRef}
        className="w-full h-24 my-8"
        style={{ visibility: hasMore ? "visible" : "hidden" }}
        data-testid="scroll-observer"
      />
    </div>
  );
};

export default MyCourses;
