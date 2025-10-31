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
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/app/lib/utils";
import { IMarketLog } from "@/types";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const WalletClient = () => {
  const t = useTranslations("invoicesManagement");
  const locale = useLocale();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [marketLog, setMarketLog] = useState<IMarketLog | null>(null);
  useEffect(() => {
    const fetchMarketLog = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(
          `/instructorProfits/instructorAnalytics/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMarketLog(res.data.instructorProfits);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token && user) fetchMarketLog();
  }, [token, user]);

  if (isLoading) {
    return <LoadingState />;
  }
  throw new Error("Testing the error boundary");
  return (
    <div className="space-y-8">
      <StatsCards marketLog={marketLog} locale={locale} t={t} />
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
