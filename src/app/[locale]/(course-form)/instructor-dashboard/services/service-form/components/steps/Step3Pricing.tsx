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
} from "@/components/ui/form";
import { ServiceFormData } from "../../hooks/useServiceForm";

interface Step3PricingProps {
  form: UseFormReturn<ServiceFormData>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step3Pricing: React.FC<Step3PricingProps> = ({
  form,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("serviceForm");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("price")} / {text("subscription_duration_days")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("pricing_description") ||
            "Set your service pricing and subscription duration"}
        </p>
      </div>

      {/* Price Fields */}
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
                  step="0.01"
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
                  step="0.01"
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

      {/* Subscription Duration Days */}
      <FormField
        control={form.control}
        name="subscriptionDurationDays"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{text("subscription_duration_days")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                {...field}
                placeholder={text("enter_subscription_duration_days")}
                className={commonFormStyles}
                disabled={loading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step3Pricing;
