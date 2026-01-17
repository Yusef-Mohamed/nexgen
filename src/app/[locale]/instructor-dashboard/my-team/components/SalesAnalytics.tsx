"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { axiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { getDynamicString } from "@/lib/utils";
import { DynamicString } from "@/types";

interface SalesItem {
  itemId: string;
  itemType: string;
  itemTitle: DynamicString;
  totalSalesMoney: number;
  ordersCount: number;
  percentageOfTotalSales: number;
}

interface SalesAnalyticsData {
  status: string;
  sales: SalesItem[];
  totalSalesMoney: number;
  totalOrders: number;
}

const SalesAnalytics: React.FC = () => {
  const { token, user } = useAuth();
  const t = useTranslations("salesManagement");
  const tInvoices = useTranslations("invoicesManagement");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<SalesAnalyticsData | null>(null);

  useEffect(() => {
    const fetchSalesAnalytics = async () => {
      if (!token || !user?._id) return;

      try {
        setIsLoading(true);
        const res = await axiosInstance.get<SalesAnalyticsData>(
          `/instructorProfits/salesAnalytics/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);
        console.log("Sales Analytics Data:", res.data);
      } catch (err) {
        console.error("Error fetching sales analytics:", err);
        toast.error(t("failedToLoadSalesAnalytics"));
      } finally {
        setIsLoading(false);
      }
    };

    if (token && user) {
      fetchSalesAnalytics();
    }
  }, [token, user, t]);

  const getTranslatedType = (type: string) => {
    const typeKey = type?.toLowerCase();
    switch (typeKey) {
      case "course":
        return tInvoices("commission.types.course");
      case "coursepackage":
        return tInvoices("commission.types.coursePackage");
      case "package":
        return tInvoices("commission.types.package");
      default:
        return type;
    }
  };

  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
    </TableRow>
  );

  if (isLoading) {
    return (
      <Card className="bg-background cardShadow">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("itemName")}</TableHead>
                  <TableHead>{t("sales")}</TableHead>
                  <TableHead>{t("ordersCount")}</TableHead>
                  <TableHead>{t("percentage")}</TableHead>
                  <TableHead>{tInvoices("commission.type")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.sales || data.sales.length === 0) {
    return (
      <Card className="bg-background cardShadow">
        <CardHeader>
          <CardTitle>{t("topCoursesSell")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            {tInvoices("common.noData")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background cardShadow">
      <CardHeader>
        <CardTitle>{t("topCoursesSell")}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              {t("totalSales")}
            </p>
            <p className="text-2xl font-semibold">
              ${data.totalSalesMoney.toLocaleString()}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              {t("ordersCount")}
            </p>
            <p className="text-2xl font-semibold">{data.totalOrders}</p>
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("itemName")}</TableHead>
                <TableHead>{t("sales")}</TableHead>
                <TableHead>{t("ordersCount")}</TableHead>
                <TableHead>{t("percentage")}</TableHead>
                <TableHead>{tInvoices("commission.type")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.sales.map((item, index) => (
                <TableRow key={item.itemId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {getDynamicString(item.itemTitle)}
                  </TableCell>
                  <TableCell>
                    ${item.totalSalesMoney.toLocaleString()}
                  </TableCell>
                  <TableCell>{item.ordersCount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold">
                      {item.percentageOfTotalSales.toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTranslatedType(item.itemType)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesAnalytics;
