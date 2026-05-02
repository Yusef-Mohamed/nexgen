"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import {
  calculateCouponPrice,
  canCouponApplyToItem,
  CouponDetails,
  CouponItemType,
  getItemBasePrice,
  PricedItem,
} from "@/lib/coupons";
import { useEffect, useMemo, useState } from "react";

interface UseCouponPreviewArgs {
  couponCode?: string;
  itemType: CouponItemType;
  itemId: string;
  itemIdentifiers?: string[];
  item?: PricedItem | null;
  enabled?: boolean;
}

export const useCouponPreview = ({
  couponCode,
  itemType,
  itemId,
  itemIdentifiers,
  item,
  enabled = true,
}: UseCouponPreviewArgs) => {
  const { token } = useAuth();
  const normalizedCoupon = couponCode?.trim() || "";
  const [coupon, setCoupon] = useState<CouponDetails | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(() => !!normalizedCoupon);

  useEffect(() => {
    let isMounted = true;

    const fetchCoupon = async () => {
      setCoupon(null);
      setError("");

      if (!enabled || !normalizedCoupon || !token || !itemId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await axiosInstance.get<{
          coupon: CouponDetails;
        }>(`/coupons/getCouponDetails/${encodeURIComponent(normalizedCoupon)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const couponObj = res.data.coupon;

        if (couponObj.usedTimes >= couponObj.maxUsageTimes) {
          throw new Error("couponExceeded");
        }

        if (
          !canCouponApplyToItem(couponObj, itemType, [
            itemId,
            ...(itemIdentifiers || []),
          ])
        ) {
          throw new Error("couponWrongScope");
        }

        if (isMounted) setCoupon(couponObj);
      } catch (err) {
        if (isMounted) {
          setCoupon(null);
          setError(err instanceof Error ? err.message : "invalidCoupon");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCoupon();

    return () => {
      isMounted = false;
    };
  }, [enabled, itemId, itemIdentifiers, itemType, normalizedCoupon, token]);

  const discount = coupon?.discount || 0;
  const subtotal = getItemBasePrice(item);
  const prices = useMemo(
    () => calculateCouponPrice(subtotal, discount),
    [discount, subtotal],
  );

  return {
    coupon,
    discount,
    error,
    isGuestWithCoupon: !!normalizedCoupon && !token,
    isLoading,
    isValid: !!coupon,
    selectedCoupon: coupon?.couponName || "",
    ...prices,
  };
};
