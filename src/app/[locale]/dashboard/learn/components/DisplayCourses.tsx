"use client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  useMyLearningSummary,
  useMyOwnedCourseIds,
} from "@/hooks/useMyCoursesQueries";
import {
  collectUnlockableNextCourses,
  shouldShowNextCoursesOnTab,
  type NextCoursesShowOn,
  DEFAULT_NEXT_COURSE_PROGRESS_THRESHOLD,
} from "@/lib/learnNextCourses";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { PiExam } from "react-icons/pi";
import { BookOpenCheck } from "lucide-react";
import { FilterTabs } from "@/components/filters/FilterTabs";
import { LearnCourseCard, LearnCourseCardSkeleton } from "./LearnCourseCard";
import { NextCourseSuggestions } from "./NextCourseSuggestions";

/** When to show locked "next course" cards (after all course rows). */
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

  const showNextCourses = shouldShowNextCoursesOnTab(
    show,
    NEXT_COURSES_SHOW_ON,
  );

  const toShowCourses = useMemo(() => {
    if (show === "completed") {
      return courses.filter(
        (course) => course.courseProgress?.status === "Completed",
      );
    }
    return courses.filter(
      (course) => course.courseProgress?.status !== "Completed",
    );
  }, [show, courses]);

  const suggestedNextCourses = useMemo(
    () =>
      collectUnlockableNextCourses(
        toShowCourses,
        ownedCourseIds,
        NEXT_COURSE_PROGRESS_THRESHOLD,
      ),
    [toShowCourses, ownedCourseIds],
  );
  return (
    <section className="mx-auto w-full max-w-6xl space-y-4">
      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
        <div className="border-b border-primary/10 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
                <BookOpenCheck className="size-5" />
              </span>
              <div className="min-w-0">
                <h1 className="text-base font-black text-text-1 sm:text-lg">
                  {text("myLearning")}
                </h1>
                <p className="mt-1 text-sm text-text-3">
                  {text("myLearningDescription")}
                </p>
              </div>
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
        </div>

        <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
          {isLoading ? (
            [1, 2, 3].map((index) => <LearnCourseCardSkeleton key={index} />)
          ) : toShowCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/10 bg-background-2 px-4 py-16 text-center">
              <div className="mb-5 rounded-2xl border border-primary/10 bg-clear-ground p-4 text-primary shadow-sm">
                <PiExam className="size-14" />
              </div>
              <h3 className="mb-2 text-xl font-black text-text-1">
                {show === "completed"
                  ? text("noCompletedCourses")
                  : text("noInProgressCourses")}
              </h3>
              <p className="mb-6 max-w-md text-sm leading-6 text-text-3">
                {show === "completed"
                  ? text("noCompletedCoursesDescription")
                  : text("noInProgressCoursesDescription")}
              </p>
              <Button asChild className="rounded-xl px-5" size="old">
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
