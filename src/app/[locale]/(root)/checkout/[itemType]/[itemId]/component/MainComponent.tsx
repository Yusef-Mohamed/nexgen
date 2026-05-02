/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { Button } from "@/components/ui/button";
import { cn, getDynamicString } from "@/lib/utils";
import { ICourse, ICoursePackage, IPackage } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ItemType } from "../page";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/auth-provider";
import { useMyCoursesStore } from "@/stores/MyCoursesStore";
import { axiosInstance } from "@/app/lib/utils";
import {
  calculateCouponPrice,
  canCouponApplyToItem,
  CouponDetails,
  getCouponCodeFromSearchParams,
  getItemBasePrice,
} from "@/lib/coupons";
import { useSearchParams } from "next/navigation";
const methods = [
  {
    label: "stripe",
    logos: ["visa.png", "master-card.svg"],
    value: "stripe",
  },
  {
    label: "lahza",
    logos: ["visa.png", "master-card.svg"],
    value: "lahza",
  },
  {
    label: "crypto",
    logos: ["crypto.svg"],
    value: "crypto",
  },
];
const MainComponent = ({
  thisItem,
  itemType,
}: {
  thisItem: ICourse | ICoursePackage | IPackage | null;
  itemType?: ItemType;
}) => {
  const text = useTranslations("checkout");
  const [selectedMethod, setSelectedMethod] = useState<
    "stripe" | "lahza" | "crypto" | ""
  >("");
  const [isVerified, setIsVerified] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [needPlacementExams, setNeedPlacementExams] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const { token, user } = useAuth();
  const { getCourses } = useMyCoursesStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCoupon = useMemo(
    () => getCouponCodeFromSearchParams(searchParams),
    [searchParams],
  );
  const [coupon, setCoupon] = useState(initialCoupon);
  const isLoading = isPaymentLoading || isCouponLoading;
  const priceSummary = useMemo(
    () => calculateCouponPrice(getItemBasePrice(thisItem), discount),
    [discount, thisItem],
  );
  const handelPayment = async (force = false) => {
    if (!token) {
      toast.error(text("loginFirst"));
      return;
    }
    if (!thisItem) {
      toast.error(text("invalidItem"));
      return;
    }
    try {
      setIsPaymentLoading(true);
      if (
        itemType === "course" &&
        ((thisItem.priceAfterDiscount && thisItem.priceAfterDiscount == 0) ||
          thisItem.price == 0)
      ) {
        await axiosInstance.put(
          `/orders/createUnPaidOrder/${thisItem._id}`,
          force ? { force: true } : {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        getCourses(token, user?._id || "", true);
        router.push(`/courses/${thisItem._id}`);
      } else {
        if (!isVerified) {
          toast.error(text("verifyRecaptcha"));
          return;
        }
        if (!selectedMethod) {
          toast.error(text("selectPaymentMethod"));
          return;
        }
        let endpoint =
          itemType === "course"
            ? `/orders/plisio/courseCheckout/${thisItem._id}`
            : itemType === "learning-path"
              ? `/orders/plisio/coursePackageCheckout/${thisItem._id}`
              : `/orders/plisio/packageCheckout/${thisItem._id}`;
        if (selectedMethod === "lahza") {
          endpoint =
            itemType === "course"
              ? `/orders/lahza/courseCheckout/${thisItem._id}`
              : itemType === "learning-path"
                ? `/orders/lahza/coursePackageCheckout/${thisItem._id}`
                : `/orders/lahza/packageCheckout/${thisItem._id}`;
        } else if (selectedMethod === "stripe") {
          endpoint =
            itemType === "course"
              ? `/orders/stripe/courseCheckout/${thisItem._id}`
              : itemType === "learning-path"
                ? `/orders/stripe/coursePackageCheckout/${thisItem._id}`
                : `/orders/stripe/packageCheckout/${thisItem._id}`;
        }
        const res = await axiosInstance.put<{
          redirectUrl?: string;
          session?: { url?: string | null };
        }>(
          endpoint,
          {
            paymentMethod: selectedMethod,
            ...(selectedCoupon ? { couponName: selectedCoupon } : {}),
            ...(force ? { force: true } : {}),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const checkoutUrl =
          res.data.session?.url ?? res.data.redirectUrl ?? undefined;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          toast.error(text("paymentError"));
        }
      }
    } catch (err) {
      const typedError = err as AxiosError<{ error?: string }>;
      if (
        typedError.response?.status === 403 &&
        itemType === "course" &&
        !force
      ) {
        setNeedPlacementExams(true);
      } else {
        if (typedError.response?.data.error)
          toast.error(typedError.response.data.error);
        else toast.error(text("paymentError"));
      }
      console.log(err);
    } finally {
      setIsPaymentLoading(false);
    }
  };
  const applyCouponCode = useCallback(
    async (couponCode: string, showSuccessToast = true) => {
      const normalizedCoupon = couponCode.trim();

      if (!normalizedCoupon) return;

      if (!token) {
        toast.error(text("loginFirst"));
        return;
      }

      if (!thisItem || !itemType) {
        toast.error(text("invalidItem"));
        return;
      }

      try {
        setIsCouponLoading(true);
        const identifiableItem = thisItem as typeof thisItem & {
          id?: string;
          slug?: string;
        };
        const itemIdentifiers = [
          identifiableItem._id,
          identifiableItem.id,
          identifiableItem.slug,
        ].filter((identifier): identifier is string => !!identifier);

        const res = await axiosInstance.get<{
          coupon: CouponDetails;
        }>(`/coupons/getCouponDetails/${encodeURIComponent(normalizedCoupon)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const couponObj = res.data.coupon;

        if (couponObj.usedTimes >= couponObj.maxUsageTimes) {
          setDiscount(0);
          setSelectedCoupon("");
          if (showSuccessToast) toast.error(text("couponExceeded"));
          return;
        }

        if (
          !canCouponApplyToItem(couponObj, itemType, itemIdentifiers)
        ) {
          setDiscount(0);
          setSelectedCoupon("");
          if (showSuccessToast) toast.error(text("invalidCoupon"));
          return;
        }

        setDiscount(couponObj.discount);
        setSelectedCoupon(couponObj.couponName);
        setCoupon(couponObj.couponName);
        if (showSuccessToast) toast.success(text("couponAppliedSuccessfully"));
      } catch (err) {
        setDiscount(0);
        setSelectedCoupon("");
        const typedError = err as AxiosError<{
          error?: string;
          message?: string;
        }>;
        if (!showSuccessToast) return;
        if (typedError.response?.data.error)
          toast.error(typedError.response.data.error);
        else if (typedError.response?.data.message)
          toast.error(typedError.response.data.message);
        else toast.error(text("invalidCoupon"));
      } finally {
        setIsCouponLoading(false);
      }
    },
    [itemType, text, thisItem, token],
  );

  useEffect(() => {
    if (!initialCoupon || !token) return;
    setCoupon(initialCoupon);
    applyCouponCode(initialCoupon, false);
  }, [applyCouponCode, initialCoupon, token]);

  const applyCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyCouponCode(coupon);
  };
  return (
    <>
      <section className="container grid lg:grid-cols-2 secPadding">
        <div className="py-6 max-lg:order-1 lg:px-6">
          <h1 className="h3">{text("title")}</h1>
          <p className="mt-1 font-medium text-text-3">{text("description")}</p>
          <div className="mt-4 ">
            {methods.map((method, ind) => (
              <button
                disabled={isLoading}
                key={method.value}
                onClick={() =>
                  setSelectedMethod(
                    method.value as "stripe" | "lahza" | "crypto",
                  )
                }
                className={cn(
                  "flex items-center disabled:opacity-80 disabled:cursor-not-allowed justify-between w-full px-4 py-3 border sm:py-4  sm:px-5 max-sm:text-sm",
                  {
                    "bg-primary-faded border-primary":
                      selectedMethod === method.value,
                    "rounded-t-sm": ind === 0,
                    "rounded-b-sm": ind === methods.length - 1,
                  },
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full ",
                      {
                        "bg-primary": selectedMethod === method.value,
                        "bg-muted": selectedMethod !== method.value,
                      },
                    )}
                  >
                    <div className="flex items-center justify-center w-2 h-2 rounded-full bg-muted" />
                  </div>
                  <span className="font-semibold text-text-2">
                    {text(method.label)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {method.logos.map((logo) => (
                    <Image
                      width={36}
                      height={24}
                      key={logo}
                      src={`/logos/${logo}`}
                      alt={method.label}
                      className="object-contain w-10 p-1 border rounded-[1px] h-7 bg-clear-ground"
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 max-lg:hidden w-fit ms-auto min-w-72">
            {selectedMethod && (
              <div>
                <ReCAPTCHA
                  sitekey="6Lc30IsqAAAAAMQTYXjAZgOEn92Yj085Hne_RWN1"
                  onChange={() => {
                    setIsVerified(true);
                  }}
                />
              </div>
            )}
            <Button
              disabled={!isVerified || !selectedMethod || isLoading}
              className="w-full mt-3"
              size={"lg"}
              onClick={() => handelPayment()}
            >
              {text("pay")}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 max-lg:hidden whitespace-nowrap ">
            <Link
              className="underline text-primary"
              href={"/return-and-refund-policy"}
            >
              {text("returnAndRefundPolicy")}
            </Link>
            <Link
              href={"/terms-of-services"}
              className="underline text-primary"
            >
              {text("termsOfService")}
            </Link>
            <Link href={"/privacy-policy"} className="underline text-primary">
              {text("privacyPolicy")}
            </Link>
          </div>
        </div>
        <div className="py-6 max-lg:order-2 lg:px-6">
          <div className="flex justify-between ">
            <div>
              <h5>{getDynamicString(thisItem?.title)}</h5>
              <span className="text-sm text-text-3">
                {itemType && text(itemType as ItemType)}
              </span>
            </div>
            <div className="flex items-start gap-1 font-medium whitespace-nowrap">
              {thisItem?.priceAfterDiscount &&
              thisItem.priceAfterDiscount !== thisItem.price ? (
                <>
                  {" "}
                  <div className="h4 text-primary">
                    ${priceSummary.subtotal.toFixed(2).replace(".00", "")}
                  </div>
                  <del className="h5 text-text-3">${thisItem?.price}</del>
                </>
              ) : (
                <div className="h4 text-primary">
                  ${priceSummary.subtotal.toFixed(2).replace(".00", "")}
                </div>
              )}
            </div>
          </div>
          <form onSubmit={applyCoupon} className="flex items-center gap-3 mt-4">
            <Input
              required
              disabled={isLoading}
              placeholder={text("discountCode")}
              value={coupon}
              onChange={(e) => {
                const value = e.target.value;
                setCoupon(value);
                if (value.trim() !== selectedCoupon) {
                  setDiscount(0);
                  setSelectedCoupon("");
                }
              }}
            />
            <Button isLoading={isCouponLoading}>{text("apply")}</Button>
          </form>
          <div className="mt-4">
            <div className="flex justify-between mt-1 text-sm">
              <span className="font-medium">{text("subTotal")}</span>
              <span className="text-text-3">
                ${priceSummary.subtotal.toFixed(2).replace(".00", "")}
              </span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="font-medium">{text("discount")}</span>
              <span className="text-text-3">
                ${priceSummary.discountAmount.toFixed(2).replace(".00", "")}
              </span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="font-medium">{text("total")}</span>
              <span className="text-text-3">
                ${priceSummary.total.toFixed(2).replace(".00", "")}
              </span>
            </div>
          </div>
          <div className="mt-3 lg:hidden w-fit ms-auto min-w-72">
            {selectedMethod && (
              <div>
                <ReCAPTCHA
                  sitekey="6Lc30IsqAAAAAMQTYXjAZgOEn92Yj085Hne_RWN1"
                  onChange={() => {
                    setIsVerified(true);
                  }}
                />
              </div>
            )}
            <Button
              disabled={!isVerified || !selectedMethod || isLoading}
              className="w-full mt-3"
              size={"lg"}
              onClick={() => handelPayment()}
            >
              {text("pay")}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 lg:hidden whitespace-nowrap ">
            <Link
              className="underline text-primary"
              href={"/return-and-refund-policy"}
            >
              {text("returnAndRefundPolicy")}
            </Link>
            <Link
              href={"/terms-of-services"}
              className="underline text-primary"
            >
              {text("termsOfService")}
            </Link>
            <Link href={"/privacy-policy"} className="underline text-primary">
              {text("privacyPolicy")}
            </Link>
          </div>
        </div>
      </section>
      <Dialog open={needPlacementExams} onOpenChange={setNeedPlacementExams}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{text("youCanontBuyThisCourseNow")}</DialogTitle>
            <DialogDescription>
              {text("youShouldTakeThoseCoursesFirstOrTakePlacementTest")}
            </DialogDescription>
          </DialogHeader>
          <ul>
            {(thisItem as ICourse)?.accessibleCourses?.map((course, index) => (
              <li key={course._id}>
                <Link
                  className="mb-2 hover:underline hover:text-primary "
                  href={`/courses/${course._id}/placement-exam`}
                  target="_blank"
                >
                  {index + 1} - {getDynamicString(course.title)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button asChild className="flex-1">
              <Link href={`/courses/${thisItem?._id}/placement-exam`}>
                {text("startPlacementTest")}
              </Link>
            </Button>
            <Button
              variant="outline"
              disabled={isLoading}
              className="flex-1"
              onClick={() => {
                setNeedPlacementExams(false);
                handelPayment(true);
              }}
            >
              {text("skipPlacementTest")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MainComponent;
