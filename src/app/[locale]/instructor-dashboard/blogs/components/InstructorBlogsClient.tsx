"use client";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { IBlog, BlogStatus } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Link } from "@/i18n/routing";
import BlogCard from "./BlogCard";
import SearchWithStatusFilter, {
  StatusOption,
} from "@/components/SearchWithStatusFilter";

// BlogCard Skeleton Component
const BlogCardSkeleton = () => (
  <div className="flex flex-col justify-between w-full gap-4 p-4 border rounded-md">
    <div>
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded" />

      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4 mt-4 mb-2" />

      {/* Description skeleton */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />

      {/* Author and read time skeletons */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>

    {/* Action buttons skeleton */}
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-9 w-20" />
    </div>
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <main className="flex bg-background flex-col w-full gap-8 p-8 lg:p-10">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  </main>
);

const InstructorBlogsClient = () => {
  const instructorText = useTranslations("instructorBlogs");
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus>("active");

  // Fetch blogs with server-side filters
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      const normalizedSearch = searchTerm.trim();

      if (normalizedSearch) {
        params.append("search", normalizedSearch);
      }

      const statusMap: Record<BlogStatus, string> = {
        active: "active",
        inactive: "inActive",
        pending: "pending",
      };
      params.append("status", statusMap[statusFilter]);

      const queryString = params.toString();
      const endpoint = queryString
        ? `/articals/getAll?${queryString}`
        : "/articals/getAll";

      const response = await axiosInstance.get(endpoint);
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message || typedError?.message;
      toast.error(errorMessage || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const statusOptions: StatusOption<BlogStatus>[] = [
    {
      value: "active",
      label: instructorText("active", { defaultMessage: "Active" }),
    },
    {
      value: "inactive",
      label: instructorText("inactive", { defaultMessage: "Inactive" }),
    },
    {
      value: "pending",
      label: instructorText("pending", { defaultMessage: "Pending" }),
    },
  ];

  const handleBlogDeleted = async (blogId: string) => {
    try {
      await axiosInstance.delete(`/articals/${blogId}`);
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
      toast.success(
        instructorText("blogDeletedSuccessfully") ||
          "Blog deleted successfully!"
      );
    } catch (error) {
      console.error("Error deleting blog:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message || typedError?.message;
      toast.error(errorMessage || "Failed to delete blog");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="flex bg-background flex-col w-full gap-8 p-8 lg:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{instructorText("myBlogs")}</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href="/instructor-dashboard/blogs/blog-form/new">
            <Plus className="w-4 h-4" />
            {instructorText("addBlog")}
          </Link>
        </Button>
      </div>

      <SearchWithStatusFilter
        searchPlaceholder={instructorText("search", {
          defaultMessage: "Search",
        })}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        statusPlaceholder={instructorText("statusFilter", {
          defaultMessage: "Status",
        })}
        statusValue={statusFilter}
        onStatusChange={(value) => setStatusFilter(value as BlogStatus)}
        statusOptions={statusOptions}
      />

      {blogs.length !== 0 ? (
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          }}
        >
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              {...blog}
              onDelete={handleBlogDeleted}
              showActions={true}
              editLink={`/instructor-dashboard/blogs/blog-form/${blog._id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-text-3">
            {instructorText("noBlogsFound")}
          </p>
        </div>
      )}
    </main>
  );
};

export default InstructorBlogsClient;
