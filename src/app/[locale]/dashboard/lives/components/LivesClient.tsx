"use client";
import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { axiosInstance } from "@/app/lib/utils";
import { ILive } from "@/types";
import LiveCard from "@/components/cards/LiveCard";
import LiveFilters from "./LiveFilters";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { Skeleton } from "@/components/ui/skeleton";
import LivesCalendar from "@/components/LivesCalendar";
import DashboardContainer from "../../components/DashboardContainer";
import { CalendarDays, Radio } from "lucide-react";

const LiveCardSkeleton = () => (
  <div className="flex w-full flex-col justify-between gap-4 rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-start gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="mb-4 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="mb-3 h-5 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
    <Skeleton className="h-10 w-full rounded-xl" />
  </div>
);

const LivesPageShell = ({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) => {
  return (
    <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
      <DashboardContainer className="space-y-5">
        <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm sm:p-6">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(var(--primary)/0.08)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative flex min-w-0 items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
              <Radio className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-text-1 sm:text-xl">
                {title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-text-3">
                {description}
              </p>
            </div>
          </div>
        </section>
        {children}
      </DashboardContainer>
    </main>
  );
};

const LivePanel = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
      <div className="flex items-center gap-3 border-b border-primary/10 p-4 sm:p-5">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarDays className="size-4" />
        </span>
        <h2 className="font-black text-text-1">{title}</h2>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
};

const EmptyLives = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-primary/10 bg-background-2 px-4 py-12 text-center text-sm font-bold text-text-3">
    {children}
  </div>
);

const LivesClient = () => {
  const text = useTranslations("lives");
  const dashboardText = useTranslations("dashboard");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { getSearchParam } = useCustomSearchParams();
  const [lives, setLives] = useState<ILive[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDate = getSearchParam("date") || "";
  const selectedCourse = getSearchParam("course") || "all";

  useEffect(() => {
    const fetchLives = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/lives?limit=1000`);
        setLives(response.data.data || []);
      } catch (error) {
        console.error("Error fetching lives:", error);
        setLives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLives();
  }, []);

  const groupLivesByTime = (livesToGroup: ILive[]) => {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setHours(0, 0, 0, 0);
    startOfThisWeek.setDate(now.getDate() - now.getDay());

    const startOfNextWeek = new Date(startOfThisWeek);
    startOfNextWeek.setDate(startOfThisWeek.getDate() + 7);

    return {
      thisWeek: livesToGroup.filter((live) => {
        const liveDate = new Date(live.date);
        return liveDate >= startOfThisWeek && liveDate < startOfNextWeek;
      }),
      upcoming: livesToGroup.filter((live) => {
        const liveDate = new Date(live.date);
        return liveDate >= startOfNextWeek;
      }),
    };
  };

  const filteredLives = useMemo(() => {
    let filtered = [...lives];

    if (selectedCourse && selectedCourse !== "all") {
      filtered = filtered.filter((live) =>
        live.package.some((pkg) => pkg._id === selectedCourse),
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (live) => format(new Date(live.date), "yyyy-MM-dd") === selectedDate,
      );
    }

    return filtered;
  }, [lives, selectedCourse, selectedDate]);

  const { thisWeek, upcoming } = useMemo(
    () => groupLivesByTime(filteredLives),
    [filteredLives],
  );

  const title = dashboardText("lives");
  const description = text("dashboardDescription");

  if (loading) {
    return (
      <LivesPageShell description={description} title={title}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            {[text("thisWeek"), text("upcomingWeeks")].map((panelTitle) => (
              <LivePanel key={panelTitle} title={panelTitle}>
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <LiveCardSkeleton key={i} />
                  ))}
                </div>
              </LivePanel>
            ))}
          </div>
          <aside className="space-y-5">
            <LiveFilters />
            <div className="rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
              <Skeleton className="mx-auto mb-6 h-6 w-24" />
              <Skeleton className="h-48 w-full" />
            </div>
          </aside>
        </div>
      </LivesPageShell>
    );
  }

  return (
    <LivesPageShell description={description} title={title}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          {selectedDate ? (
            <LivePanel
              title={format(new Date(selectedDate), "EEEE, MMMM d, yyyy", {
                locale: isArabic ? arSA : enUS,
              })}
            >
              {filteredLives.length !== 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredLives.map((live) => (
                    <LiveCard key={live._id} live={live} />
                  ))}
                </div>
              ) : (
                <EmptyLives>{text("noLivesThisDay")}</EmptyLives>
              )}
            </LivePanel>
          ) : (
            <>
              <LivePanel title={text("thisWeek")}>
                {thisWeek.length !== 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {thisWeek.map((live) => (
                      <LiveCard key={live._id} live={live} />
                    ))}
                  </div>
                ) : (
                  <EmptyLives>{text("noLivesThisWeek")}</EmptyLives>
                )}
              </LivePanel>
              <LivePanel title={text("upcomingWeeks")}>
                {upcoming.length !== 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {upcoming.map((live) => (
                      <LiveCard key={live._id} live={live} />
                    ))}
                  </div>
                ) : (
                  <EmptyLives>{text("noUpcomingLives")}</EmptyLives>
                )}
              </LivePanel>
            </>
          )}
        </div>
        <aside className="space-y-5">
          <LiveFilters />
          <LivesCalendar lives={lives} />
        </aside>
      </div>
    </LivesPageShell>
  );
};

export default LivesClient;
