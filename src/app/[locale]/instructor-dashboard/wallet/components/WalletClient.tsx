"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/components/auth-provider";
import TrendBadge from "@/components/TrendBadge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/app/lib/utils";
import { ICourse, ICoursePackage, IPackage } from "@/types";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import UsersList from "./UsersList";

const WalletClient = () => {
  const t = useTranslations("invoicesManagement");
  const locale = useLocale();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [marketLog, setMarketLog] = useState<{
    totalEnrollments: number;
    totalEnrollmentsDiff: number;
    avgRate: number;
    avgRateDiff: number;
    instructorProfits: number;
    instructorProfitsDiff: number;
    withdrawals: number;
  } | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [coursePackages, setCoursePackages] = useState<ICoursePackage[]>([]);
  const [packages, setPackages] = useState<IPackage[]>([]);
  // Fetch active courses, course packages, and packages
  useEffect(() => {
    const fetchAllItems = async () => {
      if (!token || !user?._id) return;
      try {
        setIsLoadingCourses(true);

        // Fetch courses
        const coursesRes = await axiosInstance.get(
          `/courses/getAll?instructor=${user._id}&status=active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(coursesRes.data.data || []);

        // Fetch course packages
        const coursePackagesRes = await axiosInstance.get(
          `/coursePackages/getAll?limit=1000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCoursePackages(coursePackagesRes.data.data || []);

        // Fetch packages (services)
        const packagesRes = await axiosInstance.get(
          `/packages/getAll?limit=1000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPackages(packagesRes.data.data || []);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setIsLoadingCourses(false);
      }
    };
    if (token && user) fetchAllItems();
  }, [token, user]);

  // Fetch analytics data
  useEffect(() => {
    const fetchMarketLog = async () => {
      if (!token || !user?._id) return;
      try {
        setIsLoading(true);

        const res = await axiosInstance.get(
          `/instructorProfits/instructorAnalytics/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMarketLog(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };
    if (token && user) fetchMarketLog();
  }, [token, user]);
  if (isLoading && !marketLog) {
    return <LoadingState />;
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview</h2>
      </div>
      {isLoading ? (
        <LoadingState />
      ) : (
        <StatsCards marketLog={marketLog} locale={locale} t={t} />
      )}
      <UsersList
        token={token}
        user={user}
        courses={courses}
        coursePackages={coursePackages}
        packages={packages}
        isLoadingCourses={isLoadingCourses}
      />
    </div>
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
  marketLog,
  t,
  locale,
}: {
  marketLog: {
    totalEnrollments: number;
    totalEnrollmentsDiff: number;
    avgRate: number;
    avgRateDiff: number;
    instructorProfits: number;
    instructorProfitsDiff: number;
    withdrawals: number;
  } | null;
  t: (key: string) => string;
  locale: string;
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div className="grid gap-4 grid-cols-3 col-span-3">
      <StatCard
        title={t("stats.totalEnrollments")}
        value={marketLog?.totalEnrollments || 0}
        percentage={marketLog?.totalEnrollmentsDiff || 0}
        total={marketLog?.totalEnrollments || 0}
        unit={t("stats.unitStudent")}
        t={t}
      />
      <StatCard
        title={t("stats.averageRate")}
        value={marketLog?.avgRate || 0}
        percentage={marketLog?.avgRateDiff || 0}
        total={marketLog?.avgRate || 0}
        unit={t("stats.unitRating")}
        t={t}
      />
      <StatCard
        title={t("stats.instructorProfits")}
        value={marketLog?.instructorProfits || 0}
        percentage={marketLog?.instructorProfitsDiff || 0}
        total={marketLog?.instructorProfits || 0}
        unit={t("stats.unitCurrency")}
        t={t}
      />
    </div>
    <BalanceCard
      balance={
        (marketLog?.instructorProfits || 0) - (marketLog?.withdrawals || 0)
      }
      t={t}
      locale={locale}
    />
  </div>
);

const StatCard = ({
  title,
  value,
  percentage,
  total,
  unit,
  t,
}: {
  title: string;
  value: number;
  total: number;
  percentage: number;
  unit?: string;
  t: (key: string) => string;
}) => {
  const isPositive = percentage > 0;
  const currencyUnit = t("stats.unitCurrency");
  const ratingUnit = t("stats.unitRating");

  const renderValue = () => {
    if (unit === currencyUnit) {
      return `${currencyUnit}${value?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else if (unit === ratingUnit) {
      return (
        <>
          {value?.toFixed(1)}{" "}
          <span className="text-base text-muted-foreground">{ratingUnit}</span>
        </>
      );
    } else {
      return (
        <>
          {value?.toLocaleString()}{" "}
          {unit && (
            <span className="text-base text-muted-foreground">{unit}</span>
          )}
        </>
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="!text-2xl font-semibold mb-3">{renderValue()}</p>
        </div>
        {percentage !== undefined && percentage !== null && total ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendBadge
                percentage={Math.abs(percentage).toFixed(0)}
                positive={isPositive}
              />
              <Info
                className="w-4 h-4 text-muted-foreground"
                aria-label={t("stats.info")}
              />
            </div>
            <RenderFakeChart positive={isPositive} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

const BalanceCard = ({
  balance,
  t,
  locale,
}: {
  balance: number;
  t: (key: string) => string;
  locale: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();
  const handleWithdraw = async () => {
    if (!amount || isLoading) return;

    setIsLoading(true);
    try {
      await axiosInstance.put(
        `/marketing/withdrawMoney/${user?._id}`,
        {
          amount: Number(amount),
          type: "instructor",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsOpen(false);
      setAmount("");
      toast.success(t("stats.withdrawInvoiceHasSent"));
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col justify-center items-center p-4 h-full">
        <div className="relative">
          <Image
            src={`/images/card_light_${locale === "ar" ? "en" : "ar"}.png`}
            alt="balance card"
            width={500}
            height={500}
            className={cn(
              "hidden w-full rounded-md aspect-[340/176] dark:block"
            )}
          />
          <Image
            src={`/images/card_dark_${locale === "ar" ? "en" : "ar"}.png`}
            alt="balance card"
            width={500}
            height={500}
            className={cn("w-full rounded-md aspect-[340/176] dark:hidden")}
          />
          <div className="flex absolute top-0 right-0 flex-col justify-center items-start px-4 mt-2 w-full h-full">
            <p className="text-sm text-gray-200 dark:text-gray-700">
              {t("stats.currentBalance")}
            </p>
            <h3 className="font-semibold text-white dark:text-black h1-5">
              ${balance.toFixed(2)?.toLocaleString()}
            </h3>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full" variant="outline">
              {t("stats.withdraw")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("stats.withdrawTitle")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t("stats.enterAmount")}
                  min="0"
                  max={balance}
                />
                <Button
                  onClick={handleWithdraw}
                  disabled={!amount}
                  isLoading={isLoading}
                  className="w-full"
                >
                  {t("stats.confirmWithdraw")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const RenderFakeChart = ({ positive }: { positive: boolean }) => (
  <Image
    src={`/images/invoices_${positive ? "up" : "down"}_chart.svg`}
    alt="chart"
    width={500}
    height={500}
    className="w-full aspect-[189/120] mt-4 object-cover"
  />
);

export default WalletClient;
