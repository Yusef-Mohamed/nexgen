"use client";

import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommunityCategories } from "@/hooks/useCommunityCategories";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { getDynamicString } from "@/lib/utils";

const CommunityFilters = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("community");
  const dashboardText = useTranslations("dashboard");
  const locale = useLocale();
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const { data: categories = [], isPending, isError, refetch } = useCommunityCategories();
  const category = searchParams.get("category") || "all";

  if (isPending) return <p role="status" className="py-4 text-text-3">{t("loading")}</p>;
  if (isError) return (
    <div role="alert" className="space-y-3 rounded-2xl border border-primary/10 bg-clear-ground p-5">
      <p className="text-destructive">{t("failedToLoadCategories")}</p>
      <button type="button" onClick={() => void refetch()} className="font-semibold text-primary">{t("tryAgain")}</button>
    </div>
  );

  const options = [{ _id: "all", title: dashboardText("allCategories") }, ...categories];

  return (
    <Tabs
      dir={locale === "ar" ? "rtl" : "ltr"}
      value={category}
      onValueChange={(value) => setSearchParams({
        tab: "community", category: value === "all" ? "" : value,
        sharedTo: "", course: "", service: "", page: "",
      })}
      className="min-w-0 space-y-5"
    >
      <div className="overflow-x-auto pb-2">
        <TabsList aria-label={dashboardText("category")} className="min-w-max border-b border-primary/10">
          {options.map((option) => (
            <TabsTrigger key={option._id} value={option._id} className="px-4 py-3 text-sm text-text-3 hover:text-primary">
              {getDynamicString(option.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {category !== "all" && !categories.some((item) => item._id === category) ? (
        <p role="alert" className="text-text-3">{t("categoryUnavailable")}</p>
      ) : (
        <TabsContent value={category}>{children}</TabsContent>
      )}
    </Tabs>
  );
};

export default CommunityFilters;
