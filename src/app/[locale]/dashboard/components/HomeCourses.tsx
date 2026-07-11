import { useAuth } from "@/components/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyLearningSummary } from "@/hooks/useMyCoursesQueries";
import { Link } from "@/i18n/navigation";
import { getDynamicString } from "@/lib/utils";
import { ICourse } from "@/types";
import { useTranslations } from "next-intl";
import { useMemo, useSyncExternalStore } from "react";
import { LearnCourseCard } from "../learn/components/LearnCourseCard";
import { BookOpenCheck, Clock3, PlayCircle } from "lucide-react";

const emptySubscribe = () => () => {};
const getHydratedSnapshot = () => true;
const getServerSnapshot = () => false;

const useIsHydrated = () =>
  useSyncExternalStore(
    emptySubscribe,
    getHydratedSnapshot,
    getServerSnapshot,
  );

const CourseSkeleton = () => {
  return (
    <div className="flex w-full items-center rounded-2xl border border-primary/10 bg-clear-ground p-4 sm:p-5">
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
  const isHydrated = useIsHydrated();

  const newestIncompleteCourse = useMemo(() => {
    return courses.reduce<(typeof courses)[number] | null>((newest, course) => {
      if (
        Number(course.userScore?.totalProgress || course.totalProgress) >= 100
      ) {
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

  if (!isHydrated) return null;

  return (
    <section className="space-y-4">
      {isGettingCourses ? (
        <>
          <HomeCoursesHeader title={text("continueYourLearningJourney")} />
          <CourseSkeleton />
        </>
      ) : newestIncompleteCourse ? (
        <>
          <HomeCoursesHeader title={text("continueYourLearningJourney")} />
          <div className="space-y-2">
            <div className="[&>div]:border [&>div]:border-primary/10 [&>div]:bg-clear-ground [&>div]:shadow-none">
              <LearnCourseCard course={newestIncompleteCourse} minimal />
            </div>
            <NextLessonStrip course={newestIncompleteCourse} />
          </div>
        </>
      ) : null}
    </section>
  );
};

const HomeCoursesHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
        <BookOpenCheck className="size-5" />
      </span>
      <h2 className="text-base font-black text-text-1 sm:text-lg">{title}</h2>
    </div>
  );
};

const NextLessonStrip = ({ course }: { course: ICourse }) => {
  const text = useTranslations("courseHome");
  const courseId = course._id || course.id;
  const learnHref = `/dashboard/learn/${courseId}`;

  if (!course.lastLesson) {
    return null;
  }

  return (
    <Link
      href={`${learnHref}?display=lesson&lesson=${course.lastLesson._id}`}
      className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-clear-ground px-3 py-2.5 text-start transition-colors hover:border-primary/30 hover:bg-primary/10"
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <PlayCircle className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-wide text-primary">
          {text("nextLecture")}
        </span>
        <span className="mt-0.5 block truncate text-sm font-black text-text-1 group-hover:text-primary">
          {getDynamicString(course.lastLesson.title)}
        </span>
        <span className="mt-0.5 flex min-w-0 items-center gap-2 text-xs font-semibold text-text-3">
          <span className="truncate">
            {getDynamicString(course.lastLesson.section.title)}
          </span>
          <span className="shrink-0">-</span>
          <Clock3 className="size-3.5 shrink-0 text-primary" />
          <span className="shrink-0">
            {course.lastLesson.lessonDuration} {text("min")}
          </span>
        </span>
      </span>
      <span className="hidden shrink-0 rounded-full border border-primary/10 bg-background-2 px-3 py-1 text-xs font-bold text-primary transition-colors group-hover:border-primary/30 sm:inline-flex">
        {text("resumeLesson")}
      </span>
    </Link>
  );
};

export default HomeCourses;
