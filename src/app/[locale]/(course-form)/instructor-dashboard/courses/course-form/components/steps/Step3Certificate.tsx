import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CourseFormSchema } from "../../hooks/useCourseForm";

interface Step3CertificateProps {
  form: UseFormReturn<CourseFormSchema>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step3Certificate: React.FC<Step3CertificateProps> = ({
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
          {text("certificate") || "Certificate"}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("certificate_description") ||
            "Configure certificate description and course rating"}
        </p>
      </div>

      {/* Certificate Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="certificateDescription.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("certificate_description")} ({text("english")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_certificate_description_english")}
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
          name="certificateDescription.ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("certificate_description")} ({text("arabic")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_certificate_description_arabic")}
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

      {/* Rating */}
      <FormField
        control={form.control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{text("rating")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger className={commonFormStyles}>
                  <SelectValue placeholder={text("select_rating")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>{text("rating_hint")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step3Certificate;
