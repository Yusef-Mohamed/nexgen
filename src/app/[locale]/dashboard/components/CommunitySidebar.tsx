"use client";
import { useAuth } from "@/components/auth-provider";
import UserAvatar from "@/components/UserAvatar";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import FollowBtn from "../community/profile/[userId]/components/FollowBtn";
import { IUser } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const CommunitySidebar = () => {
  const text = useTranslations("dashboard");
  const { token, user } = useAuth();
  const [users, setUsers] = useState<
    {
      postCount: number;
      user: IUser;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPosters = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/posts/topPosters");

        // Handle different response structures
        const usersData = response.data?.data || response.data || [];
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        const typedError = err as AxiosError<{ message: string }>;
        const errorMessage =
          typedError?.response?.data?.message ||
          typedError?.message ||
          "Failed to fetch top posters";
        setError(errorMessage);
        console.error("Error fetching top posters:", errorMessage);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosters();
  }, [token]);
  const pathname = usePathname();
  const isInstructorDashboard = pathname.includes("instructor-dashboard");
  if (isInstructorDashboard) {
    return null;
  }
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
      {loading ? (
        <ul className="space-y-2 sm:space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>
              <div className="flex items-center justify-between px-2 py-1 border rounded">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </li>
          ))}
        </ul>
      ) : error ? (
        <div className="text-sm text-muted-foreground p-2">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-sm text-muted-foreground p-2">
          {text("noUsersFound") || "No users found"}
        </div>
      ) : (
        <ul className="space-y-2 sm:space-y-4">
          {users
            .filter((thisUser) => thisUser && thisUser.user._id !== user?._id)
            .map((thisUser) => (
              <li key={thisUser.user._id}>
                <div className="flex items-center justify-between px-2 py-1 hover:bg-muted/50 transition-all duration-300 rounded">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`${
                        isInstructorDashboard
                          ? "/instructor-dashboard"
                          : "/dashboard"
                      }/community/profile/${thisUser.user._id}`}
                    >
                      <UserAvatar
                        user={{
                          name: thisUser.user.name,
                          profileImg: thisUser.user.profileImg,
                        }}
                      />
                    </Link>{" "}
                    <Link
                      className="text-sm"
                      href={`${
                        isInstructorDashboard
                          ? "/instructor-dashboard"
                          : "/dashboard"
                      }/community/profile/${thisUser.user._id}`}
                    >
                      {thisUser.user.name.slice(0, 15)}
                    </Link>
                  </div>
                  <FollowBtn onlyText userId={thisUser.user._id} />
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default CommunitySidebar;
