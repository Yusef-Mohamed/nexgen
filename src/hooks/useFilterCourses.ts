import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useMyCoursesStore } from "@/stores/MyCoursesStore";
import { axiosInstance } from "@/app/lib/utils";
import { ICourse } from "@/types";

/**
 * Hook to fetch and return courses for filtering
 * This hook is designed to be flexible for future user type-based changes
 * @returns Object containing courses and loading state
 */
export const useFilterCourses = ({ enable = true }: { enable?: boolean }) => {
  const { token, user } = useAuth();
  const { courses: userCourses, getCourses, isLoading } = useMyCoursesStore();
  const [instructorCourses, setInstructorCourses] = useState<ICourse[]>([]);
  const [marketerCourses, setMarketerCourses] = useState<ICourse[]>([]);
  const [isLoadingInstructorCourses, setIsLoadingInstructorCourses] =
    useState(false);
  const [isLoadingMarketerCourses, setIsLoadingMarketerCourses] =
    useState(false);
  const getInstructorCourses = useCallback(async () => {
    setIsLoadingInstructorCourses(true);
    const res = await axiosInstance.get(`/courses/getAll?status=active`);
    setInstructorCourses(res.data.data);
    setIsLoadingInstructorCourses(false);
  }, []);
  const getMarketerCourses = useCallback(async () => {
    setIsLoadingMarketerCourses(true);
    const res = await axiosInstance.get(
      `/marketing/getProfitableItemsByType?type=course`
    );
    setMarketerCourses(res.data.data);
    setIsLoadingMarketerCourses(false);
  }, []);

  useEffect(() => {
    if (!token || !user || !enable) return;
    if (user.isInstructor) {
      getInstructorCourses();
    }
    if (user.isMarketer) {
      getMarketerCourses();
    }
    if (!user.isInstructor && !user.isMarketer) {
      getCourses(token, user._id);
    }
  }, [
    token,
    user,
    getCourses,
    getInstructorCourses,
    getMarketerCourses,
    enable,
  ]);

  // Use Map to ensure unique courses by _id, memoized to prevent recalculation
  const courses = useMemo(() => {
    const uniqueCoursesMap = new Map<string, ICourse>();

    [...instructorCourses, ...marketerCourses, ...userCourses].forEach(
      (course) => {
        if (course._id && !uniqueCoursesMap.has(course._id)) {
          uniqueCoursesMap.set(course._id, course);
        }
      }
    );

    return Array.from(uniqueCoursesMap.values());
  }, [instructorCourses, marketerCourses, userCourses]);

  return {
    courses,
    isLoadingCourses:
      isLoading || isLoadingInstructorCourses || isLoadingMarketerCourses,
  };
};
