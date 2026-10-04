"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { ICategory } from "@/types";

export function useCommunityCategories() {
  const { user, token } = useAuth();
  const locale = useLocale();
  return useQuery({
    queryKey: ["community-categories", user?._id, locale],
    enabled: Boolean(token),
    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get<{ data: ICategory[] }>(
        "/posts/myCategories",
        { signal, headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
