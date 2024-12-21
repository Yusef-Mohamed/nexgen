"use client";
import { useAuth } from "@/components/auth-provider";
import UserAvatar from "@/components/UserAvatar";
import { Link } from "@/i18n/routing";
import { useMyCoursesStore } from "@/stores/MyCoursesStore";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import FollowBtn from "../community/profile/[userId]/components/FollowBtn";

const CommunitySidebar = () => {
  const text = useTranslations("dashboard");
  const { getCourses, courses } = useMyCoursesStore();
  const { token, user } = useAuth();
  useEffect(() => {
    if (token && user) getCourses(token, user._id);
  }, [token, user, getCourses]);
  const users = useMemo(() => {
    const arrayOfArrayOfUsers = courses.map((course) => course.users);
    return arrayOfArrayOfUsers.flat();
  }, [courses]);
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 76px)",
        top: "76px",
        height: "calc(100vh - 76px)",
      }}
      className="w-full max-w-2xl p-4 py-4 overflow-auto bg-clear-ground lg:sticky max-xl:mx-auto xl:w-80 sm:py-8"
    >
      <h2 className="mb-3 sm:mb-6">{text("followingRecommendation")}</h2>
      <ul className="space-y-2 sm:space-y-4">
        {users.map((thisUser) =>
          thisUser && thisUser.id !== user?._id ? (
            <li key={thisUser.id}>
              <div className="flex items-center justify-between px-2 py-1 border rounded">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/community/profile/${thisUser.id}`}>
                    <UserAvatar
                      user={{
                        name: thisUser.name,
                        profileImg: thisUser.profileImg,
                      }}
                    />
                  </Link>{" "}
                  <Link
                    className="text-sm"
                    href={`/dashboard/community/profile/${thisUser.id}`}
                  >
                    {thisUser.name.slice(0, 15)}
                  </Link>
                </div>
                <FollowBtn sm userId={thisUser.id} />
              </div>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};

export default CommunitySidebar;
