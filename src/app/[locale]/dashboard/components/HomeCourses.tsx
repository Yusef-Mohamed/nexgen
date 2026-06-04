import { useAuth } from "@/components/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyLearningSummary } from "@/hooks/useMyCoursesQueries";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { LearnCourseCard } from "../learn/components/LearnCourseCard";

const CourseSkeleton = () => {
  return (
    <div className="flex items-center w-full p-3 rounded-md cardShadow sm:p-6 bg-background">
      <div className="basis-2/3">
        <Skeleton className="w-48 h-4 mb-8 max-sm:mb-4" />
        <div className="flex items-center w-full gap-2">
          <Skeleton className="w-full h-1 rounded-full md:max-w-xs" />
        </div>
        <Skeleton className="w-24 h-4 mt-2 mb-4 max-sm:mt-1 max-sm:mb-2" />
        <Skeleton className="w-32 rounded h-9 max-sm:h-8" />
      </div>
      <div className="basis-1/3">
        <Skeleton className="max-w-52 w-full aspect-[1656/931] rounded-md" />
      </div>
    </div>
  );
};

const HomeCourses = () => {
  const { token, user } = useAuth();
  const { data: courses = [], isLoading: isGettingCourses } =
    useMyLearningSummary(token, user?._id);
  const text = useTranslations("courseHome");

  const newestIncompleteCourse = useMemo(() => {
    return courses.reduce<(typeof courses)[number] | null>((newest, course) => {
      if (Number(course.userScore?.totalProgress || course.totalProgress) >= 100) {
        return newest;
      }

      const latestAttempt = Math.max(
        0,
        ...(course.userScore?.lessonsScores || []).map((score) =>
          new Date(score.attemptDate).getTime(),
        ),
      );
      const newestAttempt = Math.max(
        0,
        ...(newest?.userScore?.lessonsScores || []).map((score) =>
          new Date(score.attemptDate).getTime(),
        ),
      );

      return latestAttempt > newestAttempt ? course : newest || course;
    }, null);
  }, [courses]);

  return (
    <div className="space-y-3 mb-6">
      {isGettingCourses ? (
        <>
          <h2>{text("continueYourLearningJourney")}</h2>
          <CourseSkeleton />
        </>
      ) : newestIncompleteCourse ? (
        <>
          <h2>{text("continueYourLearningJourney")}</h2>
          <LearnCourseCard
            course={newestIncompleteCourse}
            minimal={true}
          />
        </>
      ) : null}
    </div>
  );
};

export default HomeCourses;
