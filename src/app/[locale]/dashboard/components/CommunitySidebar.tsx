"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  CalendarDays,
  Clock3,
  Sparkles,
  UserRoundCheck,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, usePathname } from "@/i18n/navigation";
import { getDynamicString } from "@/lib/utils";
import { IEvent, ILive, IUser } from "@/types";

type TopPoster = {
  postsCount: number;
  user: IUser;
};

const fallbackLearners = [
  {
    name: "Ananya Desai",
    activity: "Working on Tailwind CSS",
  },
  {
    name: "Karan Singh",
    activity: "Building a portfolio site",
  },
  {
    name: "Meera Nair",
    activity: "In a live session",
  },
  {
    name: "Aditya Verma",
    activity: "Solving DSA problems",
  },
  {
    name: "Zoya Khan",
    activity: "Reading: System Design",
  },
];

const CommunitySidebar = (_props?: { layoutVariant?: unknown }) => {
  const pathname = usePathname();
  const isInstructorDashboard = pathname.includes("instructor-dashboard");
  const { token, user } = useAuth();
  const text = useTranslations("dashboard");
  const eventText = useTranslations("event");
  const livesText = useTranslations("lives");
  const [users, setUsers] = useState<TopPoster[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [lives, setLives] = useState<ILive[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingLives, setLoadingLives] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPosters = async () => {
      if (!token) {
        setLoadingUsers(false);
        return;
      }

      try {
        setLoadingUsers(true);
        setUsersError(null);
        const response = await axiosInstance.get("/posts/topPosters");
        const usersData = response.data?.data || response.data || [];
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        const typedError = err as AxiosError<{ message: string }>;
        setUsersError(
          typedError?.response?.data?.message ||
            typedError?.message ||
            text("failedToLoadActiveLearners"),
        );
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchTopPosters();
  }, [text, token]);

  useEffect(() => {
    const fetchEventsAndLives = async () => {
      if (!token) {
        setLoadingEvents(false);
        setLoadingLives(false);
        return;
      }

      setLoadingEvents(true);
      setLoadingLives(true);

      const [eventsResult, livesResult] = await Promise.allSettled([
        axiosInstance.get("/events", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosInstance.get("/lives?limit=1000", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (eventsResult.status === "fulfilled") {
        const eventsData =
          eventsResult.value.data?.data || eventsResult.value.data || [];
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } else {
        console.error("Error fetching events:", eventsResult.reason);
        setEvents([]);
      }

      if (livesResult.status === "fulfilled") {
        const livesData =
          livesResult.value.data?.data || livesResult.value.data || [];
        setLives(Array.isArray(livesData) ? livesData : []);
      } else {
        console.error("Error fetching lives:", livesResult.reason);
        setLives([]);
      }

      setLoadingEvents(false);
      setLoadingLives(false);
    };

    fetchEventsAndLives();
  }, [token]);

  if (isInstructorDashboard) {
    return null;
  }

  const visibleUsers = users
    .filter((thisUser) => thisUser && thisUser.user._id !== user?._id)
    .slice(0, 5);
  const upcomingEvents = events
    .filter((event) => new Date(event.date).getTime() >= Date.now())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const featuredEvent = upcomingEvents[0];
  const upcomingLives = lives
    .filter(
      (live) =>
        live.status === "active" && new Date(live.date).getTime() >= Date.now(),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-[100px] flex max-h-[calc(100vh-124px)] flex-col gap-5 overflow-auto">
        <RailPanel
          icon={<UserRoundCheck className="size-4" />}
          title={text("topCommunityPosters")}
        >
          {loadingUsers ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div className="flex items-center gap-3" key={item}>
                  <Skeleton className="size-11 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-xl" />
                </div>
              ))}
            </div>
          ) : usersError ? (
            <p className="text-sm text-text-3">{usersError}</p>
          ) : visibleUsers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {visibleUsers.map((thisUser) => (
                <LearnerRow
                  activity={text("communityPostsCount", {
                    count: thisUser.postsCount,
                  })}
                  href={`/dashboard/community/profile/${thisUser.user._id}`}
                  key={thisUser.user._id}
                  user={thisUser.user}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {fallbackLearners.map((learner) => (
                <LearnerRow
                  activity={learner.activity}
                  key={learner.name}
                  user={{ name: learner.name }}
                />
              ))}
            </div>
          )}
        </RailPanel>

        <RailPanel
          action={eventText("viewAll")}
          icon={<Sparkles className="size-4" />}
          title={eventText("upComingEvents")}
        >
          {loadingEvents ? (
            <FeaturedEventSkeleton />
          ) : featuredEvent ? (
            <FeaturedEventCard event={featuredEvent} />
          ) : (
            <p className="rounded-2xl bg-background-2 p-4 text-sm text-text-3">
              {eventText("noEvents")}
            </p>
          )}
        </RailPanel>

        <RailPanel
          action={text("seeAll")}
          icon={<Video className="size-4" />}
          actionHref="/dashboard/lives"
          title={text("upcomingLiveSessions")}
        >
          <div className="flex flex-col gap-4">
            {loadingLives ? (
              [1, 2].map((item) => (
                <div className="flex items-center gap-4" key={item}>
                  <Skeleton className="size-14 rounded-xl" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-9 w-16 rounded-xl" />
                </div>
              ))
            ) : upcomingLives.length > 0 ? (
              upcomingLives.map((live) => (
                <SessionRow
                  date={new Date(live.date)}
                  instructorName={live.instructor?.name}
                  key={live._id}
                  link={live.link}
                  title={getDynamicString(live.title)}
                />
              ))
            ) : (
              <p className="rounded-2xl bg-background-2 p-4 text-sm text-text-3">
                {livesText("noUpcomingLives")}
              </p>
            )}
          </div>
        </RailPanel>

        {/* Pinned Discussions is intentionally hidden until a real pinned-post source exists. */}
      </div>
    </aside>
  );
};

const RailPanel: React.FC<{
  action?: string;
  actionHref?: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}> = ({ action, actionHref, children, icon, title }) => {
  return (
    <section className="rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>
          <h2 className="truncate text-base font-bold text-text-1">{title}</h2>
        </div>
        {action && actionHref ? (
          <Link
            className="shrink-0 text-xs font-bold text-primary transition-colors hover:text-primary-main"
            href={actionHref}
          >
            {action}
          </Link>
        ) : action ? (
          <button
            className="shrink-0 text-xs font-bold text-primary transition-colors hover:text-primary-main"
            type="button"
          >
            {action}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
};

const FeaturedEventCard: React.FC<{ event: IEvent }> = ({ event }) => {
  const eventText = useTranslations("event");
  const date = new Date(event.date);
  const month = date.toLocaleString(undefined, { month: "short" });
  const day = date.toLocaleString(undefined, { day: "2-digit" });

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/10 bg-background-2 shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-primary/10">
        {event.image ? (
          <Image
            alt={event.title}
            className="object-cover"
            fill
            sizes="320px"
            src={event.image}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary">
            <Sparkles className="size-10" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
        <div className="absolute start-4 top-4 flex size-16 flex-col items-center justify-center rounded-2xl border border-clear-ground/70 bg-clear-ground/95 text-primary shadow-sm backdrop-blur-sm">
          <span className="text-[10px] font-black uppercase">{month}</span>
          <span className="text-2xl font-black leading-none">{day}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-bold text-secondary">
          <Sparkles className="size-3.5" />
          {eventText("upComingEvents")}
        </div>
        <h3 className="line-clamp-2 text-base font-black text-text-1">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-2">
          {event.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-text-3">
            <CalendarDays className="size-4 shrink-0" />
            <span className="truncate">{date.toLocaleDateString()}</span>
          </div>
          {event.link && (
            <Button asChild className="h-9 shrink-0 rounded-xl px-4 text-xs">
              <a href={event.link} rel="noreferrer" target="_blank">
                {eventText("joinNow")}
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

const FeaturedEventSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-primary/10 bg-background-2">
    <Skeleton className="aspect-[16/10] w-full rounded-none" />
    <div className="space-y-3 p-4">
      <Skeleton className="h-6 w-28 rounded-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>
    </div>
  </div>
);

const LearnerRow: React.FC<{
  activity: string;
  href?: string;
  user: Pick<IUser, "name" | "profileImg">;
}> = ({ activity, href, user }) => {
  const content = (
    <>
      <UserAvatar user={user} className="size-11 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-text-1">{user.name}</p>
        <p className="truncate text-xs text-text-3">{activity}</p>
      </div>
    </>
  );

  const className =
    "flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/10 hover:shadow-sm hover:shadow-text-1/5";

  if (href) {
    return (
      <Link className={`${className} cursor-pointer`} href={href}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};

const SessionRow: React.FC<{
  date: Date;
  instructorName?: string;
  link: string;
  title: string;
}> = ({ date, instructorName, link, title }) => {
  const eventText = useTranslations("event");
  const month = date.toLocaleString(undefined, { month: "short" });
  const day = date.toLocaleString(undefined, { day: "2-digit" });

  return (
    <div className="flex items-center gap-4">
      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
        <span className="text-[10px] font-bold uppercase">{month}</span>
        <span className="text-lg font-bold leading-none">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-text-1">{title}</p>
        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-text-3">
          <Clock3 className="size-3.5 shrink-0" />
          <span className="truncate">
            {date.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {instructorName ? ` - ${instructorName}` : ""}
          </span>
        </p>
      </div>
      {link && (
        <Button asChild className="h-9 min-w-16 rounded-xl px-3 text-xs">
          <a href={link} rel="noreferrer" target="_blank">
            {eventText("joinNow")}
          </a>
        </Button>
      )}
    </div>
  );
};

export default CommunitySidebar;
