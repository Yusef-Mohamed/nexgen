import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { usePackagesStore } from "@/stores/MyPackages";
import { axiosInstance } from "@/app/lib/utils";
import { IPackage } from "@/types";

/**
 * Hook to fetch and return packages for filtering
 * This hook is designed to be flexible for future user type-based changes
 * @returns Object containing packages and loading state
 */
export const useFilterPackages = ({
  enable = true,
  onlyActive = true,
}: {
  enable?: boolean;
  onlyActive?: boolean;
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
    const res = await axiosInstance.get(`/packages/getAll?status=active`);
    setInstructorPackages(res.data.data);
    setIsLoadingInstructorPackages(false);
  }, []);

  const getMarketerPackages = useCallback(async () => {
    setIsLoadingMarketerPackages(true);
    const res = await axiosInstance.get(
      `/marketing/getProfitableItemsByType?type=package`
    );
    setMarketerPackages(res.data.data);
    setIsLoadingMarketerPackages(false);
  }, []);

  useEffect(() => {
    if (!token || !user || !enable) return;
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
  ]);

  // Use Map to ensure unique packages by _id, memoized to prevent recalculation
  const packages = useMemo(() => {
    // Extract packages from userPackages array (which contains { package: IPackage }[])
    const baseUserPackagesList = onlyActive
      ? userPackages
          .filter((item) => new Date(item.endDate) > new Date())
          .map((item) => item.package)
      : userPackages.map((item) => item.package);
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
  }, [instructorPackages, marketerPackages, userPackages, onlyActive]);

  return {
    packages,
    isLoadingPackages:
      isLoading || isLoadingInstructorPackages || isLoadingMarketerPackages,
  };
};
