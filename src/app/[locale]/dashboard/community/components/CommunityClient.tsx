"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FilterTabs, FilterOption } from "@/components/filters/FilterTabs";
import DisplayPosts from "../../components/DisplayPosts";
import DisplayCommunityAnalytics from "./DisplayCommunityAnalytics";

const CommunityClient = () => {
  const [activeFilter, setActiveFilter] = useState("home");
  const t = useTranslations("community");

  const filterOptions: FilterOption[] = [
    { value: "home", label: t("home") },
    { value: "course-discussion", label: t("courseDiscussion") },
  ];

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
  };

  return (
    <section className="flex-1 w-full max-w-4xl space-y-6 py-6 max-lg:!pt-0 sm:py-12 px-4">
      <div className="mb-6">
        <FilterTabs
          options={filterOptions}
          activeValue={activeFilter}
          onChange={handleFilterChange}
        />
      </div>

      {activeFilter === "home" && <DisplayPosts />}
      {activeFilter === "course-discussion" && <DisplayCommunityAnalytics />}
    </section>
  );
};

export default CommunityClient;
