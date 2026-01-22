"use client";

import { axiosInstance } from "@/app/lib/utils";
import { IUser } from "@/types";
import { AxiosError } from "axios";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Link } from "@/i18n/navigation";
import UserAvatar from "@/components/UserAvatar";
import Image from "next/image";
import FollowBtn from "@/app/[locale]/dashboard/community/profile/[userId]/components/FollowBtn";
import DisplayPosts from "@/app/[locale]/dashboard/components/DisplayPosts";
import CommunitySidebar from "@/app/[locale]/dashboard/components/CommunitySidebar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfileComponent = ({
  userId,
  locale,
  isInstructorDashboard,
}: {
  userId: string;
  locale: string;
  isInstructorDashboard: boolean;
}) => {
  const [thisUser, setThisUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getThisUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setThisUser(response.data.data);
      } catch (e) {
        const error = e as AxiosError;
        console.log(error.response?.data);
        setThisUser(null);
      } finally {
        setLoading(false);
      }
    };

    getThisUser();
  }, [userId]);

  if (loading) {
    return (
      <main className="flex xl:flex-row relative justify-center flex-col-reverse bg-background">
        <section className="flex-1 w-full xl:max-w-4xl px-4 py-6  space-y-3 sm:px-4 sm:py-6 sm:space-y-6">
          <div className="overflow-hidden rounded-md bg-clear-ground cardShadow">
            {/* Back link skeleton */}
            <div className="flex items-center w-full gap-2 p-6 px-6 bg-clear-ground">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-32" />
            </div>
            {/* Cover image skeleton */}
            <div className="w-full aspect-video bg-muted">
              <Skeleton className="w-full h-full" />
            </div>
            {/* Avatar and follow button skeleton */}
            <div className="flex items-end justify-between px-4 -mt-20 md:-mt-40 sm:-mt-20">
              <div className="border-[10px] rounded-full border-clear-ground w-fit">
                <Skeleton className="w-32 h-32 sm:h-40 sm:w-40 md:w-52 md:h-52 rounded-full" />
              </div>
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
            {/* Name and bio skeleton */}
            <div className="p-6 pt-0">
              <Skeleton className="h-6 w-48 mt-6" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
          </div>
          {/* Posts skeleton */}
          <div className="space-y-3 sm:space-y-6">
            <Skeleton className="h-64 w-full rounded-md" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        </section>
        <CommunitySidebar />
      </main>
    );
  }

  if (!thisUser) {
    return (
      <main className="flex xl:flex-row relative flex-col-reverse bg-background">
        <section className="flex-1 w-full xl:max-w-4xl px-4 py-6  space-y-3 sm:px-4 sm:py-6 sm:space-y-6">
          <div className="overflow-hidden rounded-md bg-clear-ground cardShadow">
            <div className="p-6">User not found</div>
          </div>
        </section>
        <CommunitySidebar />
      </main>
    );
  }
  return (
    <main className="flex xl:flex-row relative justify-center flex-col-reverse bg-background">
      <section className="flex-1 w-full xl:max-w-4xl px-4 py-6  space-y-3 sm:px-4 sm:py-6 sm:space-y-6">
        <div className="overflow-hidden rounded-md bg-clear-ground cardShadow">
          <Link
            href={`${
              isInstructorDashboard ? "/instructor-dashboard" : "/dashboard"
            }/community?sharedTo=students`}
            className="flex items-center w-full gap-2 p-6 px-6 bg-clear-ground"
          >
            {locale === "ar" ? <FaArrowRightLong /> : <FaArrowLeftLong />}
            {thisUser.name}
          </Link>
          <div className="w-full aspect-video bg-muted ">
            {thisUser.coverImg && (
              <Image
                src={thisUser.coverImg}
                width={1920}
                height={1080}
                alt="cover image"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="flex items-end justify-between px-4 -mt-20 md:-mt-40 sm:-mt-20">
            <div className="border-[10px] rounded-full border-clear-ground w-fit">
              <UserAvatar
                user={thisUser}
                size="lg"
                className="w-32 h-32 sm:h-40 sm:w-40 md:w-52 md:h-52"
              />
            </div>
            <FollowBtn userId={userId} />
          </div>
          <div className="p-6 pt-0">
            <h2 className="mt-6 font-semibold">{thisUser.name}</h2>
            <p className="mt-2 text-text-3 md:text-lg">{thisUser.bio || ""}</p>
          </div>
        </div>
        <DisplayPosts userId={userId} />
      </section>
      <CommunitySidebar />
    </main>
  );
};

export default UserProfileComponent;
