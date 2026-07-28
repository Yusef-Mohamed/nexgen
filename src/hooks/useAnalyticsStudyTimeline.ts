"use client";

import { axiosInstance } from "@/app/lib/utils";
import { DynamicString } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export type AnalyticsTimelineState =
  "completed" | "inProgress" | "notStarted" | "locked";

export type AnalyticsTimelineCourse = {
  _id: string;
  title: DynamicString;
  slug?: string;
  image?: string;
  status: "active" | "inActive" | "pending";
  order: number;
  isOwned: boolean;
  progress: number;
  state: AnalyticsTimelineState;
};

export type AnalyticsStudyTimeline = {
  category: {
    _id: string;
    title: DynamicString;
  };
  courses: AnalyticsTimelineCourse[];
};

export const analyticsStudyTimelineKeys = {
  detail: (userId: string, categoryId: string, locale: string) =>
    ["analytics-study-timeline", userId, categoryId, locale] as const,
};

const fetchAnalyticsStudyTimeline = async (
  userId: string,
  categoryId: string,
): Promise<AnalyticsStudyTimeline> => {
  const response = await axiosInstance.get(
    `/courses/analytics-study-timeline/${userId}/${categoryId}`,
  );
  return response.data.data as AnalyticsStudyTimeline;
};

export const useAnalyticsStudyTimeline = (
  token: string | null | undefined,
  userId: string,
  categoryId: string,
) => {
  const locale = useLocale();

  return useQuery({
    queryKey: analyticsStudyTimelineKeys.detail(userId, categoryId, locale),
    queryFn: () => fetchAnalyticsStudyTimeline(userId, categoryId),
    enabled: Boolean(token && userId && categoryId),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
