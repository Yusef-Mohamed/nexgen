"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/components/auth-provider";
import TrendBadge from "@/components/TrendBadge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, getDynamicString } from "@/lib/utils";
import { axiosInstance } from "@/app/lib/utils";
import { IMarketLog, ICourse } from "@/types";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WalletClient = () => {
  const t = useTranslations("invoicesManagement");
  const locale = useLocale();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [marketLog, setMarketLog] = useState<IMarketLog | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [courses, setCourses] = useState<ICourse[]>([]);

  // Format date to DD/MM/YYYY
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch active courses
  useEffect(() => {
    const fetchActiveCourses = async () => {
      if (!token || !user?._id) return;
      try {
        setIsLoadingCourses(true);
        const res = await axiosInstance.get(
          `/courses/getAll?instructor=${user._id}&status=active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(res.data.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoadingCourses(false);
      }
    };
    if (token && user) fetchActiveCourses();
  }, [token, user]);

  // Fetch analytics data
  useEffect(() => {
    const fetchMarketLog = async () => {
      if (!token || !user?._id) return;
      try {
        setIsLoading(true);
        let res;

        if (selectedCourseId === "all") {
          // Fetch instructor analytics (all courses)
          res = await axiosInstance.get(
            `/instructorProfits/instructorAnalytics/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMarketLog(res.data.instructorProfits);
        } else {
          // Fetch course-specific analytics
          const startDate = user.createdAt
            ? formatDate(new Date(user.createdAt))
            : formatDate(new Date());
          const endDate = formatDate(new Date());
          const url = `/instructorProfits/courseAnalytics/${selectedCourseId}?startDate=${startDate}&endDate=${endDate}&type=course`;

          res = await axiosInstance.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMarketLog(res.data.data || res.data);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };
    if (token && user) fetchMarketLog();
  }, [token, user, selectedCourseId]);

  if (isLoading && !marketLog) {
    return <LoadingState />;
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview</h2>
        <Select
          value={selectedCourseId}
          onValueChange={setSelectedCourseId}
          disabled={isLoadingCourses}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {getDynamicString(course.title)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <LoadingState />
      ) : (
        <StatsCards marketLog={marketLog} locale={locale} t={t} />
      )}
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
  marketLog: IMarketLog | null;
  t: (key: string) => string;
  locale: string;
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div className="grid gap-4 grid-cols-3 col-span-3">
      <StatCard
        title={t("stats.totalSales")}
        value={marketLog?.totalSalesMoney || 0}
        difference={marketLog?.salesMoneyDifference || 0}
        total={marketLog?.totalSalesMoney || 0}
      />
      <StatCard
        title={t("stats.profit")}
        value={marketLog?.profits || 0}
        difference={marketLog?.profitsDifference || 0}
        total={marketLog?.profits || 0}
      />
      <StatCard
        title={t("stats.withdrawals")}
        value={marketLog?.withdrawals || 0}
        difference={0}
        total={marketLog?.withdrawals || 0}
      />
    </div>
    <BalanceCard
      balance={marketLog?.availableToWithdraw || 0}
      t={t}
      locale={locale}
    />
  </div>
);

const StatCard = ({
  title,
  value,
  difference,
  total,
}: {
  title: string;
  value: number;
  difference: number;
  total: number;
}) => (
  <Card>
    <CardContent className="p-4">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="mt-1 mb-2 font-semibold h1-5">
          ${value?.toLocaleString()}
        </h3>
      </div>
      {difference && total ? (
        <>
          <TrendBadge
            percentage={Math.abs((difference / total) * 100).toFixed(1)}
            positive={difference > 0}
          />
          <RenderFakeChart positive={difference > 0} />
        </>
      ) : null}
    </CardContent>
  </Card>
);

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
              ${balance?.toLocaleString()}
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
