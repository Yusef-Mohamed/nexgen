"use client";

import { axiosInstance } from "@/app/lib/utils";
import { IUser } from "@/types";
import { AxiosError } from "axios";
import { Link } from "@/i18n/navigation";
import UserAvatar from "@/components/UserAvatar";
import Image from "next/image";
import FollowBtn from "@/app/[locale]/dashboard/community/profile/[userId]/components/FollowBtn";
import DisplayPosts from "@/app/[locale]/dashboard/components/DisplayPosts";
import CommunitySidebar from "@/app/[locale]/dashboard/components/CommunitySidebar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardText = ReturnType<typeof useTranslations>;

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
  const dashboardText = useTranslations("dashboard");
  const baseDashboardHref = isInstructorDashboard
    ? "/instructor-dashboard"
    : "/dashboard";

  useEffect(() => {
    const getThisUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/users/" + userId);
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
      <ProfileFrame>
        <ProfileSkeleton />
      </ProfileFrame>
    );
  }

  if (!thisUser) {
    return (
      <ProfileFrame>
        <div className="rounded-2xl border border-primary/10 bg-clear-ground p-6 text-text-2">
          User not found
        </div>
      </ProfileFrame>
    );
  }

  const communityHref = baseDashboardHref + "/community?sharedTo=students";

  return (
    <ProfileFrame>
      <ProfileCardShowcase
        backHref={communityHref}
        dashboardText={dashboardText}
        isInstructorDashboard={isInstructorDashboard}
        locale={locale}
        user={thisUser}
        userId={userId}
      />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
            <MessageSquareText className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-black text-text-1 sm:text-lg">
              {dashboardText("community")}
            </h2>
            <p className="truncate text-sm text-text-3">{thisUser.name}</p>
          </div>
        </div>
        <DisplayPosts userId={userId} />
      </section>
    </ProfileFrame>
  );
};

const ProfileFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative overflow-hidden bg-background pb-40">
      <div className="relative z-10 mx-auto grid w-full gap-4 px-3 py-4 sm:px-5 lg:px-6 xl:grid-cols-[minmax(0,780px)_20rem] 2xl:max-w-[1260px]">
        <section className="min-w-0 space-y-5">{children}</section>
        <CommunitySidebar />
      </div>
    </main>
  );
};

const ProfileCardShowcase = ({
  backHref,
  dashboardText,
  isInstructorDashboard,
  locale,
  user,
  userId,
}: {
  backHref: string;
  dashboardText: DashboardText;
  isInstructorDashboard: boolean;
  locale: string;
  user: IUser;
  userId: string;
}) => {
  const BackIcon = locale === "ar" ? ArrowRight : ArrowLeft;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-clear-ground px-4 py-3 sm:px-5">
        <Link
          href={backHref}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/10 bg-background-2 px-3 text-sm font-bold text-text-3 transition-colors hover:border-primary/30 hover:text-primary"
        >
          <BackIcon className="size-4" />
          {dashboardText("community")}
        </Link>
        <div className="flex min-w-0 items-center gap-2 text-sm font-black text-text-1">
          <span className="inline-flex size-9 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
            <UserRound className="size-4" />
          </span>
          <span className="truncate">{dashboardText("profile")}</span>
        </div>
      </div>

      <ConversationProfileCard
        dashboardText={dashboardText}
        isInstructorDashboard={isInstructorDashboard}
        user={user}
        userId={userId}
      />
    </section>
  );
};

type ProfileCardProps = {
  dashboardText: DashboardText;
  isInstructorDashboard: boolean;
  user: IUser;
  userId: string;
};

const ConversationProfileCard = ({
  dashboardText,
  isInstructorDashboard,
  user,
  userId,
}: ProfileCardProps) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
      <div className="relative h-36 bg-background-2 sm:h-44">
        <ProfileCover user={user} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/25 via-transparent to-secondary/20" />
      </div>
      <div className="p-5 sm:p-6">
        <div className="-mt-20 mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <UserAvatar
            user={user}
            size="lg"
            className="size-24 border-[6px] border-clear-ground shadow-sm sm:size-28"
          />
          <ProfileFollowAction
            isInstructorDashboard={isInstructorDashboard}
            small
            userId={userId}
          />
        </div>
        <div className="min-w-0 space-y-4">
          <ProfileIdentity
            bioFallback={dashboardText("profileBioFallback")}
            compact
            user={user}
          />
        </div>
      </div>
    </article>
  );
};

const ProfileCover = ({ user }: { user: IUser }) => {
  if (user.coverImg) {
    return (
      <Image
        src={user.coverImg}
        alt=""
        fill
        sizes="(min-width: 1280px) 780px, 100vw"
        className="object-cover"
      />
    );
  }

  return (
    <>
      <Image
        src="/images/community/profile-cover-light.png"
        alt=""
        fill
        sizes="(min-width: 1280px) 780px, 100vw"
        className="object-cover dark:hidden"
      />
      <Image
        src="/images/community/profile-cover-dark.png"
        alt=""
        fill
        sizes="(min-width: 1280px) 780px, 100vw"
        className="hidden object-cover dark:block"
      />
    </>
  );
};

const ProfileIdentity = ({
  bioFallback,
  compact,
  dark,
  hideBio,
  user,
}: {
  bioFallback?: string;
  compact?: boolean;
  dark?: boolean;
  hideBio?: boolean;
  user: IUser;
}) => (
  <div className="min-w-0 pb-1">
    <div className="flex flex-wrap items-center gap-2">
      <h1
        className={cn(
          "truncate font-black",
          compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl",
          dark ? "text-clear-ground" : "text-text-1",
        )}
      >
        {user.name}
      </h1>
    </div>
    {!hideBio && (user.bio || bioFallback) && (
      <p
        className={cn(
          "mt-2 max-w-2xl text-sm leading-6 sm:text-base",
          dark ? "text-clear-ground/85" : "text-text-2",
        )}
      >
        {user.bio || bioFallback}
      </p>
    )}
  </div>
);

const ProfileFollowAction = ({
  isInstructorDashboard,
  small,
  userId,
}: {
  isInstructorDashboard: boolean;
  small?: boolean;
  userId: string;
}) => {
  if (isInstructorDashboard) return null;

  return (
    <FollowBtn
      userId={userId}
      sm={small}
      className={cn(
        "shrink-0 shadow-sm",
        small ? "h-9 min-w-24 rounded-lg px-4 text-sm" : "h-11 rounded-xl",
      )}
    />
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-clear-ground px-4 py-3 sm:px-5">
        <Skeleton className="h-10 w-36 rounded-full" />
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground">
        <Skeleton className="h-36 w-full rounded-none sm:h-44" />
        <div className="space-y-3 p-5">
          <Skeleton className="size-20 rounded-2xl" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-20 w-full max-w-lg rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default UserProfileComponent;
