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
    <section className="space-y-4 max-w-6xl w-full mx-auto">
      <FilterTabs
        options={[
          { value: "notCompleted", label: text("notCompleted") },
          { value: "completed", label: text("completed") },
        ]}
        activeValue={show}
        onChange={(value) => setShow(value as typeof show)}
      />
      {isLoading ? (
        [1, 2, 3].map((index) => <LearnCourseCardSkeleton key={index} />)
      ) : toShowCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-6 p-4 rounded-full bg-muted/20">
            <PiExam className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            {show === "completed"
              ? text("noCompletedCourses")
              : text("noInProgressCourses")}
          </h3>
          <p className="mb-6 text-muted-foreground max-w-md">
            {show === "completed"
              ? text("noCompletedCoursesDescription")
              : text("noInProgressCoursesDescription")}
          </p>
          <Button asChild>
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
    </section>
  );
};

export default DisplayCourses;
