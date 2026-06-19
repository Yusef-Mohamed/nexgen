"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import DisplayPosts from "../../components/DisplayPosts";
import DisplayCommunityAnalytics from "./DisplayCommunityAnalytics";
import CommunityFilters, { CommunityFilterPills } from "./CommunityFilters";
import { cn } from "@/lib/utils";
import { Home, MessageSquareText, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useCustomSearchParams from "@/hooks/useSearchParams";

const CommunityClient = (_props?: {
  contentVariant?: unknown;
  layoutVariant?: unknown;
}) => {
  void _props;

  const { searchParams } = useCustomSearchParams();
  const [activeFilter, setActiveFilter] = useState(() =>
    searchParams.has("sharedTo") ? "course-discussion" : "home",
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const t = useTranslations("community");
  const dashboardText = useTranslations("dashboard");

  const filterOptions = [
    { value: "home", label: t("home"), icon: Home },
    {
      value: "course-discussion",
      label: t("courseDiscussion"),
      icon: MessageSquareText,
    },
  ];

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
  };

  return (
    <section className="min-w-0">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = activeFilter === option.value;

              return (
                <button
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full border border-primary/10 bg-clear-ground px-4 text-sm font-semibold text-text-3 transition-all duration-300 hover:border-primary/30 hover:text-primary",
                    isActive && "border-primary/20 bg-primary/10 text-primary",
                  )}
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  type="button"
                >
                  <Icon className="size-4" />
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-text-3 transition-colors hover:bg-clear-ground hover:text-primary"
              type="button"
            >
              {t("latest")}
            </button>
            {activeFilter === "course-discussion" && (
              <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogTrigger asChild>
                  <button
                    aria-label={dashboardText("advancedFilters")}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-primary/10 bg-clear-ground text-text-3 transition-colors hover:border-primary/30 hover:text-primary"
                    type="button"
                  >
                    <SlidersHorizontal className="size-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="overflow-hidden rounded-2xl border-primary/10 bg-clear-ground p-0 shadow-none sm:max-w-xl">
                  <DialogHeader className="border-b border-primary/10 px-5 py-4">
                    <DialogTitle>
                      {dashboardText("advancedFilters")}
                    </DialogTitle>
                    <DialogDescription>
                      {t("courseDiscussion")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-5">
                    <CommunityFilters
                      key={`${isFilterOpen}-${searchParams.toString()}`}
                      inDialog
                      onCancel={() => setIsFilterOpen(false)}
                      onSave={() => setIsFilterOpen(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {activeFilter === "course-discussion" && <CommunityFilterPills />}

        {activeFilter === "home" && (
          <DisplayPosts showComposer inCommunity hideHomeCourses />
        )}
        {activeFilter === "course-discussion" && <DisplayCommunityAnalytics />}
      </div>
    </section>
  );
};

export default CommunityClient;
