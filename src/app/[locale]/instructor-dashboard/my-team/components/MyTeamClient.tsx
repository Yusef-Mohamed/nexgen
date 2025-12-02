"use client";
import React from "react";

import { useAuth } from "@/components/auth-provider";

import UsersList from "./UsersList";
import SalesAnalytics from "./SalesAnalytics";
import { useFilterCourses } from "@/hooks/useFilterCourses";
import { useFilterCoursePackages } from "@/hooks/useFilterCoursePackages";
import { useFilterPackages } from "@/hooks/useFilterPackages";
import CouponManagement from "@/app/[locale]/dashboard/marketing/components/CouponManagement";

const MyTeamClient = () => {
  const { token, user } = useAuth();

  const { courses, isLoadingCourses } = useFilterCourses({
    enable: true,
  });
  const { coursePackages } = useFilterCoursePackages({
    enable: true,
  });
  const { packages } = useFilterPackages({
    enable: true,
  });
  return (
    <div className="space-y-8">
      <SalesAnalytics />
      <UsersList
        token={token}
        user={user}
        courses={courses}
        coursePackages={coursePackages}
        packages={packages}
        isLoadingCourses={isLoadingCourses}
      />
      <CouponManagement />
    </div>
  );
};

export default MyTeamClient;
