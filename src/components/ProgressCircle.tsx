import React, { useEffect, FC, useState } from "react";
import "../chart.css";
import { ICourse, ICourseProgress } from "@/types";
import ProgressUnit from "./ProgressUnit";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "./auth-provider";
const ProgressCircle: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [coursesWithProgress, setCoursesWithProgress] = useState<
    | {
        course: ICourse;
        progress: number;
      }[]
    | null
  >(null);
  const [coursesWithRealProgress, setCoursesWithRealProgress] = useState<
    {
      course: ICourse;
      progress: number;
    }[]
  >([]);
  const { selectedUser } = useAnalyticsStore((state) => state);
  const { token } = useAuth();
  const getData = async () => {
    setIsLoading(true);

    const coursesRes = await axiosInstance.get("/courses");
    const coursesList = coursesRes.data.data as ICourse[];

    const coursesWithProgressTemp = await Promise.all(
      coursesList.map(async (course) => {
        try {
          const courseScore = await axiosInstance.get(
            `/exams/userScore/${course._id}/${selectedUser}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const courseProgress = courseScore.data.data as ICourseProgress;
          return {
            course,
            progress:
              (Number(courseProgress.totalProgress) * course.coursePercentage) /
              100,
          };
        } catch (err) {
          console.log(err);
          return {
            course,
            progress: 0,
          };
        }
      })
    );
    coursesWithProgressTemp.sort((a, b) => b.progress - a.progress);
    setCoursesWithRealProgress(coursesWithProgressTemp);
    let accumulatedProgress = 0;

    setCoursesWithProgress(
      coursesWithProgressTemp
        .map((course, index) => {
          if (course.progress === 0) return { ...course, progress: 0 };
          if (index !== 0) {
            accumulatedProgress += course.progress;
          } else {
            accumulatedProgress = course.progress;
          }

          return { ...course, progress: accumulatedProgress };
        })
        .sort((a, b) => b.progress - a.progress)
    );
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedUser) getData();
  }, [selectedUser]);
  return (
    <div>
      {!isLoading && coursesWithProgress && (
        <>
          <ProgressUnit
            layers={coursesWithProgress.map((course) => ({
              progress: course.progress,
              darkColor: course.course.colors.bgDarkMode,
              lightColor: course.course.colors.bgColor,
            }))}
            totalProgress={parseInt(coursesWithProgress[0].progress.toFixed(0))}
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            {coursesWithRealProgress.map((course, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    style={{
                      backgroundColor: course.course.colors.bgColor,
                    }}
                    className="w-3 h-3 rounded-md dark:hidden"
                  ></div>
                  <div
                    style={{
                      backgroundColor: course.course.colors.bgDarkMode,
                    }}
                    className="hidden w-3 h-3 rounded-md dark:block"
                  ></div>

                  <span className="text-xs">
                    {course.course.title} ({course.progress.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
      {isLoading && (
        <>
          <div className="w-[12rem] aspect-square rounded-full bg-muted mx-auto" />
          <div className="flex flex-wrap items-center justify-center gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-[6rem] h-4 bg-muted my-2" />
                <div className="w-[1rem] h-4 bg-muted my-2" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressCircle;
