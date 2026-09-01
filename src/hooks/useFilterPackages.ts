import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { usePackagesStore } from "@/stores/MyPackages";
import { axiosInstance } from "@/app/lib/utils";
import { IPackage } from "@/types";

type PackageRole = "student" | "instructor" | "marketer";

/**
 * Hook to fetch and return packages for filtering
 * This hook is designed to be flexible for future user type-based changes
 * @returns Object containing packages and loading state
 */
export const useFilterPackages = ({
  enable = true,
  onlyActive = true,
  role,
}: {
  enable?: boolean;
  onlyActive?: boolean;
  role?: PackageRole;
}) => {
  const { token, user } = useAuth();
  const { packages: userPackages, getPackages, isLoading } = usePackagesStore();
  const [instructorPackages, setInstructorPackages] = useState<IPackage[]>([]);
  const [marketerPackages, setMarketerPackages] = useState<IPackage[]>([]);
  const [isLoadingInstructorPackages, setIsLoadingInstructorPackages] =
    useState(false);
  const [isLoadingMarketerPackages, setIsLoadingMarketerPackages] =
    useState(false);

  const getInstructorPackages = useCallback(async () => {
    setIsLoadingInstructorPackages(true);
    try {
      const res = await axiosInstance.get(`/packages/getAll?status=active`);
      setInstructorPackages(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingInstructorPackages(false);
    }
  }, []);

  const getMarketerPackages = useCallback(async () => {
    setIsLoadingMarketerPackages(true);
    try {
      const res = await axiosInstance.get(
        `/marketing/getProfitableItemsByType?type=package`
      );
      setMarketerPackages(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMarketerPackages(false);
    }
  }, []);

  useEffect(() => {
    if (!token || !user || !enable) return;

    if (role === "student") {
      getPackages(token);
      return;
    }
    if (role === "instructor") {
      if (user.isInstructor) getInstructorPackages();
      return;
    }
    if (role === "marketer") {
      if (user.isMarketer) getMarketerPackages();
      return;
    }

    if (user.isInstructor) {
      getInstructorPackages();
    }
    if (user.isMarketer) {
      getMarketerPackages();
    }
    if (!user.isInstructor && !user.isMarketer) {
      getPackages(token);
    }
  }, [
    token,
    user,
    getPackages,
    getInstructorPackages,
    getMarketerPackages,
    enable,
    role,
  ]);

  // Use Map to ensure unique packages by _id, memoized to prevent recalculation
  const packages = useMemo(() => {
    // Extract packages from userPackages array (which contains { package: IPackage }[])
    const baseUserPackagesList = onlyActive
      ? userPackages
          .filter((item) => new Date(item.endDate) > new Date())
          .map((item) => item.package)
      : userPackages.map((item) => item.package);
    if (role === "student") return baseUserPackagesList;
    if (role === "instructor") return instructorPackages;
    if (role === "marketer") return marketerPackages;

    const uniquePackagesMap = new Map<string, IPackage>();

    [
      ...instructorPackages,
      ...marketerPackages,
      ...baseUserPackagesList,
    ].forEach((pkg) => {
      if (pkg._id && !uniquePackagesMap.has(pkg._id)) {
        uniquePackagesMap.set(pkg._id, pkg);
      }
    });

    return Array.from(uniquePackagesMap.values());
  }, [instructorPackages, marketerPackages, userPackages, onlyActive, role]);

  const isLoadingPackages =
    role === "student"
      ? isLoading
      : role === "instructor"
        ? isLoadingInstructorPackages
        : role === "marketer"
          ? isLoadingMarketerPackages
          : isLoading ||
            isLoadingInstructorPackages ||
            isLoadingMarketerPackages;

  return {
    packages,
    isLoadingPackages,
  };
};
