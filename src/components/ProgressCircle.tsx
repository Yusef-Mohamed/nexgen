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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { selectedUser } = useAnalyticsStore((state) => state);
  const { token } = useAuth();

  // Extract unique categories from user's courses
  const availableCategories = useMemo(() => {
    if (!coursesWithRealProgress.length) return [];

    const categoryMap = new Map();
    coursesWithRealProgress.forEach(({ course }) => {
      if (!categoryMap.has(course.category._id)) {
        categoryMap.set(course.category._id, {
          _id: course.category._id,
          title: course.category.title,
        });
      }
    });

    return Array.from(categoryMap.values());
  }, [coursesWithRealProgress]);

  // Filter courses by selected category and recalculate accumulated progress
  const filteredCoursesWithProgress = useMemo(() => {
    if (!coursesWithProgress || !selectedCategory) return coursesWithProgress;

    const filteredCourses = coursesWithProgress.filter(
      (course) => course.course.category._id === selectedCategory
    );

    if (filteredCourses.length === 0) return [];

    // Recalculate accumulated progress for filtered courses
    let accumulatedProgress = 0;
    return filteredCourses
      .map((course, index) => {
        if (course.progress === 0) return { ...course, progress: 0 };
        if (index !== 0) {
          accumulatedProgress += course.progress;
        } else {
          accumulatedProgress = course.progress;
        }
        return { ...course, progress: accumulatedProgress };
      })
      .sort((a, b) => b.progress - a.progress);
  }, [coursesWithProgress, selectedCategory]);

  // Filter real progress courses by selected category
  const filteredCoursesWithRealProgress = useMemo(() => {
    if (!coursesWithRealProgress.length || !selectedCategory)
      return coursesWithRealProgress;

    return coursesWithRealProgress.filter(
      (course) => course.course.category._id === selectedCategory
    );
  }, [coursesWithRealProgress, selectedCategory]);

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
      {!isLoading && coursesWithProgress && (
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
            layers={
              filteredCoursesWithProgress?.map((course) => ({
                progress:
                  course.progress * (course.course.coursePercentage / 100) || 0,
                darkColor: course.course.colors?.bgDarkMode || "#000000",
                lightColor: course.course.colors?.bgColor || "#000000",
              })) || []
            }
            totalProgress={
              filteredCoursesWithProgress?.[0]
                ? parseInt(
                    (
                      filteredCoursesWithProgress[0].progress *
                      (filteredCoursesWithProgress[0].course.coursePercentage /
                        100)
                    ).toFixed(0)
                  )
                : 0
            }
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            {filteredCoursesWithRealProgress.map((course, index) => {
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
