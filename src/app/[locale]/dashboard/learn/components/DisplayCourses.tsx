"use client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useMyCoursesStore } from "@/stores/MyCoursesStore";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { PiExam } from "react-icons/pi";
import { FilterTabs } from "@/components/filters/FilterTabs";
import { LearnCourseCard, LearnCourseCardSkeleton } from "./LearnCourseCard";

const DisplayCourses = () => {
  const text = useTranslations("learn");
  const { getCourses, courses, isLoading } = useMyCoursesStore();
  const { token, user } = useAuth();
  const [show, setShow] = useState<"completed" | "notCompleted">(
    "notCompleted"
  );

  useEffect(() => {
    getCourses(token, user?._id || "");
  }, [getCourses, token, user]);
  const toShowCourses = useMemo(() => {
    if (show === "completed") {
      return courses.filter(
        (course) => course.courseProgress?.status === "Completed"
      );
    } else {
      return courses.filter(
        (course) => course.courseProgress?.status !== "Completed"
      );
    }
  }, [show, courses]);
  console.log(courses);
  return (
    <section className="space-y-4">
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
        toShowCourses.map((course) => (
          <LearnCourseCard key={course._id} course={course} />
        ))
      )}
    </section>
  );
};

export default DisplayCourses;
