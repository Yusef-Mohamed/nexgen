"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { buildAuthHref, getCurrentRedirectPath } from "@/lib/authRedirect";
import { CouponItemType, PricedItem } from "@/lib/coupons";
import { useCouponPreview } from "@/hooks/useCouponPreview";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CiDiscount1 } from "react-icons/ci";
import { Skeleton } from "./ui/skeleton";
import { useMemo } from "react";

interface CouponAwarePriceProps {
  item: PricedItem;
  itemId: string;
  itemType: CouponItemType;
  couponCode?: string;
  freeLabel: string;
  discountedLabel: string;
  priceClassName?: string;
  originalPriceClassName?: string;
  badgeClassName?: string;
}

const formatPrice = (price: number) =>
  `$${price.toFixed(2).replace(".00", "")}`;

const CouponAwarePrice = ({
  item,
  itemId,
  itemType,
  couponCode,
  freeLabel,
  discountedLabel,
  priceClassName = "h2",
  originalPriceClassName = "h3 text-text-3",
  badgeClassName = "flex items-center gap-1 px-3 py-2 rounded-md h5 text-green bg-fadedGreen",
}: CouponAwarePriceProps) => {
  const text = useTranslations("checkout");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const itemIdentifiers = useMemo(() => {
    const identifiableItem = item as PricedItem & {
      _id?: string;
      id?: string;
      slug?: string;
    };

    return [identifiableItem._id, identifiableItem.id, identifiableItem.slug]
      .filter((identifier): identifier is string => !!identifier)
      .filter((identifier) => identifier !== itemId);
  }, [item, itemId]);
  const couponPreview = useCouponPreview({
    couponCode,
    item,
    itemId,
    itemIdentifiers,
    itemType,
  });

  const originalPrice = Number(item.price || 0);
  const builtInPrice =
    item.priceAfterDiscount !== null &&
    item.priceAfterDiscount !== undefined &&
    item.priceAfterDiscount !== ""
      ? Number(item.priceAfterDiscount)
      : null;
  const hasBuiltInDiscount =
    builtInPrice !== null && builtInPrice > 0 && builtInPrice < originalPrice;
  const hasCouponDiscount = couponPreview.isValid && couponPreview.discount > 0;
  const displayPrice = hasCouponDiscount
    ? couponPreview.total
    : couponPreview.subtotal;
  const originalDisplayPrice = hasCouponDiscount
    ? originalPrice || couponPreview.subtotal
    : originalPrice;
  const discountPercent = hasCouponDiscount
    ? originalDisplayPrice > 0
      ? ((originalDisplayPrice - displayPrice) / originalDisplayPrice) * 100
      : couponPreview.discount
    : hasBuiltInDiscount && originalPrice > 0
      ? ((originalPrice - (builtInPrice || 0)) / originalPrice) * 100
      : 0;
  const showDiscountBadge = discountPercent > 0;

  if (couponPreview.isLoading) {
    return (
      <div className="flex items-center justify-between my-4 md:my-8">
        <div className="flex items-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    );
  }

  return (
    <div className="my-4 md:my-8">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-1 font-medium whitespace-nowrap">
          {displayPrice > 0 ? (
            <>
              <div className={priceClassName}>{formatPrice(displayPrice)}</div>
              {(hasCouponDiscount || hasBuiltInDiscount) && (
                <del className={originalPriceClassName}>
                  {formatPrice(originalDisplayPrice)}
                </del>
              )}
            </>
          ) : (
            <div className={priceClassName}>{freeLabel}</div>
          )}
        </div>
        {showDiscountBadge ? (
          <div
            style={{
              fontWeight: 400,
            }}
            className={cn(badgeClassName)}
          >
            <CiDiscount1 className="w-6 h-6" />
            <span>
              <span className="!text-sm">{discountedLabel} </span>
              {discountPercent.toFixed(0)}%
            </span>
          </div>
        ) : null}
      </div>
      {couponPreview.isGuestWithCoupon ? (
        <Link
          href={buildAuthHref(
            "/sign-in",
            getCurrentRedirectPath(pathname, searchParams),
          )}
          className="mt-2 block text-sm font-medium text-primary underline"
        >
          {text("loginToActivateCoupon")}
        </Link>
      ) : null}
      {hasCouponDiscount ? (
        <p className="mt-1 text-xs! font-medium text-green">
          {text("couponAppliedInline", {
            coupon: couponPreview.selectedCoupon || couponCode || "",
          })}
        </p>
      ) : null}
      {couponCode && couponPreview.error && !couponPreview.isGuestWithCoupon ? (
        <p className="mt-2 text-sm font-medium text-destructive">
          {text("couponNotAvailableForItem")}
        </p>
      ) : null}
    </div>
  );
};

export default CouponAwarePrice;
