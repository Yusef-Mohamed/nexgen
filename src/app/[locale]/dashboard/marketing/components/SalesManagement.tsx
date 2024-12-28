"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/components/auth-provider";
import TrendBadge from "@/components/TrendBadge";
import { Skeleton } from "@/components/ui/skeleton";

import { createClientAxiosInstance } from "@/app/lib/utils";
import { RiTeamFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import UserAvatar from "@/components/UserAvatar";
import { FaMedal, FaMoneyBill } from "react-icons/fa";
import { ICourse, IUser } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SalesManagement = () => {
  const t = useTranslations("salesManagement");
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [marketLog, setMarketLog] = useState<{
    currentMonthRegistrations: number;
    team: number;
    totalSales: number;
    analytics: {
      item: number;
      sales: number;
      percentage: string;
      type: string;
    }[];
  } | null>(null);
  useEffect(() => {
    const fetchMarketLog = async () => {
      try {
        setIsLoading(true);
        const axiosInstance = await createClientAxiosInstance();
        const res = await axiosInstance.get(
          "/marketingAnalytics/total?locale=en",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMarketLog(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchMarketLog();
  }, [token]);
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="space-y-6 basis-[60%]">
        <StatsCards
          totalSales={marketLog?.totalSales || 0}
          myTeam={marketLog?.team || 0}
          currentMonthRegistrations={marketLog?.currentMonthRegistrations || 0}
          t={t}
        />
        <MainComponent analytics={marketLog?.analytics || []} />
      </div>
      <div className="space-y-6 basis-[40%]">
        <AffiliateMarketing />
        <MyTeam />
        <TopInstructors />
      </div>
    </div>
  );
};
const MainComponent = ({
  analytics,
}: {
  analytics: {
    item: number;
    sales: number;
    percentage: string;
    type: string;
  }[];
}) => {
  const t = useTranslations("salesManagement");
  const [item, setItem] = useState("");
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [data, setData] = useState();
  const { token } = useAuth();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const axiosInstance = await createClientAxiosInstance();
        const res = await axiosInstance.get("/courses");
        setCourses(res.data.data);
        setItem(res.data.data[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const axiosInstance = await createClientAxiosInstance();
        const res = await axiosInstance.get(
          `/marketingAnalytics/item/${item}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (item && token) fetchAnalytics();
  }, [item, token]);
  console.log(data);
  return (
    <Card className="mb-4 border-none">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 py-1">
        <CardTitle className="h2">{t("salesAnalytics")}</CardTitle>
        <div className="flex flex-wrap gap-4">
          <Select
            value={item.toString()}
            onValueChange={(value) => setItem(value)}
          >
            <SelectTrigger className="w-40 h-10 md:w-48 lg:h-12 md:h-10 md:text-sm">
              <SelectValue placeholder={t("resaleFilter")} />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto whitespace-nowrap">
          <div className="mt-8">
            <h3 className="mb-4">{t("topCoursesSell")}</h3>
            <div className="max-w-full overflow-auto">
              <table className="w-full whitespace-nowrap text-text-2">
                <thead>
                  <tr>
                    <th className="py-2 font-normal text-start">#</th>
                    <th className="py-2 font-normal text-start">
                      {t("course")}
                    </th>
                    <th className="py-2 font-normal text-start">
                      {t("sales")}
                    </th>
                    <th className="py-2 font-normal text-start">
                      {t("percentage")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2">{i + 1}</td>
                      <td className="py-2">{item.item}</td>
                      <td className="py-2">{item.sales}</td>
                      <td className="py-2">
                        <span className="px-2 py-1 font-semibold rounded bg-primary/10 text-primary">
                          %{item.percentage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const LoadingState = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="w-24 h-4 mb-2" />
            <Skeleton className="w-32 h-8" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardContent className="p-4">
        <Skeleton className="w-48 h-8 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-12" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const StatsCards = ({
  totalSales,
  myTeam,
  currentMonthRegistrations,
  t,
}: {
  t: (key: string) => string;
  totalSales: number;
  myTeam: number;
  currentMonthRegistrations: number;
}) => {
  const { user } = useAuth();
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <StatCard
        title={t("totalSales")}
        value={totalSales}
        difference={0}
        total={0}
        mark="$"
      />
      <StatCard
        title={t("hoursSpent")}
        value={user?.timeSpent.totalTimeSpent || 0}
        difference={user?.timeSpent.monthlyTimeSpent || 0}
        total={user?.timeSpent.totalTimeSpent || 0}
        base={t("hour")}
      />
      <StatCard
        title={t("myTeam")}
        base={t("student")}
        value={myTeam}
        difference={currentMonthRegistrations}
        total={myTeam}
      />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  difference,
  total,
  base,
  mark,
}: {
  title: string;
  value: number;
  difference: number;
  total: number;
  base?: string;
  mark?: string;
}) => {
  const locale = useLocale();
  return (
    <Card>
      <CardContent className="p-4">
        <div>
          <p className="mb-4 max-sm:text-sm text-muted-foreground">{title}</p>
          <h3 className="flex items-end gap-1 mt-1 mb-2 font-semibold h1-5">
            {mark}
            {value?.toLocaleString()}
            {base && (
              <span className="mb-1 text-sm text-text-3">
                {locale !== "ar" ? "/" : "\\"} {base}
              </span>
            )}
          </h3>
        </div>
        {difference !== 0 && difference && total && (
          <>
            <TrendBadge
              percentage={Math.abs((difference / total) * 100).toFixed(1)}
              positive={difference > 0}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
const MyTeam = () => {
  const text = useTranslations("salesManagement");
  const locale = useLocale();
  return (
    <Card className="p-4">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="flex items-center gap-2 h2">
          <RiTeamFill className="text-xl" />
          {text("myTeam")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 border-2 rounded-full bg-input border-clear-ground"
              style={{
                transform: `${locale === "ar" ? "" : "-"}translateX(${
                  i * 20
                }px)`,
              }}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-0 mt-6">
        <Button className="w-full" asChild>
          <Link href="/dashboard/marketing/my-team">{text("seeAllTeam")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
const TopInstructors = () => {
  const text = useTranslations("salesManagement");
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IUser[]>([]);
  useEffect(() => {
    const getLeaderBoard = async () => {
      try {
        setIsLoading(true);
        const axiosInstance = await createClientAxiosInstance();
        const res = await axiosInstance.get("/leaderboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };
    if (token) {
      getLeaderBoard();
    }
  }, [token]);
  console.log(data);
  if (!user) return null;
  return (
    <LeaderBoard
      users={[user, user, user]}
      isLoading={isLoading}
      title={text("ourTopInstructors")}
    />
  );
};
const LeaderBoard = ({
  users,
  title,
  isLoading,
}: {
  users: IUser[];
  title: string;
  isLoading: boolean;
}) => {
  return (
    <Card className="p-4">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="flex items-center gap-2 h2">
          <FaMedal className="text-xl" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <ul className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => {
              if (i > 2) return null;
              return (
                <li
                  key={i}
                  className={`flex items-center justify-between px-6 py-2 border-2 border-transparent rounded-sm border-s-[${
                    i === 0 ? "#FFED78" : i === 1 ? "#DCDFE5" : "#F0C093"
                  }]`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-input animate-pulse"></div>
                    <div className="w-32 h-4 rounded-full bg-input animate-pulse"></div>
                  </div>
                  <Image
                    src={`/images/medals/${
                      i === 0 ? "gold" : i === 1 ? "silver" : "bronze"
                    }.svg`}
                    alt="avatar"
                    width={32}
                    height={32}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="space-y-2">
            {users.map((user, i) => {
              if (i > 2) return null;
              return (
                <li
                  key={user._id}
                  className={`flex items-center justify-between px-6 py-2 border-2 border-transparent rounded-sm border-s-[${
                    i === 0 ? "#FFED78" : i === 1 ? "#DCDFE5" : "#F0C093"
                  }]`}
                >
                  <div className="flex items-center gap-4">
                    <UserAvatar user={user} />
                    <span>{user.name}</span>
                  </div>
                  <Image
                    src={`/images/medals/${
                      i === 0 ? "gold" : i === 1 ? "silver" : "bronze"
                    }.svg`}
                    alt="avatar"
                    width={32}
                    height={32}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
const AffiliateMarketing = () => {
  const text = useTranslations("salesManagement");
  return (
    <Card className="p-4">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="flex items-center gap-2 h2">
          <FaMoneyBill className="text-xl" />
          {text("affiliateMarketing")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Button className="w-full mb-2" variant={"outline"} asChild>
          <Link href="/dashboard/marketing/coupons">{text("coupons")}</Link>
        </Button>
        <Button className="w-full" asChild>
          <Link href="/dashboard/marketing/my-team#invites">
            {text("invitations")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SalesManagement;
