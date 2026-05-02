export type CouponItemType = "course" | "learning-path" | "service";

export type CouponSearchParams =
  | URLSearchParams
  | {
      get: (key: string) => string | null;
    }
  | Record<string, string | string[] | undefined>
  | null
  | undefined;

export type CouponScopedEntity = string | { _id?: string; id?: string; slug?: string };

export interface CouponDetails {
  couponName: string;
  discount: number;
  maxUsageTimes: number;
  usedTimes: number;
  courses?: CouponScopedEntity[];
  coursePackages?: CouponScopedEntity[];
  packages?: CouponScopedEntity[];
}

export interface PricedItem {
  price?: number | string | null;
  priceAfterDiscount?: number | string | null;
}

const getParamValue = (
  searchParams: CouponSearchParams,
  key: "coupon" | "code" | "",
) => {
  if (!searchParams) return "";

  if ("get" in searchParams && typeof searchParams.get === "function") {
    return searchParams.get(key) || "";
  }

  const value = (searchParams as Record<string, string | string[] | undefined>)[
    key
  ];
  return Array.isArray(value) ? value[0] || "" : value || "";
};

export const getCouponCodeFromSearchParams = (
  searchParams: CouponSearchParams,
) => {
  const code =
    getParamValue(searchParams, "coupon") ||
    getParamValue(searchParams, "code") ||
    getParamValue(searchParams, "");
  return code.trim();
};

export const buildCheckoutHref = (
  itemType: CouponItemType,
  itemId: string,
  couponCode?: string,
) => {
  const baseHref = `/checkout/${itemType}/${itemId}`;
  const normalizedCoupon = couponCode?.trim();

  if (!normalizedCoupon) return baseHref;

  const params = new URLSearchParams();
  params.set("coupon", normalizedCoupon);
  return `${baseHref}?${params.toString()}`;
};

const toNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return 0;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const getItemBasePrice = (item?: PricedItem | null) => {
  const price = toNumber(item?.price);
  const priceAfterDiscount = item?.priceAfterDiscount;

  if (priceAfterDiscount !== null && priceAfterDiscount !== undefined) {
    const discountedPrice = toNumber(priceAfterDiscount);
    if (discountedPrice > 0 && discountedPrice < price) return discountedPrice;
  }

  return price;
};

export const calculateCouponPrice = (
  subtotal: number,
  discountPercent = 0,
) => {
  const normalizedDiscount = Math.min(Math.max(discountPercent, 0), 100);
  const discountAmount = subtotal * (normalizedDiscount / 100);
  const total = Math.max(subtotal - discountAmount, 0);

  return {
    subtotal,
    discountAmount,
    total,
  };
};

const getEntityIdentifiers = (entity: CouponScopedEntity) => {
  if (typeof entity === "string") return [entity].filter(Boolean);

  return [entity._id, entity.id, entity.slug].filter(
    (value): value is string => !!value,
  );
};

export const canCouponApplyToItem = (
  coupon: CouponDetails,
  itemType: CouponItemType,
  itemIdentifiers: string | string[],
) => {
  const scopedItems =
    itemType === "course"
      ? coupon.courses
      : itemType === "learning-path"
        ? coupon.coursePackages
        : coupon.packages;

  if (!scopedItems?.length) return false;

  const identifiers = new Set(
    (Array.isArray(itemIdentifiers) ? itemIdentifiers : [itemIdentifiers])
      .filter(Boolean)
      .map((identifier) => identifier.toString()),
  );

  return scopedItems
    .flatMap(getEntityIdentifiers)
    .some((identifier) => identifiers.has(identifier.toString()));
};
