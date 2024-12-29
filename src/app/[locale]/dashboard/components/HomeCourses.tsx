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
        <Skeleton className="max-w-52 w-full aspect-[1.29] rounded-md" />
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
  console.log(courses);
  return (
    <div className="space-y-3">
      {isGettingCourses ? (
        <>
          <h2>{text("continueYourLearningJourney")}</h2>
          <CourseSkeleton />
        </>
      ) : courses.length ? (
        <>
          <h2>{text("continueYourLearningJourney")}</h2>
          {courses.slice(0, 1).map((course) => (
            <div
              className="flex items-center w-full p-3 rounded-md cardShadow sm:p-6 bg-background"
              key={course._id}
            >
              <div className="basis-2/3">
                <h4 className="mb-8 max-sm:mb-4 h2s">{course.title}</h4>
                <div className="flex items-center w-full gap-2">
                  <div className="w-full h-1 overflow-hidden rounded-full md:max-w-xs bg-muted">
                    <div
                      className="w-full h-1 rounded-full bg-primary"
                      style={{
                        transform: `translateX(${locale === "en" ? "-" : ""}${
                          100 - Number(course.userScore?.totalProgress || 0)
                        }%)`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className="block mt-2 mb-4 text-sm max-sm:mt-1 max-sm:mb-2">
                  {text("completedPercentage")}{" "}
                  {parseInt(course.userScore?.totalProgress?.toString() || "0")}
                  %
                </span>
                <Button
                  asChild
                  className="max-sm:h-8 max-sm:text-xs max-sm:rounded max-sm:w-fit max-sm:min-w-24 w-fit"
                >
                  <Link href={`/dashboard/learn/${course._id}`}>
                    {text("continueLearning")}
                  </Link>
                </Button>
              </div>
              <div className="basis-1/3">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={600}
                  height={400}
                  className="object-cover w-full rounded-md aspect-[1.29] max-w-52"
                />
              </div>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default HomeCourses;
