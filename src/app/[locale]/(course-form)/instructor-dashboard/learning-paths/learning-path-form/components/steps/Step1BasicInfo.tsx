import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LearningPathFormData } from "../../hooks/useLearningPathForm";
import { cn } from "@/lib/utils";

interface Step1BasicInfoProps {
  form: UseFormReturn<LearningPathFormData>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
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
          {text("title_en")} / {text("title_ar")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("add_learning_path_description") ||
            "Enter the basic information for your learning path"}
        </p>
      </div>

      {/* Title Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="title.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("title_en")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={text("enter_title_en")}
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
          name="title.ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("title_ar")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={text("enter_title_ar")}
                  className={commonFormStyles}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Description Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="description.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("description_en")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_description_en")}
                  rows={4}
                  className={cn(commonFormStyles, "!rounded-e-none")}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description.ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("description_ar")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_description_ar")}
                  rows={4}
                  className={cn(commonFormStyles, "!rounded-e-none")}
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

export default Step1BasicInfo;
