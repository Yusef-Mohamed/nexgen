"use client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { axiosInstance } from "@/app/lib/utils";
import { ICourse } from "@/types";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/i18n/routing";
import { FilterTabs, FilterOption } from "@/components/filters/FilterTabs";
import { getDynamicContent, ContentType } from "@/lib/dynamicContent";
import UnifiedCard from "@/components/cards/UnifiedCard";
import { IPackage, ICoursePackage } from "@/types";

// Dynamic Card Component
const DynamicCard = ({
  item,
  contentType,
}: {
  item: ICourse | IPackage | ICoursePackage;
  contentType: ContentType;
}) => {
  return <UnifiedCard item={item} contentType={contentType} />;
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
  items,
  isLoading,
  contentType,
}: {
  items: (ICourse | IPackage | ICoursePackage)[];
  isLoading: boolean;
  contentType: ContentType;
}) => {
  const text = useTranslations("courses");
  const dynamicContent = getDynamicContent(contentType, text);

  if (items.length > 0 || isLoading) return null;

  return (
    <div className="w-full p-6 text-center rounded-lg bg-muted">
      <p className="text-lg font-medium">{dynamicContent.noContentFound}</p>
    </div>
  );
};

// Search and Filters Component
const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
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

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{text("all")}</SelectItem>
          <SelectItem value="active">{text("active")}</SelectItem>
          <SelectItem value="inactive">{text("inactive")}</SelectItem>
          <SelectItem value="pending">{text("pending")}</SelectItem>
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("courses");

  const fetchData = useCallback(
    async (
      page: number,
      search?: string
    ): Promise<ICourse[] | IPackage[] | ICoursePackage[]> => {
      try {
        if (haveError || !user?._id) {
          return [];
        }

        const filtersParams = new URLSearchParams();
        filtersParams.append("limit", "10");
        filtersParams.append("page", `${page}`);

        if (search) filtersParams.append("search", search);
        if (statusFilter !== "all") {
          // Map filter values to API status values
          const statusMap: Record<string, string> = {
            active: "published",
            inactive: "inActive",
            pending: "pending",
          };
          filtersParams.append(
            "status",
            statusMap[statusFilter] || statusFilter
          );
        }

        const filters = filtersParams.toString();
        let endpoint = "";
        let data: ICourse[] | IPackage[] | ICoursePackage[] = [];

        // Determine endpoint based on type filter
        if (typeFilter === "courses") {
          // endpoint = `/courses/instructorCourses/${user?._id}${
          endpoint = `/courses/getAll${filters ? "?" + filters : ""}`;
        } else if (typeFilter === "learning-paths") {
          endpoint = `/coursePackages/getAll${filters ? "?" + filters : ""}`;
        } else if (typeFilter === "services") {
          endpoint = `/packages/getAll${filters ? "?" + filters : ""}`;
        }

        const res = await axiosInstance(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        data = res.data.data;

        if (res.data.paginationResult) {
          setPaginationData(res.data.paginationResult);
        }

        return data;
      } catch (e) {
        console.error("Error fetching data:", e);
        setHaveError(true);
        return [];
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, user?._id, haveError, statusFilter, typeFilter]
  );

  const {
    data: items,
    isLoading,
    observerRef,
    setPaginationData,
    hasMore,
  } = useInfiniteScroll<ICourse | IPackage | ICoursePackage>({
    fetchData: fetchData,
    search: searchTerm,
    dependencies: [user?._id, statusFilter, typeFilter],
  });

  const text = useTranslations("courses");
  const contentType = typeFilter as ContentType;
  const dynamicContent = getDynamicContent(contentType, text);

  // Filter tabs configuration
  const filterOptions: FilterOption[] = [
    { value: "courses", label: text("courses") },
    { value: "learning-paths", label: text("learning_paths") },
    { value: "services", label: text("services") },
  ];

  return (
    <div className="w-full container mx-auto sm:py-8 py-6 space-y-6">
      {/* Filter Tabs */}
      <FilterTabs
        options={filterOptions}
        activeValue={typeFilter}
        onChange={(value) => setTypeFilter(value)}
      />

      {/* Header with Add Button */}
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">{dynamicContent.header}</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href={dynamicContent.addButtonLink}>
            <Plus className="w-4 h-4" />
            {dynamicContent.addButton}
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* Error State */}
      <ErrorState haveError={haveError} />

      {/* Empty State */}
      <EmptyState
        items={items}
        isLoading={isLoading}
        contentType={contentType}
      />

      {/* Content List */}
      <div className="space-y-4">
        {items.map((item) => (
          <DynamicCard key={item._id} item={item} contentType={contentType} />
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
