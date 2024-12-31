import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { useMyCoursesStore } from "@/stores/MyCoursesStore";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";

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
  const {
    courses,
    isLoading: isGettingCourses,
    getCourses,
  } = useMyCoursesStore();
  const locale = useLocale();
  const text = useTranslations("courseHome");

  useEffect(() => {
    if (token && user) getCourses(token, user._id);
  }, [token, user]);

  const getNewestIncompleteCourse = () => {
    // Filter for incomplete courses (totalProgress < 100)
    const incompleteCourses = courses.filter(
      (course) => course.totalProgress !== 100
    );

    // Sort by newest lesson exam attempt date
    return incompleteCourses.sort((a, b) => {
      const aLatestAttempt =
        a.userScore?.lessonsScores
          ?.map((score) => new Date(score.attemptDate))
          .sort((d1, d2) => d2.getTime() - d1.getTime())[0] || new Date(0);

      const bLatestAttempt =
        b.userScore?.lessonsScores
          ?.map((score) => new Date(score.attemptDate))
          .sort((d1, d2) => d2.getTime() - d1.getTime())[0] || new Date(0);

      return bLatestAttempt.getTime() - aLatestAttempt.getTime();
    })[0];
  };

  const newestIncompleteCourse = getNewestIncompleteCourse();

  return (
    <div className="space-y-3">
      {isGettingCourses ? (
        <>
          <h2>{text("continueYourLearningJourney")}</h2>
          <CourseSkeleton />
        </>
      ) : newestIncompleteCourse ? (
        <>
          <h2>{text("continueYourLearningJourney")}</h2>
          <div
            className="flex items-center w-full p-3 rounded-md cardShadow sm:p-6 bg-background"
            key={newestIncompleteCourse._id}
          >
            <div className="basis-2/3">
              <h4 className="mb-8 max-sm:mb-4 h2s">
                {newestIncompleteCourse.title}
              </h4>
              <div className="flex items-center w-full gap-2">
                <div className="w-full h-1 overflow-hidden rounded-full md:max-w-xs bg-muted">
                  <div
                    className="w-full h-1 rounded-full bg-primary"
                    style={{
                      transform: `translateX(${locale === "en" ? "-" : ""}${
                        100 -
                        Number(
                          newestIncompleteCourse.userScore?.totalProgress || 0
                        )
                      }%)`,
                    }}
                  ></div>
                </div>
              </div>
              <span className="block mt-2 mb-4 text-sm max-sm:mt-1 max-sm:mb-2">
                {text("completedPercentage")}{" "}
                {parseInt(
                  newestIncompleteCourse.userScore?.totalProgress?.toString() ||
                    "0"
                )}
                %
              </span>
              <Button
                asChild
                className="max-sm:h-8 max-sm:text-xs max-sm:rounded max-sm:w-fit max-sm:min-w-24 w-fit"
              >
                <Link href={`/dashboard/learn/${newestIncompleteCourse._id}`}>
                  {text("continueLearning")}
                </Link>
              </Button>
            </div>
            <div className="basis-1/3">
              <Image
                src={newestIncompleteCourse.image}
                alt={newestIncompleteCourse.title}
                width={600}
                height={400}
                className="object-cover w-full rounded-md aspect-[1656/931] max-w-52"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default HomeCourses;
