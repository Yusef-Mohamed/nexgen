"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrendBadge from "@/components/TrendBadge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { IMarketLog } from "@/types";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const InvoicesManagement = () => {
  const t = useTranslations("invoicesManagement");
  const locale = useLocale();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [marketLog, setMarketLog] = useState<IMarketLog | null>(null);
  useEffect(() => {
    const fetchMarketLog = async () => {
      try {
        setIsLoading(true);
        const axiosInstance = await createClientAxiosInstance();
        const res = await axiosInstance.get("/marketing/getMyMarketLog", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMarketLog(res.data.marketLog);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchMarketLog();
  }, [token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-primary";
      case "rejected":
        return "bg-destructive";
      default:
        return "bg-yellow-500 dark:bg-yellow-600";
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }
  return (
    <div className="space-y-8">
      <StatsCards marketLog={marketLog} locale={locale} t={t} />
      <MarketingTabs
        marketLog={marketLog}
        t={t}
        locale={locale}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
      />
      <InvoicesTabs
        marketLog={marketLog}
        t={t}
        locale={locale}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
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
      const axiosInstance = await createClientAxiosInstance();
      await axiosInstance.put(
        `/marketing/withdrawMoney/${user?._id}`,
        {
          amount: Number(amount),
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

const MarketingTabs = ({
  marketLog,
  t,
  locale,
  formatDate,
  getStatusColor,
}: {
  marketLog: IMarketLog | null;
  t: (key: string) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  locale: string;
}) => (
  <Card>
    <Tabs
      defaultValue="commission"
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="w-full"
    >
      <TableWithModal
        header={
          <TabsList>
            <TabsTrigger value="sales">{t("tabs.sales")}</TabsTrigger>
            <TabsTrigger value="commission">{t("tabs.commission")}</TabsTrigger>
          </TabsList>
        }
        modalContent={
          <>
            <CommissionTab
              marketLog={marketLog}
              t={t}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              all
            />
            <SalesTab
              getStatusColor={getStatusColor}
              marketLog={marketLog}
              t={t}
              formatDate={formatDate}
              all
            />
          </>
        }
        t={t}
        locale={locale}
      >
        <CommissionTab
          marketLog={marketLog}
          t={t}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
        <SalesTab
          marketLog={marketLog}
          t={t}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
      </TableWithModal>
    </Tabs>
  </Card>
);

const InvoicesTabs = ({
  marketLog,
  t,
  locale,
  formatDate,
  getStatusColor,
}: {
  marketLog: IMarketLog | null;
  t: (key: string) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  all?: boolean;
  locale: string;
}) => (
  <Card>
    <Tabs
      defaultValue="regular"
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="w-full"
    >
      <TableWithModal
        header={
          <TabsList>
            <TabsTrigger value="regular">
              {t("invoices.tabs.regular")}
            </TabsTrigger>
            <TabsTrigger value="commission">
              {t("invoices.tabs.commission")}
            </TabsTrigger>
          </TabsList>
        }
        modalContent={
          <>
            <RegularInvoicesTab
              marketLog={marketLog}
              t={t}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              all
            />

            <CommissionInvoicesTab
              marketLog={marketLog}
              t={t}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              all
            />
          </>
        }
        t={t}
        locale={locale}
      >
        <RegularInvoicesTab
          marketLog={marketLog}
          t={t}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
        />

        <CommissionInvoicesTab
          marketLog={marketLog}
          t={t}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
      </TableWithModal>
    </Tabs>
  </Card>
);

const CommissionTab = ({
  marketLog,
  t,
  formatDate,
  all,
}: {
  marketLog: IMarketLog | null;
  t: (key: string) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  all?: boolean;
}) => (
  <TabsContent value="commission">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("commission.member")}</TableHead>
          <TableHead>{t("commission.profit")}</TableHead>
          <TableHead>{t("commission.lastUpdate")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {marketLog?.commissions
          ?.slice(0, all ? marketLog.commissions.length : 5)
          .map((commission) => (
            <TableRow key={commission._id}>
              <TableCell>{commission.member.name}</TableCell>
              <TableCell>${commission.profit.toLocaleString()}</TableCell>
              <TableCell>{formatDate(commission.lastUpdate)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TabsContent>
);

const SalesTab = ({
  marketLog,
  t,
  formatDate,
  all,
}: {
  marketLog: IMarketLog | null;
  t: (key: string) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  all?: boolean;
}) => (
  <TabsContent value="sales">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("sales.purchaser")}</TableHead>
          <TableHead>{t("sales.item")}</TableHead>
          <TableHead>{t("sales.amount")}</TableHead>
          <TableHead>{t("sales.type")}</TableHead>
          <TableHead>{t("sales.date")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {marketLog?.sales
          ?.slice(0, all ? marketLog.sales.length : 5)
          .map((sale) => (
            <TableRow key={sale._id}>
              <TableCell>{sale.purchaser?.name}</TableCell>
              <TableCell>{sale.item}</TableCell>
              <TableCell>${sale.amount.toLocaleString()}</TableCell>
              <TableCell>{sale.type || "-"}</TableCell>
              <TableCell>{formatDate(sale.Date)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TabsContent>
);

const RegularInvoicesTab = ({
  marketLog,
  t,
  getStatusColor,
  all,
}: {
  marketLog: IMarketLog | null;
  t: (key: string) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  all?: boolean;
}) => (
  <TabsContent value="regular">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("invoices.period")}</TableHead>
          <TableHead>{t("invoices.mySales")}</TableHead>
          <TableHead>{t("invoices.totalSales")}</TableHead>
          <TableHead>{t("invoices.profit")}</TableHead>
          <TableHead>{t("invoices.status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {marketLog?.invoices
          ?.slice(0, all ? marketLog.invoices.length : 5)
          .map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell>{invoice.desc}</TableCell>
              <TableCell>{invoice.mySales}</TableCell>
              <TableCell>${invoice.totalSalesMoney.toLocaleString()}</TableCell>
              <TableCell>${invoice.profits.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(invoice.status)}>
                  {t(invoice.status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TabsContent>
);

const CommissionInvoicesTab = ({
  marketLog,
  t,
  formatDate,
  getStatusColor,
  all,
}: {
  marketLog: IMarketLog | null;
  t: (key: string) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  all?: boolean;
}) => (
  <TabsContent value="commission">
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
        {marketLog?.commissionsInvoices
          ?.slice(0, all ? marketLog.commissionsInvoices.length : 5)
          .map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell>{invoice.desc}</TableCell>
              <TableCell>${invoice.profits.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(invoice.status)}>
                  {t(invoice.status)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(invoice.createdAt)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TabsContent>
);

const TableWithModal = ({
  header,
  hideModal = false,
  children,
  modalContent,
  t,
  locale,
}: {
  header: React.ReactNode;
  hideModal?: boolean;
  children: React.ReactNode;
  modalContent: React.ReactNode;
  t: (key: string) => string;
  locale: string;
}) => {
  return (
    <>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex-1">{header}</div>
        {!hideModal && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="gap-2 text-text-3">
                {t("common.showAll")}
                <ArrowRight
                  className={cn("w-4 h-4", {
                    "rotate-180": locale === "ar",
                  })}
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-[95vw] sm:max-w-[95vw] md:max-w-[95vw] lg:max-w-[95vw] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{header}</DialogTitle>
              </DialogHeader>
              {modalContent}
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </>
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

export default InvoicesManagement;
