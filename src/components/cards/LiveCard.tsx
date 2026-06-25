"use client";

import { ILive } from "@/types";
import UserAvatar from "../UserAvatar";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  HiOutlineArrowRight,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineRadio,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { cn, getDynamicString } from "@/lib/utils";

interface LiveCardProps {
  live: ILive;
}

const LiveCard: React.FC<LiveCardProps> = ({ live }) => {
  const text = useTranslations("lives");
  const locale = useLocale();
  const liveDate = new Date(live.date);
  const hasValidDate = !Number.isNaN(liveDate.getTime());
  const packagesWithCourses = (live.package ?? []).filter(
    (packageItem) => packageItem?.course,
  );

  const monthLabel = hasValidDate
    ? new Intl.DateTimeFormat(locale, { month: "short" }).format(liveDate)
    : "--";
  const dayLabel = hasValidDate
    ? new Intl.DateTimeFormat(locale, { day: "2-digit" }).format(liveDate)
    : "--";
  const dateLabel = hasValidDate
    ? new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(liveDate)
    : "--";
  const timeLabel = hasValidDate
    ? new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
      }).format(liveDate)
    : "--";

  return (
    <article className="group flex h-full w-full flex-col gap-4 rounded-3xl border border-primary/10 bg-clear-ground p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 sm:p-5">
      <div className="relative isolate overflow-hidden rounded-2xl border border-primary/10 bg-primary-faded p-4">
        <div className="pointer-events-none absolute -end-16 -top-16 size-44 rounded-full bg-secondary/30 opacity-80 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 -start-16 size-48 rounded-full bg-primary/20 opacity-80 blur-[100px]" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-clear-ground/80 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary" />
            <HiOutlineRadio className="size-3.5" />
            {text("live_session")}
          </span>

          <div className="flex min-w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-primary/10 bg-clear-ground/85 px-3 py-2 text-center shadow-sm backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase leading-none text-primary">
              {monthLabel}
            </span>
            <span className="mt-1 text-2xl font-black leading-none text-text-1">
              {dayLabel}
            </span>
          </div>
        </div>

        <h3 className="relative z-10 mt-8 line-clamp-2 min-h-[3.25rem] text-xl font-black leading-tight text-text-1 transition-colors group-hover:text-primary">
          {getDynamicString(live.title)}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {packagesWithCourses.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {packagesWithCourses.map((packageItem, index) => {
              if (!packageItem?.course) return null;

              return (
                <span
                  key={packageItem._id ?? `${packageItem.course._id}-${index}`}
                  className={cn(
                    "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold",
                    index % 2 === 0
                      ? "border-primary/15 bg-primary/10 text-primary"
                      : "border-secondary/20 bg-secondary/10 text-secondary",
                  )}
                >
                  <HiOutlineBookOpen className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {getDynamicString(packageItem.course.title)}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3">
          <UserAvatar
            user={live.instructor}
            size="sm"
            className="size-9 border border-primary/10"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-3">
              <HiOutlineUserCircle className="size-3.5" />
              <span className="truncate">
                {live.instructor ? live.instructor.name : text("no_instructor")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-background-2/70 p-3 text-sm font-semibold text-text-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HiOutlineCalendarDays className="size-4" />
            </span>
            <span className="truncate">{dateLabel}</span>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-background-2/70 p-3 text-sm font-semibold text-text-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <HiOutlineClock className="size-4" />
            </span>
            <span className="truncate">{timeLabel}</span>
          </div>
        </div>
      </div>

      {live.link && (
        <div className="border-t border-primary/10 pt-4">
          <Button
            size="sm"
            className="group/btn h-10 w-full rounded-full"
            asChild
          >
            <a
              href={live.link}
              target="_blank"
              rel="noreferrer"
              className="gap-2"
            >
              <span>{text("go_to_meeting_room")}</span>
              <HiOutlineArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5" />
            </a>
          </Button>
        </div>
      )}
    </article>
  );
};

export default LiveCard;
