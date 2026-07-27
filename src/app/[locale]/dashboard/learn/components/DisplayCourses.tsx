"use client";

import { useAuth } from "@/components/auth-provider";
import { FilterTabs } from "@/components/filters/FilterTabs";
import { Button } from "@/components/ui/button";
import {
  useMyLearningSummary,
  useMyOwnedCourseIds,
} from "@/hooks/useMyCoursesQueries";
import { Link } from "@/i18n/navigation";
import {
  collectUnlockableNextCourses,
  DEFAULT_NEXT_COURSE_PROGRESS_THRESHOLD,
  shouldShowNextCoursesOnTab,
  type NextCoursesShowOn,
} from "@/lib/learnNextCourses";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlinePlayCircle,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { LearnCourseCard, LearnCourseCardSkeleton } from "./LearnCourseCard";
import { NextCourseSuggestions } from "./NextCourseSuggestions";

const NEXT_COURSES_SHOW_ON: NextCoursesShowOn = "both";
const NEXT_COURSE_PROGRESS_THRESHOLD = DEFAULT_NEXT_COURSE_PROGRESS_THRESHOLD;

const DisplayCourses = () => {
  const text = useTranslations("learn");
  const { token, user } = useAuth();
  const { data: courses = [], isLoading } = useMyLearningSummary(
    token,
    user?._id,
  );
  const { data: ownedIds = [] } = useMyOwnedCourseIds(token, user?._id);
  const [show, setShow] = useState<"completed" | "notCompleted">(
    "notCompleted",
  );

  const ownedCourseIds = useMemo(() => new Set(ownedIds), [ownedIds]);
  const completedCourses = useMemo(
    () =>
      courses.filter((course) => course.courseProgress?.status === "Completed"),
    [courses],
  );
  const activeCourses = useMemo(
    () =>
      courses.filter((course) => course.courseProgress?.status !== "Completed"),
    [courses],
  );
  const averageProgress = useMemo(() => {
    if (courses.length === 0) return 0;

    return Math.round(
      courses.reduce(
        (total, course) =>
          total + (Number(course.userScore?.totalProgress) || 0),
        0,
      ) / courses.length,
    );
  }, [courses]);

  const toShowCourses = show === "completed" ? completedCourses : activeCourses;
  const showNextCourses = shouldShowNextCoursesOnTab(
    show,
    NEXT_COURSES_SHOW_ON,
  );
  const suggestedNextCourses = useMemo(
    () =>
      collectUnlockableNextCourses(
        toShowCourses,
        ownedCourseIds,
        NEXT_COURSE_PROGRESS_THRESHOLD,
      ),
    [ownedCourseIds, toShowCourses],
  );

  const stats = [
    {
      label: text("courses"),
      value: courses.length,
      icon: HiOutlineBookOpen,
      tone: "primary",
    },
    {
      label: text("notCompleted"),
      value: activeCourses.length,
      icon: HiOutlinePlayCircle,
      tone: "secondary",
    },
    {
      label: text("completed"),
      value: completedCourses.length,
      icon: HiOutlineCheckCircle,
      tone: "primary",
    },
    {
      label: text("overAllProgress"),
      value: averageProgress + "%",
      icon: HiOutlineChartBar,
      tone: "secondary",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-primary-faded p-5 sm:p-7 lg:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -start-24 -top-24 size-72 rounded-full bg-primary/20 blur-[105px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -end-24 size-80 rounded-full bg-secondary/20 blur-[115px]"
        />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-clear-ground/75 px-3 py-1.5 text-xs font-bold text-primary cardShadowSm backdrop-blur-sm">
              <HiOutlineSparkles className="size-4" />
              {text("learningDashboard")}
            </div>
            <h1 className="mt-4 font-black text-text-1">
              {text("myLearning")}
            </h1>
            <p className="mt-3 max-w-xl leading-7 text-text-2">
              {text("myLearningDescription")}
            </p>
          </div>

          <FilterTabs
            flat
            options={[
              { value: "notCompleted", label: text("notCompleted") },
              { value: "completed", label: text("completed") },
            ]}
            activeValue={show}
            onChange={(value) => setShow(value as typeof show)}
          />
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-primary/10 bg-clear-ground/80 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25"
            >
              <span
                className={
                  stat.tone === "secondary"
                    ? "inline-flex size-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary"
                    : "inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"
                }
              >
                <stat.icon className="size-5" />
              </span>
              <p className="mt-3 text-2xl font-black text-text-1">
                {isLoading ? "—" : stat.value}
              </p>
              <p className="mt-1 text-xs font-bold text-text-3">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-primary/10 bg-clear-ground cardShadowSm">
        <div className="flex items-center gap-3 border-b border-primary/10 p-4 sm:p-5">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HiOutlineAcademicCap className="size-5" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">
              {text("courseLibrary")}
            </p>
            <h2 className="mt-1 font-black text-text-1">
              {show === "completed"
                ? text("completed")
                : text("continueLearning")}
            </h2>
          </div>
        </div>

        <div className="space-y-4 p-3 sm:p-5">
          {isLoading ? (
            [1, 2, 3].map((index) => <LearnCourseCardSkeleton key={index} />)
          ) : toShowCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-background-2 px-4 py-14 text-center sm:py-16">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-primary/10 bg-clear-ground text-primary cardShadowSm">
                <HiOutlineAcademicCap className="size-7" />
              </span>
              <h3 className="mt-5 font-black text-text-1">
                {show === "completed"
                  ? text("noCompletedCourses")
                  : text("noInProgressCourses")}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-text-3">
                {show === "completed"
                  ? text("noCompletedCoursesDescription")
                  : text("noInProgressCoursesDescription")}
              </p>
              <Button asChild className="mt-6 rounded-full" size="old">
                <Link href="/courses">
                  {show === "completed"
                    ? text("startLearning")
                    : text("browseCourses")}
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {toShowCourses.map((course) => (
                <LearnCourseCard key={course._id} course={course} />
              ))}
              {showNextCourses && (
                <NextCourseSuggestions courses={suggestedNextCourses} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DisplayCourses;
