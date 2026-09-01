"use client";
import React, { useSyncExternalStore } from "react";

import { useAuth } from "@/components/auth-provider";

import UsersList from "./UsersList";
import SalesAnalytics from "./SalesAnalytics";
import { useFilterCourses } from "@/hooks/useFilterCourses";
import { useFilterCoursePackages } from "@/hooks/useFilterCoursePackages";
import { useFilterPackages } from "@/hooks/useFilterPackages";
import InvitationLinksBlock from "@/app/[locale]/dashboard/marketing/components/InvitationLinksBlock";

const MyTeamClient = () => {
  const clientReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
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
  if (!clientReady) {
    return <div aria-busy="true" className="min-h-[20rem]" />;
  }

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
      {user?.isMarketer ? <InvitationLinksBlock /> : null}
    </div>
  );
};

export default MyTeamClient;
