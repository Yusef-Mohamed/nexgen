"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getDynamicString } from "@/lib/utils";
import { DynamicString } from "@/types";
import { marketingNestedBorderClassName } from "./filterStyles";

interface SelectableItem {
  _id: string;
  title: DynamicString;
}

interface CouponAppliesToSelectorProps {
  title: string;
  items: SelectableItem[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  isLoading: boolean;
  emptyMessageKey: string;
  itemIdPrefix: string;
  disabled?: boolean;
}

const CouponAppliesToSelector: React.FC<CouponAppliesToSelectorProps> = ({
  title,
  items,
  selectedIds,
  onSelectionChange,
  isLoading,
  emptyMessageKey,
  itemIdPrefix,
  disabled = false,
}) => {
  const t = useTranslations("couponManagement");

  const allSelected = useMemo(() => {
    return items.length > 0 && selectedIds.length === items.length;
  }, [items.length, selectedIds.length]);

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      // Select all items
      onSelectionChange(items.map((item) => item._id));
    } else {
      // Deselect all items
      onSelectionChange([]);
    }
  };

  const handleToggleItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, itemId]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== itemId));
    }
  };

  // Skeleton loader component
  const SelectionSkeleton = () => (
    <div className="space-y-2">
      {[...Array(3)].map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex items-center space-x-2 p-2"
        >
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{title}</Label>
      <div
        className={cn(
          "max-h-40 space-y-2 overflow-y-auto p-3",
          marketingNestedBorderClassName,
        )}
      >
        {isLoading ? (
          <SelectionSkeleton />
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t(emptyMessageKey)}</p>
        ) : (
          <>
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center space-x-2 rounded-lg p-2 transition-colors hover:bg-primary/10"
              >
                <Checkbox
                  id={`${itemIdPrefix}-${item._id}`}
                  checked={selectedIds.includes(item._id)}
                  onCheckedChange={(checked) =>
                    handleToggleItem(item._id, checked as boolean)
                  }
                  disabled={disabled}
                />
                <Label
                  htmlFor={`${itemIdPrefix}-${item._id}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {getDynamicString(item.title)}
                </Label>
              </div>
            ))}
            {/* Check all checkbox - only show if there's more than one item */}
            {items.length > 1 && (
              <div className="mt-2 flex items-center space-x-2 rounded-lg border-t border-primary/10 p-2 pt-2 transition-colors hover:bg-primary/10">
                <Checkbox
                  id={`${itemIdPrefix}-check-all`}
                  checked={allSelected}
                  onCheckedChange={handleToggleAll}
                  disabled={disabled}
                />
                <Label
                  htmlFor={`${itemIdPrefix}-check-all`}
                  className="flex-1 cursor-pointer text-sm font-medium"
                >
                  {t("createCoupon.form.appliesTo.checkAll")}
                </Label>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CouponAppliesToSelector;
