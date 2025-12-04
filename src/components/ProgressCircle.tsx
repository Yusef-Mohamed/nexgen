import React, { useEffect, FC, useState, useMemo, useCallback } from "react";
import "../chart.css";
import { ICourse, ICourseProgress } from "@/types";
import ProgressUnit from "./ProgressUnit";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "./auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDynamicString } from "@/lib/utils";
const ProgressCircle: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [coursesWithProgress, setCoursesWithProgress] = useState<
    {
      course: ICourse;
      progress: number;
    }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { selectedUser } = useAnalyticsStore((state) => state);
  const { token } = useAuth();

  // Extract unique categories from user's courses
  const availableCategories = useMemo(() => {
    if (!coursesWithProgress.length) return [];

    const categoryMap = new Map();
    coursesWithProgress.forEach(({ course }) => {
      if (!categoryMap.has(course.category._id)) {
        categoryMap.set(course.category._id, {
          _id: course.category._id,
          title: course.category.title,
        });
      }
    });

    return Array.from(categoryMap.values());
  }, [coursesWithProgress]);

  // Filter courses by selected category
  const filteredCourses = useMemo(() => {
    if (!coursesWithProgress.length || !selectedCategory)
      return coursesWithProgress;

    return coursesWithProgress.filter(
      (course) => course.course.category._id === selectedCategory
    );
  }, [coursesWithProgress, selectedCategory]);

  // Calculate accumulated progress for visualization (from real/individual progress)
  const coursesWithAccumulatedProgress = useMemo(() => {
    if (!filteredCourses.length) return [];

    let accumulatedProgress = 0;
    return filteredCourses
      .map((course) => {
        // Ensure progress is a valid number
        const progress =
          isNaN(course.progress) || course.progress == null
            ? 0
            : course.progress;

        // Accumulate progress (add current course progress to accumulated)
        accumulatedProgress += progress;

        return { ...course, progress: accumulatedProgress };
      })
      .sort((a, b) => b.progress - a.progress);
  }, [filteredCourses]);

  const getData = useCallback(async () => {
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
          const totalProgress = Number(courseProgress.totalProgress) || 0;
          const coursePercentage = course.coursePercentage || 0;
          const calculatedProgress = (totalProgress * coursePercentage) / 100;

          return {
            course,
            progress: isNaN(calculatedProgress) ? 0 : calculatedProgress,
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
    setCoursesWithProgress(coursesWithProgressTemp);

    // Set initial selected category to the first category
    if (coursesWithProgressTemp.length > 0) {
      const firstCategory = coursesWithProgressTemp[0].course.category._id;
      setSelectedCategory(firstCategory);
    }

    setIsLoading(false);
  }, [selectedUser, token]);

  useEffect(() => {
    if (selectedUser) getData();
  }, [selectedUser, getData]);
  return (
    <div>
      {!isLoading && coursesWithProgress.length > 0 && (
        <>
          {/* Category Select - only show if user has courses from multiple categories */}
          {availableCategories.length > 1 && (
            <div className="mb-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full border-2 border-transparent border-s-primary">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <ProgressUnit
            layers={coursesWithAccumulatedProgress.map((course) => {
              const coursePercentage = course.course.coursePercentage || 0;
              const progressValue = course.progress * (coursePercentage / 100);
              return {
                progress: isNaN(progressValue) ? 0 : progressValue,
                darkColor: course.course.colors?.bgDarkMode || "#000000",
                lightColor: course.course.colors?.bgColor || "#000000",
              };
            })}
            totalProgress={
              coursesWithAccumulatedProgress[0]
                ? (() => {
                    const firstCourse = coursesWithAccumulatedProgress[0];
                    const coursePercentage =
                      firstCourse.course.coursePercentage || 0;
                    const totalProgressValue =
                      firstCourse.progress * (coursePercentage / 100);
                    const roundedValue = Math.round(totalProgressValue);
                    return isNaN(roundedValue) ? 0 : roundedValue;
                  })()
                : 0
            }
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            {filteredCourses.map((course, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    style={{
                      backgroundColor: course.course.colors?.bgColor,
                    }}
                    className="w-3 h-3 rounded-md dark:hidden"
                  ></div>
                  <div
                    style={{
                      backgroundColor: course.course.colors?.bgDarkMode,
                    }}
                    className="hidden w-3 h-3 rounded-md dark:block"
                  ></div>

                  <span className="text-xs">
                    {getDynamicString(course.course.title)} (
                    {isNaN(course.progress) ? 0 : course.progress.toFixed(0)}%)
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
