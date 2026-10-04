"use client";

import { useLocale, useTranslations } from "next-intl";
import { Home, MessageSquareText } from "lucide-react";
import DisplayPosts from "../../components/DisplayPosts";
import DisplayCommunityAnalytics from "./DisplayCommunityAnalytics";
import CommunityFilters from "./CommunityFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { useAuth } from "@/components/auth-provider";

const CommunityClient = (_props?: {
  contentVariant?: unknown;
  layoutVariant?: unknown;
}) => {
  void _props;
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const { user } = useAuth();
  const locale = useLocale();
  const t = useTranslations("community");
  const dashboardText = useTranslations("dashboard");
  const activeTab = searchParams.get("tab") === "home"
    ? "home"
    : searchParams.get("tab") === "community" || searchParams.has("sharedTo") || searchParams.has("category")
      ? "community"
      : "home";
  const category = searchParams.get("category") || "";

  return (
    <section className="min-w-0">
      <Tabs
        dir={locale === "ar" ? "rtl" : "ltr"}
        value={activeTab}
        onValueChange={(tab) => setSearchParams({
          tab, sharedTo: "", course: "", service: "", page: "",
        })}
      >
        <TabsList aria-label={dashboardText("community")} className="mb-5 flex-wrap">
          {[
            { value: "home", label: t("home"), icon: Home },
            { value: "community", label: dashboardText("community"), icon: MessageSquareText },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-11 gap-2 rounded-full border border-primary/10 bg-clear-ground px-4 text-sm font-semibold text-text-3 hover:border-primary/30 hover:text-primary data-[state=active]:border-primary/20 data-[state=active]:bg-primary/10"
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="home">
          <DisplayPosts inCommunity hideHomeCourses />
        </TabsContent>
        <TabsContent value="community" className="space-y-5">
          <CommunityFilters>
            <DisplayCommunityAnalytics key={user?._id + "-" + locale + "-" + category} category={category} />
          </CommunityFilters>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default CommunityClient;
