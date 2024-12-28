"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { createClientAxiosInstance } from "@/app/lib/utils";
import { ICoupon } from "@/types";
import { toast } from "react-toastify";

const CouponManagement = () => {
  const t = useTranslations("couponManagement");

  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const { token } = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsFetching(true);
      try {
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance.get("/coupons", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCoupons(res.data.data);
      } catch (error) {
        console.error(error);
      }
      setIsFetching(false);
    };
    if (token) fetchCoupons();
  }, [token]);

  const [formData, setFormData] = useState({
    name: "",
    percentage: "",
    maxUses: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const axiosInstance = createClientAxiosInstance();
      const res = await axiosInstance.post(
        "/coupons",
        {
          couponName: formData.name,
          discount: formData.percentage,
          maxUsageTimes: formData.maxUses,
          reason: formData.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCoupons([res.data.data, ...coupons]);
      toast.success(t("createCoupon.success"));
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    setFormData({ name: "", percentage: "", maxUses: "", reason: "" });
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary";
      case "rejected":
        return "bg-destructive";
      default:
        return "bg-yellow-500 dark:bg-yellow-600";
    }
  };

  // Loading skeleton component for table rows
  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="w-24 h-4 mx-auto bg-muted animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="w-12 h-4 mx-auto bg-muted animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="w-20 h-4 mx-auto bg-muted animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="w-32 h-4 mx-auto bg-muted animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="w-16 h-6 mx-auto rounded-full bg-muted animate-pulse" />
      </TableCell>
    </TableRow>
  );

  // Empty state component
  const EmptyState = () => (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("couponsList.table.empty")}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <section>
      {/* Create Coupon Form */}
      <Card className="mb-4 border-none">
        <CardHeader>
          <CardTitle>{t("createCoupon.title")}</CardTitle>
          <CardDescription>{t("createCoupon.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("createCoupon.form.couponName.label")}
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("createCoupon.form.couponName.placeholder")}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("createCoupon.form.discountPercentage.label")}
                </label>
                <Input
                  name="percentage"
                  type="number"
                  value={formData.percentage}
                  onChange={handleInputChange}
                  placeholder={t(
                    "createCoupon.form.discountPercentage.placeholder"
                  )}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("createCoupon.form.maxUses.label")}
                </label>
                <Input
                  name="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={handleInputChange}
                  placeholder={t("createCoupon.form.maxUses.placeholder")}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("createCoupon.form.reason.label")}
                </label>
                <Input
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder={t("createCoupon.form.reason.placeholder")}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button isLoading={isLoading} type="submit" className="mt-4">
              {t("createCoupon.form.submitButton")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card className="border-none">
        <CardHeader>
          <CardTitle>{t("couponsList.title")}</CardTitle>
          <CardDescription>{t("couponsList.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="whitespace-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("couponsList.table.headers.couponName")}
                </TableHead>
                <TableHead>{t("couponsList.table.headers.discount")}</TableHead>
                <TableHead>{t("couponsList.table.headers.usage")}</TableHead>
                <TableHead>{t("couponsList.table.headers.reason")}</TableHead>
                <TableHead>{t("couponsList.table.headers.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                // Show skeleton loading rows
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : coupons.length === 0 ? (
                // Show empty state
                <EmptyState />
              ) : (
                // Show actual data
                coupons.map((coupon) => (
                  <TableRow className="text-center" key={coupon._id}>
                    <TableCell className="font-medium">
                      {coupon.couponName}
                    </TableCell>
                    <TableCell>{coupon.discount}%</TableCell>
                    <TableCell>
                      {coupon.usedTimes} / {coupon.maxUsageTimes}
                    </TableCell>
                    <TableCell>{coupon.reason}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(coupon.status)}`}>
                        {t(`couponsList.table.status.${coupon.status}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default CouponManagement;
