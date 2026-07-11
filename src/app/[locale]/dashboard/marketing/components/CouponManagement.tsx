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
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import { axiosInstance } from "@/app/lib/utils";
import { ICoupon } from "@/types";
import { toast } from "react-toastify";
import { useFilterCourses } from "@/hooks/useFilterCourses";
import { useFilterPackages } from "@/hooks/useFilterPackages";
import { useFilterCoursePackages } from "@/hooks/useFilterCoursePackages";
import CouponAppliesToSelector from "./CouponAppliesToSelector";
import { marketingTableBorderClassName } from "./filterStyles";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schema
const createCouponSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().optional(),
    percentage: z
      .string()
      .min(1, t("createCoupon.form.validation.percentageRequired"))
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        t("createCoupon.form.validation.percentageInvalid"),
      )
      .refine(
        (val) => Number(val) < 100,
        t("createCoupon.form.validation.percentageMax"),
      ),
    maxUses: z.string().optional(),
    reason: z
      .string()
      .min(1, t("createCoupon.form.validation.reasonRequired"))
      .min(4, t("createCoupon.form.validation.reasonMin")),
  });

type CouponFormValues = z.infer<ReturnType<typeof createCouponSchema>>;

const CouponManagement = () => {
  const t = useTranslations("couponManagement");

  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const { token } = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with validation
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(createCouponSchema(t)),
    defaultValues: {
      name: "",
      percentage: "",
      maxUses: "",
      reason: "",
    },
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsFetching(true);
      try {
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

  // Selection state for courses, packages, and coursePackages
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [selectedCoursePackages, setSelectedCoursePackages] = useState<
    string[]
  >([]);

  // Fetch data from hooks
  const { courses, isLoadingCourses } = useFilterCourses({ enable: true });
  const { packages, isLoadingPackages } = useFilterPackages({
    enable: true,
    onlyActive: false,
  });
  const { coursePackages, isLoadingCoursePackages } = useFilterCoursePackages({
    enable: true,
  });

  const onSubmit = async (data: CouponFormValues) => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.post(
        "/coupons",
        {
          couponName: data.name || "",
          discount: data.percentage,
          maxUsageTimes: data.maxUses || "",
          reason: data.reason,
          courses: selectedCourses,
          packages: selectedPackages,
          coursePackages: selectedCoursePackages,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCoupons([res.data.data, ...coupons]);
      toast.success(t("createCoupon.success"));
      // Reset form and selections
      form.reset();
      setSelectedCourses([]);
      setSelectedPackages([]);
      setSelectedCoursePackages([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
    <section className="space-y-5">
      {/* Create Coupon Form */}
      <Card className={cn("overflow-hidden", marketingTableBorderClassName)}>
        <CardHeader className="border-b border-primary/10 p-4 sm:p-5">
          <CardTitle>{t("createCoupon.title")}</CardTitle>
          <CardDescription>{t("createCoupon.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("createCoupon.form.couponName.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t(
                            "createCoupon.form.couponName.placeholder",
                          )}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("createCoupon.form.discountPercentage.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder={t(
                            "createCoupon.form.discountPercentage.placeholder",
                          )}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("createCoupon.form.maxUses.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder={t(
                            "createCoupon.form.maxUses.placeholder",
                          )}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("createCoupon.form.reason.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t(
                            "createCoupon.form.reason.placeholder",
                          )}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Selection Section */}
              <div className="mt-5 space-y-4 border-t border-primary/10 pt-5">
                <Label className="text-base font-semibold">
                  {t("createCoupon.form.appliesTo.label")}
                </Label>

                {/* Courses Selection */}
                <CouponAppliesToSelector
                  title={t("createCoupon.form.appliesTo.courses")}
                  items={courses}
                  selectedIds={selectedCourses}
                  onSelectionChange={setSelectedCourses}
                  isLoading={isLoadingCourses}
                  emptyMessageKey="createCoupon.form.appliesTo.noCourses"
                  itemIdPrefix="course"
                  disabled={isLoading}
                />

                {/* Services (Packages) Selection */}
                <CouponAppliesToSelector
                  title={t("createCoupon.form.appliesTo.services")}
                  items={packages}
                  selectedIds={selectedPackages}
                  onSelectionChange={setSelectedPackages}
                  isLoading={isLoadingPackages}
                  emptyMessageKey="createCoupon.form.appliesTo.noServices"
                  itemIdPrefix="package"
                  disabled={isLoading}
                />

                {/* Learning Paths (Course Packages) Selection */}
                <CouponAppliesToSelector
                  title={t("createCoupon.form.appliesTo.learningPaths")}
                  items={coursePackages}
                  selectedIds={selectedCoursePackages}
                  onSelectionChange={setSelectedCoursePackages}
                  isLoading={isLoadingCoursePackages}
                  emptyMessageKey="createCoupon.form.appliesTo.noLearningPaths"
                  itemIdPrefix="coursePackage"
                  disabled={isLoading}
                />
              </div>

              <Button
                isLoading={isLoading}
                type="submit"
                className="mt-4 rounded-xl"
              >
                {t("createCoupon.form.submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card className={cn("overflow-hidden", marketingTableBorderClassName)}>
        <CardHeader className="border-b border-primary/10 p-4 sm:p-5">
          <CardTitle>{t("couponsList.title")}</CardTitle>
          <CardDescription>{t("couponsList.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="overflow-x-auto">
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("couponsList.table.headers.couponName")}
                  </TableHead>
                  <TableHead>
                    {t("couponsList.table.headers.discount")}
                  </TableHead>
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
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CouponManagement;
