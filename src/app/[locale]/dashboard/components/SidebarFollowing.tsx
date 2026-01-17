"use client";
import { useAuth } from "@/components/auth-provider";
import UserAvatar from "@/components/UserAvatar";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import FollowBtn from "../community/profile/[userId]/components/FollowBtn";
import { IUser } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const SidebarFollowing = () => {
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
  const [showAll, setShowAll] = useState<boolean>(false);
  const pathname = usePathname();
  const isInstructorDashboard = pathname.includes("instructor-dashboard");

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
        setShowAll(false); // Reset show all when new data is fetched
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

  return (
    <div className="max-xl:hidden">
      <h4 className="mb-3 sm:mb-6">{text("followingRecommendation")}</h4>
      {loading ? (
        <ul className="space-y-2 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <div className="flex cardShadowSm items-center justify-between px-2 py-1 border rounded">
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
        <>
          <ul className="space-y-2 sm:space-y-4">
            {users
              .filter((thisUser) => thisUser && thisUser.user._id !== user?._id)
              .slice(0, showAll ? users.length : 3)
              .map((thisUser) => (
                <li key={thisUser.user._id}>
                  <div className="flex cardShadowSm items-center border-primary/20 justify-between p-2 border transition-all duration-300 rounded-lg">
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
                        className="text-xs"
                        href={`${
                          isInstructorDashboard
                            ? "/instructor-dashboard"
                            : "/dashboard"
                        }/community/profile/${thisUser.user._id}`}
                      >
                        {thisUser.user.name.slice(0, 15)}
                      </Link>
                    </div>
                    <FollowBtn
                      sm
                      userId={thisUser.user._id}
                      className="rounded-sm"
                    />
                  </div>
                </li>
              ))}
          </ul>
          {users.filter(
            (thisUser) => thisUser && thisUser.user._id !== user?._id
          ).length > 3 &&
            !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-4 w-full text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {text("showMore") || "Show More"}
              </button>
            )}
        </>
      )}
    </div>
  );
};

export default SidebarFollowing;
