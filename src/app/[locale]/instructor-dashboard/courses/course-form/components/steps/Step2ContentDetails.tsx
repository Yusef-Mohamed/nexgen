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
import { cn } from "@/lib/utils";
import { CourseFormSchema } from "../../hooks/useCourseForm";
import ReorderableHighlightsList from "../ReorderableHighlightsList";

interface Step2ContentDetailsProps {
  form: UseFormReturn<CourseFormSchema>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step2ContentDetails: React.FC<Step2ContentDetailsProps> = ({
  form,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("courses");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("step2_title")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 px-2">
          {text("step2_description")}
        </p>
      </div>

      {/* Course Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="highlights.en"
          render={({ field, fieldState }) => (
            <FormItem>
              <ReorderableHighlightsList
                value={field.value}
                onChange={field.onChange}
                label={`${text("highlights")} (${text("english")})`}
                placeholder={text("enter_highlights_english")}
                error={fieldState.error?.message}
                commonFormStyles={commonFormStyles}
                disabled={loading}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="highlights.ar"
          render={({ field, fieldState }) => (
            <FormItem>
              <ReorderableHighlightsList
                value={field.value}
                onChange={field.onChange}
                label={`${text("highlights")} (${text("arabic")})`}
                placeholder={text("enter_highlights_arabic")}
                error={fieldState.error?.message}
                commonFormStyles={commonFormStyles}
                disabled={loading}
              />
            </FormItem>
          )}
        />
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

      {/* Welcome Message */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="courseWelcomeMessage.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("welcome_message")} ({text("english")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_welcome_message_english")}
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
          name="courseWelcomeMessage.ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("welcome_message")} ({text("arabic")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_welcome_message_arabic")}
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

      {/* Goodbye Message */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="courseGoodByeMessage.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("goodbye_message")} ({text("english")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_goodbye_message_english")}
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
          name="courseGoodByeMessage.ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("goodbye_message")} ({text("arabic")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_goodbye_message_arabic")}
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

      {/* Course Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="courseDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("course_duration")} ({text("minutes")})
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder={text("enter_duration")}
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

export default Step2ContentDetails;
