/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { useFilterCourses } from "@/hooks/useFilterCourses";
import { useFilterPackages } from "@/hooks/useFilterPackages";
import { useFilterCoursePackages } from "@/hooks/useFilterCoursePackages";

import { axiosInstance } from "@/app/lib/utils";
import { RiTeamFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { IUser } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LeaderBoardCard from "@/components/LeaderBoardCard";
import { FaMoneyBill } from "react-icons/fa";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { getDynamicString } from "@/lib/utils";
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

        const res = await axiosInstance.get(
          `/marketingAnalytics/total?locale=en&month=${
            new Date().getFullYear() +
            "-" +
            String(new Date().getMonth() + 1).padStart(2, "0")
          }`,
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
interface StatBlockProps {
  title: string;
  value: number;
  difference: number;
  total: number;
  base?: string;
  mark?: string;
  withDivider?: boolean;
  students: number;
}

const StatBlock: React.FC<StatBlockProps> = ({
  title,
  value,
  difference,
  total,
  mark,
  students,
}) => {
  const locale = useLocale();

  return (
    <div>
      <div>
        <p className="mb-2 font-medium sm:text-lg text-text-3">{title}</p>
        <h3 className="flex gap-1 items-end mt-1 mb-2 font-semibold h1-5">
          {mark}
          {value?.toLocaleString()}
        </h3>
        <p className="mb-2">
          <span className="mb-1 text-sm text-text-3">
            <span className="h1-5 text-text-1">{students}</span>{" "}
            {locale !== "ar" ? "/" : "\\"}{" "}
            {locale === "ar" ? "طالب" : "Student"}
          </span>
        </p>
      </div>
      {difference !== 0 && difference && total && (
        <TrendBadge
          percentage={Math.abs((difference / total) * 100).toFixed(1)}
          positive={difference > 0}
        />
      )}
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
  const { courses } = useFilterCourses({
    enable: true,
  });
  const { coursePackages } = useFilterCoursePackages({
    enable: true,
  });
  const { packages } = useFilterPackages({
    enable: true,
  });

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });
  const [data, setData] = useState<null | {
    givenPeriodResales: number;
    givenPeriodResalesStudents: number;
    givenPeriodSales: number;
    givenPeriodStudents: number;
    oppositePeriodResales: number;
    oppositePeriodResalesStudents: number;
    oppositePeriodSales: number;
    oppositePeriodStudents: number;
    givenPeriodOrders: {
      totalOrderPrice: number;
      createdAt: string;
    }[];
  }>(null);
  const { token } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      if (!date?.from) return;
      try {
        const res = await axiosInstance.get(
          `/marketingAnalytics/item/${item}?startDate=${date.from.toLocaleDateString(
            "en-GB"
          )}&endDate=${(date.to || date.from).toLocaleDateString("en-GB")}`,
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
    if (item && token) fetchData();
  }, [item, token, date]);
  return (
    <Card className="mb-4 border-none cardShadow bg-background">
      <CardHeader className="flex flex-row flex-wrap gap-4 justify-between items-center py-4">
        <CardTitle className="h2">{t("salesAnalytics")}</CardTitle>
        <div className="flex flex-wrap gap-4">
          <Select
            value={item.toString()}
            onValueChange={(value) => setItem(value)}
          >
            <SelectTrigger className="w-auto h-10 md:w-auto lg:h-12 md:h-10 md:text-sm">
              <SelectValue placeholder={t("resaleFilter")} />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course._id} value={`${course._id}`}>
                  {t("nCourse")} - {getDynamicString(course.title)}
                </SelectItem>
              ))}
              {coursePackages.map((coursePackage) => (
                <SelectItem
                  key={coursePackage._id}
                  value={`${coursePackage._id}`}
                >
                  {t("path")} - {getDynamicString(coursePackage.title)}
                </SelectItem>
              ))}
              {packages.map((pack) => (
                <SelectItem key={pack._id} value={`${pack._id}`}>
                  {t("service")} - {getDynamicString(pack.title)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{" "}
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </CardHeader>
      <CardContent>
        {!item ? (
          <p className="py-8 text-center text-muted-foreground">
            {t("selectItemToViewAnalytics")}
          </p>
        ) : (
          <>
            <div className="grid gap-4 mt-6 md:grid-cols-2">
              <StatBlock
                title={t("totalSales")}
                value={data?.givenPeriodSales || 0}
                difference={
                  (data?.givenPeriodSales || 0) -
                  (data?.oppositePeriodSales || 0)
                }
                total={data?.givenPeriodSales || 0}
                students={data?.givenPeriodStudents || 0}
                mark="$"
              />
              <StatBlock
                title={t("totalResales")}
                value={data?.givenPeriodResales || 0}
                difference={
                  (data?.givenPeriodResales || 0) -
                  (data?.oppositePeriodResales || 0)
                }
                total={data?.givenPeriodResales || 0}
                students={data?.givenPeriodResalesStudents || 0}
                mark="$"
              />
            </div>
            <OrdersChart
              givenPeriodOrders={data?.givenPeriodOrders || []}
              startDate={date?.from || new Date()}
              endDate={date?.to || new Date()}
            />
            <div className="overflow-x-auto relative whitespace-nowrap">
              <div className="mt-8">
                <h3 className="mb-4">{t("topCoursesSell")}</h3>
                <div className="overflow-auto max-w-full">
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
          </>
        )}
      </CardContent>
    </Card>
  );
};
const OrdersChart = ({
  givenPeriodOrders,
  startDate,
  endDate,
}: {
  givenPeriodOrders: {
    totalOrderPrice: number;
    createdAt: string;
  }[];
  startDate: Date;
  endDate: Date;
}) => {
  const t = useTranslations("salesManagement");
  const chartData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    //@ts-ignore
    const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const allDates = Array.from({ length: dayDiff + 1 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date.toISOString().split("T")[0];
    });
    //@ts-ignore
    const ordersByDate = givenPeriodOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      //@ts-ignore
      acc[date] = (acc[date] || 0) + order.totalOrderPrice;
      return acc;
    }, {});
    return allDates.map((date, index) => ({
      //@ts-ignore
      name: (index + 1).toString(),
      //@ts-ignore
      amount: ordersByDate[date] || 0,
      date,
    }));
  }, [givenPeriodOrders, startDate, endDate]);

  return (
    <Card className="cardShadow bg-background">
      <CardHeader>
        <CardTitle className="h3">{t("selectedPeriodOrders")}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center">{t("noOrdersFound")}</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <XAxis
                dataKey="name"
                axisLine={true}
                tickLine={false}
                tickMargin={8}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={20}
                padding={{ top: 20 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-2 rounded-lg border shadow-sm bg-background">
                        <div className="flex flex-col gap-2">
                          <span className="text-center text-muted-foreground">
                            {new Date(
                              payload[0].payload.date
                            ).toLocaleDateString()}
                          </span>
                          <span className="font-bold">
                            {t("total")}: $
                            {typeof payload[0]?.value === "number"
                              ? payload[0].value.toFixed(2)
                              : payload[0]?.value}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                type="natural"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                fill="url(#colorAmount)"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
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
            <Skeleton className="mb-2 w-24 h-4" />
            <Skeleton className="w-32 h-8" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardContent className="p-4">
        <Skeleton className="mb-4 w-48 h-8" />
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
        value={Number(
          ((user?.timeSpent.monthlyTimeSpent || 0) / (60 * 60 * 1000)).toFixed(
            2
          )
        )}
        difference={0}
        total={0}
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
    <Card className="cardShadowSecondary bg-background">
      <CardContent className="p-4">
        <div>
          <p className="mb-4 max-sm:text-sm text-muted-foreground">{title}</p>
          <h3 className="flex gap-1 items-end mt-1 mb-2 font-semibold h1-5">
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
  return (
    <Card className="p-4 cardShadow bg-background">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="flex gap-2 items-center h2">
          <RiTeamFill className="text-xl" />
          {text("myTeam")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">{/*   */}</CardContent>
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
        console.log("");

        const res = await axiosInstance.get("/leaderboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const leaderBoard = res.data.leaderBoard;
        const users = [];
        if (leaderBoard.firstRank?.marketer)
          users.push(leaderBoard.firstRank.marketer);
        if (leaderBoard.secondRank?.marketer)
          users.push(leaderBoard.secondRank.marketer);
        if (leaderBoard.thirdRank?.marketer)
          users.push(leaderBoard.thirdRank.marketer);
        setData(users);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };
    if (token) {
      getLeaderBoard();
    }
  }, [token]);
  if (!user) return null;
  return (
    <LeaderBoardCard
      users={data}
      isLoading={isLoading}
      title={text("ourTopInstructors")}
    />
  );
};

const AffiliateMarketing = () => {
  const text = useTranslations("salesManagement");
  return (
    <Card className="p-4 cardShadow bg-background">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="flex gap-2 items-center h2">
          <FaMoneyBill className="text-xl" />
          {text("affiliateMarketing")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Button className="mb-2 w-full" variant={"outline"} asChild>
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
