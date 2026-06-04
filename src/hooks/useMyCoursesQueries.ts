"use client";

import { axiosInstance } from "@/app/lib/utils";
import { ICourse } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useCallback } from "react";

export const myCoursesQueryKeys = {
  all: ["my-courses"] as const,
  ownedIds: (userId: string | undefined, locale: string) =>
    [...myCoursesQueryKeys.all, "owned-ids", userId || "", locale] as const,
  learningSummary: (userId: string | undefined, locale: string) =>
    [...myCoursesQueryKeys.all, "learning-summary", userId || "", locale] as const,
  analyticsSummary: (
    userId: string | undefined,
    locale: string,
    includeAllCourses = false,
  ) =>
    [
      ...myCoursesQueryKeys.all,
      "analytics-summary",
      userId || "",
      locale,
      includeAllCourses,
    ] as const,
};

const fetchMyOwnedCourseIds = async (): Promise<string[]> => {
  const response = await axiosInstance.get("/courses/my-owned-ids");
  return response.data.data as string[];
};

const fetchMyLearningSummary = async (): Promise<ICourse[]> => {
  const response = await axiosInstance.get("/courses/my-learning-summary");
  return response.data.data as ICourse[];
};

const fetchAnalyticsLearningSummary = async (
  userId: string,
  includeAllCourses = false,
): Promise<ICourse[]> => {
  const params = new URLSearchParams();
  if (includeAllCourses) params.set("includeAllCourses", "true");
  const queryString = params.toString();
  const response = await axiosInstance.get(
    `/courses/analytics-learning-summary/${userId}${
      queryString ? `?${queryString}` : ""
    }`,
  );
  return response.data.data as ICourse[];
};

export const useMyOwnedCourseIds = (
  token: string | null | undefined,
  userId: string | undefined,
) => {
  const locale = useLocale();

  return useQuery({
    queryKey: myCoursesQueryKeys.ownedIds(userId, locale),
    queryFn: fetchMyOwnedCourseIds,
    enabled: !!token && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMyLearningSummary = (
  token: string | null | undefined,
  userId: string | undefined,
) => {
  const locale = useLocale();

  return useQuery({
    queryKey: myCoursesQueryKeys.learningSummary(userId, locale),
    queryFn: fetchMyLearningSummary,
    enabled: !!token && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAnalyticsLearningSummary = (
  token: string | null | undefined,
  userId: string | undefined,
  includeAllCourses = false,
) => {
  const locale = useLocale();

  return useQuery({
    queryKey: myCoursesQueryKeys.analyticsSummary(
      userId,
      locale,
      includeAllCourses,
    ),
    queryFn: () =>
      fetchAnalyticsLearningSummary(userId || "", includeAllCourses),
    enabled: !!token && !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useInvalidateMyCourses = () => {
  const queryClient = useQueryClient();

  return useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: myCoursesQueryKeys.all,
      }),
    [queryClient],
  );
};
