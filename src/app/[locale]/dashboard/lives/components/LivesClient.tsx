"use client";
import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { axiosInstance } from "@/app/lib/utils";
import { ILive } from "@/types";
import LiveCard from "@/components/cards/LiveCard";
import LiveFilters from "./LiveFilters";
import LivesCalender from "./LivesCalender";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { Skeleton } from "@/components/ui/skeleton";

const LiveCardSkeleton = () => (
  <div className="flex flex-col justify-between w-full gap-4 p-4 border rounded-md">
    <div>
      <div className="flex flex-wrap items-center justify-start gap-2 mb-4">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-24 rounded" />
      </div>
      <div className="flex items-center justify-between mt-4 mb-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-5 w-full mb-3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
    <Skeleton className="w-full h-10 rounded-lg" />
  </div>
);

const LivesClient = () => {
  const text = useTranslations("lives");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { getSearchParam } = useCustomSearchParams();
  const [lives, setLives] = useState<ILive[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDate = getSearchParam("date") || "";
  const selectedCourse = getSearchParam("course") || "all";

  // Fetch all lives once with limit=1000
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

  // Group lives by time (this week vs upcoming)
  const groupLivesByTime = (livesToGroup: ILive[]) => {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setHours(0, 0, 0, 0);
    startOfThisWeek.setDate(now.getDate() - now.getDay()); // Set to Sunday

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

  // Client-side filtering
  const filteredLives = useMemo(() => {
    let filtered = [...lives];

    // Filter by course
    if (selectedCourse && selectedCourse !== "all") {
      filtered = filtered.filter((live) =>
        live.package.some((pkg) => pkg._id === selectedCourse)
      );
    }

    // Filter by date if selected
    if (selectedDate) {
      filtered = filtered.filter(
        (live) => format(new Date(live.date), "yyyy-MM-dd") === selectedDate
      );
    }

    return filtered;
  }, [lives, selectedCourse, selectedDate]);

  // Group filtered lives by time
  const { thisWeek, upcoming } = useMemo(
    () => groupLivesByTime(filteredLives),
    [filteredLives]
  );

  if (loading) {
    return (
      <main className="flex bg-background flex-col-reverse w-full gap-8 p-8 lg:flex-row lg:gap-10 lg:p-10">
        <div className="flex-1 w-full">
          <div className="px-6 py-4 mb-4 cardShadow rounded-xl h-fit">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="grid gap-4 lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <LiveCardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="px-6 py-4 mb-4 cardShadow rounded-xl h-fit">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="grid gap-4 lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <LiveCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
        <div className="xl:w-[25rem] lg:w-[20rem]">
          <LiveFilters />
          <div className="w-full cardShadow rounded-xl h-fit p-4">
            <Skeleton className="h-6 w-24 mx-auto mb-6" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex bg-background flex-col-reverse w-full gap-8 p-8 lg:flex-row lg:gap-10 lg:p-10">
      <div className="flex-1 w-full">
        {selectedDate ? (
          <div className="px-6 py-4 mb-4 cardShadow rounded-xl h-fit">
            <h2 className="mb-4 font-medium md:mb-6">
              {format(new Date(selectedDate), "EEEE, MMMM d, yyyy", {
                locale: isArabic ? arSA : enUS,
              })}
            </h2>
            {filteredLives.length !== 0 ? (
              <div className="grid gap-4 lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                {filteredLives.map((live) => (
                  <LiveCard key={live._id} live={live} />
                ))}
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-center text-text-3">
                  {text("noLivesThisDay")}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="px-6 py-4 mb-4 cardShadow rounded-xl h-fit">
              <h2 className="mb-4 font-medium md:mb-6">{text("thisWeek")}</h2>
              {thisWeek.length !== 0 ? (
                <div className="grid gap-4 lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                  {thisWeek.map((live) => (
                    <LiveCard key={live._id} live={live} />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-center text-text-3">
                    {text("noLivesThisWeek")}
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 mb-4 cardShadow rounded-xl h-fit">
              <h2 className="mb-4 font-medium md:mb-6">
                {text("upcomingWeeks")}
              </h2>
              {upcoming.length !== 0 ? (
                <div className="grid gap-4 lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                  {upcoming.map((live) => (
                    <LiveCard key={live._id} live={live} />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-center text-text-3">
                    {text("noUpcomingLives")}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="xl:w-[25rem] lg:w-[20rem]">
        <LiveFilters />
        <LivesCalender lives={lives} />
      </div>
    </main>
  );
};

export default LivesClient;
