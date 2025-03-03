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
    const allUsers = arrayOfArrayOfUsers.flat();

    // Use a Set to filter out duplicate users based on _id
    const uniqueUsers = Array.from(
      new Set(allUsers.map((user) => user._id))
    ).map((id) => allUsers.find((user) => user._id === id));

    return uniqueUsers;
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
          thisUser && thisUser._id !== user?._id ? (
            <li key={thisUser._id}>
              <div className="flex items-center justify-between px-2 py-1 border rounded">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/community/profile/${thisUser._id}`}>
                    <UserAvatar
                      user={{
                        name: thisUser.name,
                        profileImg: thisUser.profileImg,
                      }}
                    />
                  </Link>{" "}
                  <Link
                    className="text-sm"
                    href={`/dashboard/community/profile/${thisUser._id}`}
                  >
                    {thisUser.name.slice(0, 15)}
                  </Link>
                </div>
                <FollowBtn sm userId={thisUser._id} />
              </div>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};

export default CommunitySidebar;
