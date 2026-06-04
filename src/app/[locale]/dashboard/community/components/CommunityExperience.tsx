"use client";

import CommunityClient from "./CommunityClient";
import CommunitySidebar from "../../components/CommunitySidebar";
import CommunityViewControls from "@/components/community/CommunityViewControls";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  CommunityLayoutVariant,
  resolveCommunityContent,
  resolveCommunityLayout,
} from "@/components/community/communityViewVariants";
import { BookOpenCheck, CalendarDays, MessageSquareText, Users } from "lucide-react";

const layoutFrameClasses: Record<CommunityLayoutVariant, string> = {
  hub: "xl:grid-cols-[minmax(0,780px)_20rem] 2xl:grid-cols-[minmax(0,820px)_22rem] 2xl:max-w-[1260px] [@media(min-width:2200px)]:max-w-[1360px]",
  rooms:
    "xl:grid-cols-[14rem_minmax(0,760px)_20rem] 2xl:grid-cols-[16rem_minmax(0,820px)_22rem] 2xl:max-w-[1540px] [@media(min-width:2200px)]:max-w-[1660px]",
  board:
    "xl:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:max-w-[1720px] [@media(min-width:2200px)]:max-w-[2060px]",
  focus: "max-w-[940px]",
};

const CommunityExperience = () => {
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const layoutVariant = resolveCommunityLayout(searchParams.get("layout"));
  const contentVariant = resolveCommunityContent(searchParams.get("content"));

  return (
    <main className="relative overflow-hidden bg-background pb-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 end-10 size-72 rounded-full bg-primary/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-72 start-4 size-64 rounded-full bg-secondary/10 blur-[100px]"
      />

      <div
        className={cn(
          "relative z-10 mx-auto grid w-full gap-4 px-3 py-4 sm:px-5 lg:px-6 xl:gap-6",
          layoutFrameClasses[layoutVariant],
        )}
      >
        {layoutVariant === "rooms" && (
          <CommunityRoomsRail setSearchParams={setSearchParams} />
        )}
        <CommunityClient
          contentVariant={contentVariant}
          layoutVariant={layoutVariant}
        />
        {layoutVariant !== "focus" && (
          <CommunitySidebar layoutVariant={layoutVariant} />
        )}
      </div>

      <CommunityViewControls />
    </main>
  );
};

const CommunityRoomsRail: React.FC<{
  setSearchParams: (values: Record<string, string>) => void;
}> = ({ setSearchParams }) => {
  const t = useTranslations("community");
  const dashboardText = useTranslations("dashboard");

  const rooms = [
    {
      icon: Users,
      label: t("relatedToStudents"),
      onClick: () => setSearchParams({ sharedTo: "students", service: "" }),
      tone: "primary",
    },
    {
      icon: MessageSquareText,
      label: t("relatedToService"),
      onClick: () => setSearchParams({ sharedTo: "services" }),
      tone: "secondary",
    },
    {
      icon: BookOpenCheck,
      label: dashboardText("learn"),
      onClick: () => setSearchParams({ sharedTo: "students", service: "" }),
      tone: "primary",
    },
    {
      icon: CalendarDays,
      label: dashboardText("lives"),
      onClick: () => setSearchParams({ sharedTo: "students", service: "" }),
      tone: "secondary",
    },
  ] as const;

  return (
    <aside className="xl:sticky xl:top-[92px] xl:h-[calc(100vh-116px)]">
      <div className="rounded-2xl border border-primary/15 bg-clear-ground/80 p-3 cardShadowSm backdrop-blur-sm xl:h-full">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          {t("roomRail")}
        </div>
        <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
          {rooms.map((room) => {
            const Icon = room.icon;
            return (
              <button
                className={cn(
                  "group flex items-center gap-2 rounded-xl border bg-background p-3 text-start text-sm font-semibold text-text-2 transition-all duration-300 hover:-translate-y-0.5",
                  room.tone === "primary"
                    ? "border-primary/10 hover:border-primary/35 hover:text-primary"
                    : "border-secondary/10 hover:border-secondary/35 hover:text-secondary",
                )}
                key={room.label}
                onClick={room.onClick}
                type="button"
              >
                <span
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                    room.tone === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 truncate">{room.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default CommunityExperience;
