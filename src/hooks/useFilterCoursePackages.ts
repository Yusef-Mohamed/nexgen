import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useMyCoursePackagesStore } from "@/stores/MyCoursePackages";
import { axiosInstance } from "@/app/lib/utils";
import { ICoursePackage } from "@/types";

/**
 * Hook to fetch and return course packages for filtering
 * This hook is designed to be flexible for future user type-based changes
 * @returns Object containing coursePackages and loading state
 */
export const useFilterCoursePackages = ({
  enable = true,
}: {
  enable?: boolean;
}) => {
  const { token, user } = useAuth();
  const {
    coursePackages: userCoursePackages,
    getCoursePackages,
    isLoading,
  } = useMyCoursePackagesStore();
  const [instructorCoursePackages, setInstructorCoursePackages] = useState<
    ICoursePackage[]
  >([]);
  const [marketerCoursePackages, setMarketerCoursePackages] = useState<
    ICoursePackage[]
  >([]);
  const [
    isLoadingInstructorCoursePackages,
    setIsLoadingInstructorCoursePackages,
  ] = useState(false);
  const [isLoadingMarketerCoursePackages, setIsLoadingMarketerCoursePackages] =
    useState(false);

  const getInstructorCoursePackages = useCallback(async () => {
    setIsLoadingInstructorCoursePackages(true);
    const res = await axiosInstance.get(`/coursePackages/getAll?status=active`);
    setInstructorCoursePackages(res.data.data);
    setIsLoadingInstructorCoursePackages(false);
  }, []);

  const getMarketerCoursePackages = useCallback(async () => {
    setIsLoadingMarketerCoursePackages(true);
    const res = await axiosInstance.get(
      `/marketing/getProfitableItemsByType?type=coursePackage`
    );
    setMarketerCoursePackages(res.data.data);
    setIsLoadingMarketerCoursePackages(false);
  }, []);

  useEffect(() => {
    if (!token || !user || !enable) return;
    if (user.isInstructor) {
      getInstructorCoursePackages();
    }
    if (user.isMarketer) {
      getMarketerCoursePackages();
    }
    if (!user.isInstructor && !user.isMarketer) {
      getCoursePackages(token);
    }
  }, [
    token,
    user,
    getCoursePackages,
    getInstructorCoursePackages,
    getMarketerCoursePackages,
    enable,
  ]);

  // Use Map to ensure unique course packages by _id, memoized to prevent recalculation
  const coursePackages = useMemo(() => {
    const uniqueCoursePackagesMap = new Map<string, ICoursePackage>();

    [
      ...instructorCoursePackages,
      ...marketerCoursePackages,
      ...userCoursePackages,
    ].forEach((coursePkg) => {
      if (coursePkg._id && !uniqueCoursePackagesMap.has(coursePkg._id)) {
        uniqueCoursePackagesMap.set(coursePkg._id, coursePkg);
      }
    });

    return Array.from(uniqueCoursePackagesMap.values());
  }, [instructorCoursePackages, marketerCoursePackages, userCoursePackages]);

  return {
    coursePackages,
    isLoadingCoursePackages:
      isLoading ||
      isLoadingInstructorCoursePackages ||
      isLoadingMarketerCoursePackages,
  };
};
