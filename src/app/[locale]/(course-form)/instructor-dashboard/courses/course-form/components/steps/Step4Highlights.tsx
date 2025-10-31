import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormField, FormItem } from "@/components/ui/form";
import DualLanguageHighlightsList from "../DualLanguageHighlightsList";
import { CourseFormSchema } from "../../hooks/useCourseForm";

interface Step4HighlightsProps {
  form: UseFormReturn<CourseFormSchema>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step4Highlights: React.FC<Step4HighlightsProps> = ({
  form,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("courses");

  // Helper function to extract errors for a field
  const extractErrors = (
    fieldState: { error?: unknown; isTouched?: boolean },
    fieldValue?: Array<{ en: string; ar: string }>
  ): Array<{ en?: string; ar?: string }> => {
    const fieldErrors: Array<{ en?: string; ar?: string }> = [];

    // Handle Zod validation errors
    if (fieldState.error) {
      // If error is an array (Zod array errors)
      if (Array.isArray(fieldState.error)) {
        fieldState.error.forEach((error: unknown, index: number) => {
          if (error && typeof error === "object") {
            const err = error as {
              en?: { message?: string };
              ar?: { message?: string };
            };
            if (!fieldErrors[index]) fieldErrors[index] = {};
            if (err.en?.message) {
              fieldErrors[index].en = err.en.message;
            }
            if (err.ar?.message) {
              fieldErrors[index].ar = err.ar.message;
            }
          }
        });
      }
    }

    // Also check for empty fields when validating
    if (fieldValue) {
      fieldValue.forEach((highlight, index) => {
        if (!fieldErrors[index]) fieldErrors[index] = {};
        if (!highlight.en || highlight.en.trim().length === 0) {
          // Only show error if form has been touched or submitted
          if (fieldState.isTouched || fieldState.error) {
            fieldErrors[index].en = text(
              "validation.highlight_cannot_be_empty"
            );
          }
        }
        if (!highlight.ar || highlight.ar.trim().length === 0) {
          if (fieldState.isTouched || fieldState.error) {
            fieldErrors[index].ar = text(
              "validation.highlight_cannot_be_empty"
            );
          }
        }
      });
    }

    return fieldErrors;
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("target_your_student")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("target_student_description")}
        </p>
      </div>

      {/* What will students learn */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {text("what_will_students_learn")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {text("what_will_students_learn_description")}
          </p>
        </div>
        <FormField
          control={form.control}
          name="whatWillLearn"
          render={({ field, fieldState }) => (
            <FormItem>
              <DualLanguageHighlightsList
                value={field.value || []}
                onChange={field.onChange}
                placeholder={{
                  en: text("enter_highlights_english"),
                  ar: text("enter_highlights_arabic"),
                }}
                label=""
                error={fieldState.error?.message}
                fieldErrors={extractErrors(fieldState, field.value)}
                commonFormStyles={commonFormStyles}
                disabled={loading}
              />
            </FormItem>
          )}
        />
      </div>

      {/* Course Prerequisites */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {text("course_prerequisites")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {text("course_prerequisites_description")}
          </p>
        </div>
        <FormField
          control={form.control}
          name="coursePrerequisites"
          render={({ field, fieldState }) => (
            <FormItem>
              <DualLanguageHighlightsList
                value={field.value || []}
                onChange={field.onChange}
                placeholder={{
                  en: text("enter_highlights_english"),
                  ar: text("enter_highlights_arabic"),
                }}
                label=""
                error={fieldState.error?.message}
                fieldErrors={extractErrors(fieldState, field.value)}
                commonFormStyles={commonFormStyles}
                disabled={loading}
              />
            </FormItem>
          )}
        />
      </div>

      {/* Who is this course for */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {text("who_is_this_course_for")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {text("who_is_this_course_for_description")}
          </p>
        </div>
        <FormField
          control={form.control}
          name="whoThisCourseFor"
          render={({ field, fieldState }) => (
            <FormItem>
              <DualLanguageHighlightsList
                value={field.value || []}
                onChange={field.onChange}
                placeholder={{
                  en: text("enter_highlights_english"),
                  ar: text("enter_highlights_arabic"),
                }}
                label=""
                error={fieldState.error?.message}
                fieldErrors={extractErrors(fieldState, field.value)}
                commonFormStyles={commonFormStyles}
                disabled={loading}
              />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Step4Highlights;
