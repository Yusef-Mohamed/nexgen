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
import { LearningPathFormData } from "../../hooks/useLearningPathForm";

interface Step4PricingProps {
  form: UseFormReturn<LearningPathFormData>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step4Pricing: React.FC<Step4PricingProps> = ({
  form,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("learningPathForm");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("pricing")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("pricing_description") || "Set your learning path pricing"}
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
    </div>
  );
};

export default Step4Pricing;
