"use client";
import { axiosInstance } from "@/app/lib/utils";
import { ICourse, ICoursePackage, IPackage } from "@/types";
import { useQuery } from "@tanstack/react-query";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

const fetchCoursesByCategory = async (
  categoryId?: string,
  limit = 10,
): Promise<ICourse[]> => {
  let url = `/courses?limit=${limit}`;
  if (categoryId) url += `&category=${categoryId}`;
  const res = await axiosInstance.get(url);
  return res.data.data as ICourse[];
};

const fetchLearningPathsByCategory = async (
  categoryId?: string,
  limit = 10,
): Promise<ICoursePackage[]> => {
  // Learning paths don't have a direct category field — fetch all then filter client-side
  const res = await axiosInstance.get(`/coursePackages?limit=50`);
  const all = res.data.data as ICoursePackage[];
  if (!categoryId) return all.slice(0, limit);
  return all
    .filter((lp) => lp.courses.some((c) => c.category?._id === categoryId))
    .slice(0, limit);
};

const fetchServicesByCategory = async (
  categoryId?: string,
  limit = 10,
): Promise<IPackage[]> => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (categoryId) params.set("category", categoryId);
  const res = await axiosInstance.get(`/packages?${params.toString()}`);
  return res.data.data as IPackage[];
};

export const useFilteredCourses = (
  categoryId: string | undefined,
  limit = 10,
  enabled = true,
) =>
  useQuery({
    queryKey: ["filtered-courses", categoryId, limit],
    queryFn: () => fetchCoursesByCategory(categoryId, limit),
    enabled,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

export const useFilteredLearningPaths = (
  categoryId: string | undefined,
  limit = 10,
  enabled = true,
) =>
  useQuery({
    queryKey: ["filtered-learning-paths", categoryId, limit],
    queryFn: () => fetchLearningPathsByCategory(categoryId, limit),
    enabled,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

export const useFilteredServices = (
  categoryId: string | undefined,
  limit = 10,
  enabled = true,
) =>
  useQuery({
    queryKey: ["filtered-services", categoryId, limit],
    queryFn: () => fetchServicesByCategory(categoryId, limit),
    enabled,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
