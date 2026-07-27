"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DataTable,
  DataTableContent,
  DataTableDescription,
  DataTableHeader,
  DataTableHeading,
  DataTableIcon,
  DataTableTitle,
} from "@/components/ui/data-table";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import TrendBadge from "@/components/TrendBadge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeDollarSign, Info, ReceiptText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/app/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import UserAvatar from "@/components/UserAvatar";
import { AxiosError } from "axios";

const WalletClient = () => {
  const t = useTranslations("invoicesManagement");
  const locale = useLocale();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [marketLog, setMarketLog] = useState<{
    totalEnrollments: number;
    totalEnrollmentsDiff: number;
    avgRate: number;
    avgRateDiff: number;
    instructorProfits: number;
    instructorProfitsDiff: number;
    withdrawals: number;
    commissions?: Array<{
      order: string;
      type: string;
      amount: number;
      percentage: number;
      profit: number;
      marketerPercentage?: number;
      marketerProfits?: number;
      marketer?: string;
      totalProfits?: number;
      createdAt: string;
      user?: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profileImg?: string;
      };
    }>;
    invoices?: Array<{
      _id: string;
      profits: number;
      desc: string;
      status: string;
      createdAt: string;
    }>;
  } | null>(null);

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
          },
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
  console.log(marketLog);
  return (
    <div className="space-y-8">
      {isLoading ? (
        <LoadingState />
      ) : (
        <StatsCards marketLog={marketLog} locale={locale} t={t} />
      )}
      {!isLoading && marketLog && (
        <>
          <CommissionsTable marketLog={marketLog} locale={locale} t={t} />
          <InvoicesTable marketLog={marketLog} locale={locale} t={t} />
        </>
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
  marketLog: {
    totalEnrollments: number;
    totalEnrollmentsDiff: number;
    avgRate: number;
    avgRateDiff: number;
    instructorProfits: number;
    instructorProfitsDiff: number;
    withdrawals: number;
    commissions?: Array<{
      order: string;
      type: string;
      amount: number;
      percentage: number;
      profit: number;
      marketerPercentage?: number;
      marketerProfits?: number;
      marketer?: string;
      totalProfits?: number;
      createdAt: string;
      user?: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profileImg?: string;
      };
    }>;
    invoices?: Array<{
      _id: string;
      profits: number;
      desc: string;
      status: string;
      createdAt: string;
    }>;
  } | null;
  t: (key: string) => string;
  locale: string;
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        `/marketing/withdrawMoney/${user?._id}?type=instructor`,
        {
          amount: Number(amount),
          type: "instructor",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setIsOpen(false);
      setAmount("");
      toast.success(t("stats.withdrawInvoiceHasSent"));
    } catch (error) {
      console.error("Withdrawal failed:", error);
      const typedError = error as AxiosError<{ message?: string }>;
      if (typedError.response?.data?.message) {
        toast.error(typedError.response.data.message);
      }
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
              "hidden w-full rounded-md aspect-[340/176] dark:block",
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
            <h3 className="font-semibold text-white dark:text-foreground h1-5">
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

const CommissionsTable = ({
  marketLog,
  locale,
  t,
}: {
  marketLog: {
    commissions?: Array<{
      order: string;
      type: string;
      amount: number;
      percentage: number;
      profit: number;
      marketerPercentage?: number;
      marketerProfits?: number;
      marketer?: string;
      totalProfits?: number;
      createdAt: string;
      user?: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profileImg?: string;
      };
    }>;
  };
  locale: string;
  t: (key: string) => string;
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "-";
    }
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const getTranslatedType = (type: string | undefined) => {
    if (!type) {
      return t("commission.types.unknown") || "Unknown";
    }
    const typeKey = type?.toLowerCase();
    switch (typeKey) {
      case "course":
        return t("commission.types.course");
      case "coursepackage":
        return t("commission.types.coursePackage");
      case "package":
        return t("commission.types.package");
      default:
        return type;
    }
  };

  const commissions = marketLog.commissions || [];

  return (
    <DataTable variant="striped">
      <DataTableHeader>
        <DataTableHeading>
          <DataTableIcon>
            <BadgeDollarSign aria-hidden className="size-5" />
          </DataTableIcon>
          <div className="min-w-0">
            <DataTableTitle>{t("tabs.commission")}</DataTableTitle>
            <DataTableDescription>
              {commissions.length.toLocaleString()} {t("tabs.commission")}
            </DataTableDescription>
          </div>
        </DataTableHeading>
      </DataTableHeader>
      <DataTableContent>
        {commissions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {t("common.noData") || "No commissions found"}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("commission.user") || "User"}</TableHead>
                <TableHead>{t("commission.order") || "Order"}</TableHead>
                <TableHead>{t("commission.type") || "Type"}</TableHead>
                <TableHead>{t("commission.amount") || "Amount"}</TableHead>
                <TableHead>
                  {t("commission.percentage") || "Percentage"}
                </TableHead>
                <TableHead>{t("commission.profit")}</TableHead>
                <TableHead>{t("commission.date") || "Date"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.map((commission, index) => (
                <TableRow key={`${commission.order}-${index}`}>
                  <TableCell>
                    {commission.user ? (
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          user={{
                            name: commission.user.name,
                            profileImg: commission.user.profileImg,
                          }}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {commission.user.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {commission.user.email}
                          </span>
                          {commission.user.phone && (
                            <span
                              className="text-xs text-muted-foreground w-fit"
                              dir="ltr"
                            >
                              {commission.user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono">
                      {commission.order ? commission.order.slice(-8) : "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTranslatedType(commission.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${(commission.amount ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {commission.percentage != null
                      ? `${commission.percentage}%`
                      : "-"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${(commission.profit ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{formatDate(commission.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTableContent>
    </DataTable>
  );
};

const InvoicesTable = ({
  marketLog,
  locale,
  t,
}: {
  marketLog: {
    invoices?: Array<{
      _id: string;
      profits: number;
      desc: string;
      status: string;
      createdAt: string;
    }>;
  };
  locale: string;
  t: (key: string) => string;
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "-";
    }
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) {
      return "bg-yellow-500 dark:bg-yellow-600";
    }
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-primary";
      case "rejected":
        return "bg-destructive";
      default:
        return "bg-yellow-500 dark:bg-yellow-600";
    }
  };

  const invoices = marketLog.invoices || [];

  return (
    <DataTable variant="striped">
      <DataTableHeader>
        <DataTableHeading>
          <DataTableIcon>
            <ReceiptText aria-hidden className="size-5" />
          </DataTableIcon>
          <div className="min-w-0">
            <DataTableTitle>{t("invoices.title") || "Invoices"}</DataTableTitle>
            <DataTableDescription>
              {invoices.length.toLocaleString()} {t("invoices.title")}
            </DataTableDescription>
          </div>
        </DataTableHeading>
      </DataTableHeader>
      <DataTableContent>
        {invoices.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {t("common.noData") || "No invoices found"}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("invoices.period")}</TableHead>
                <TableHead>{t("invoices.profit")}</TableHead>
                <TableHead>{t("invoices.status")}</TableHead>
                <TableHead>{t("invoices.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="max-w-md">
                    <div className="truncate">{invoice.desc || "-"}</div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${(invoice.profits ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status ? t(invoice.status) : "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTableContent>
    </DataTable>
  );
};

export default WalletClient;
