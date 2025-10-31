import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { CourseFormSchema } from "../../hooks/useCourseForm";

interface Step2PricingProps {
  form: UseFormReturn<CourseFormSchema>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step2Pricing: React.FC<Step2PricingProps> = ({
  form,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("courses");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("pricing")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("pricing_description")}
        </p>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("price")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder={text("enter_price")}
                  className={commonFormStyles}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priceAfterDiscount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("price_after_discount")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder={text("enter_price_after_discount")}
                  className={commonFormStyles}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Free Package Subscription Days */}
      <FormField
        control={form.control}
        name="freePackageSubscriptionInDays"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{text("free_package_subscription_days")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value || ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder={text("enter_free_package_days")}
                className={commonFormStyles}
                disabled={loading}
              />
            </FormControl>
            <FormDescription>
              {text("free_package_subscription_hint")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step2Pricing;
