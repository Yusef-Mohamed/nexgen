import React from "react";
import { UseFormReturn, FieldPath } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import DualLanguageHighlightsList from "../../courses/course-form/components/DualLanguageHighlightsList";
type DualLanguageHighlight = {
  en: string;
  ar: string;
};
export interface HighlightsStepConfig {
  // Step header
  stepTitle: string;
  stepDescription: string;

  // What will learn section
  whatWillLearn: {
    title: string;
    description: string;
  };

  // Prerequisites section
  coursePrerequisites: {
    title: string;
    description: string;
  };

  // Who is this for section
  whoThisCourseFor: {
    title: string;
    description: string;
  };

  // Placeholders
  placeholder: {
    en: string;
    ar: string;
  };

  // Error message
  emptyHighlightError: string;
}

interface HighlightsStepProps<
  T extends {
    whatWillLearn: Array<{ en: string; ar: string }>;
    coursePrerequisites: Array<{ en: string; ar: string }>;
    whoThisCourseFor: Array<{ en: string; ar: string }>;
  }
> {
  form: UseFormReturn<T>;
  config: HighlightsStepConfig;
  commonFormStyles: string;
  loading?: boolean;
}

const HighlightsStep = <
  T extends {
    whatWillLearn: Array<{ en: string; ar: string }>;
    coursePrerequisites: Array<{ en: string; ar: string }>;
    whoThisCourseFor: Array<{ en: string; ar: string }>;
  }
>({
  form,
  config,
  commonFormStyles,
  loading = false,
}: HighlightsStepProps<T>) => {
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
            fieldErrors[index].en = config.emptyHighlightError;
          }
        }
        if (!highlight.ar || highlight.ar.trim().length === 0) {
          if (fieldState.isTouched || fieldState.error) {
            fieldErrors[index].ar = config.emptyHighlightError;
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
          {config.stepTitle}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {config.stepDescription}
        </p>
      </div>

      {/* What will students learn */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {config.whatWillLearn.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {config.whatWillLearn.description}
          </p>
        </div>
        <FormField
          control={form.control}
          name={"whatWillLearn" as FieldPath<T>}
          render={({ field, fieldState }) => (
            <FormItem>
              <DualLanguageHighlightsList
                value={field.value as DualLanguageHighlight[]}
                onChange={field.onChange}
                placeholder={config.placeholder}
                label=""
                error={fieldState.error?.message}
                fieldErrors={extractErrors(
                  fieldState,
                  field.value as Array<{ en: string; ar: string }>
                )}
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
            {config.coursePrerequisites.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {config.coursePrerequisites.description}
          </p>
        </div>
        <FormField
          control={form.control}
          name={"coursePrerequisites" as FieldPath<T>}
          render={({ field, fieldState }) => (
            <FormItem>
              <DualLanguageHighlightsList
                value={field.value as DualLanguageHighlight[]}
                onChange={field.onChange}
                placeholder={config.placeholder}
                label=""
                error={fieldState.error?.message}
                fieldErrors={extractErrors(
                  fieldState,
                  field.value as Array<{ en: string; ar: string }>
                )}
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
            {config.whoThisCourseFor.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {config.whoThisCourseFor.description}
          </p>
        </div>
        <FormField
          control={form.control}
          name={"whoThisCourseFor" as FieldPath<T>}
          render={({ field, fieldState }) => (
            <FormItem>
              <DualLanguageHighlightsList
                value={field.value as DualLanguageHighlight[]}
                onChange={field.onChange}
                placeholder={config.placeholder}
                label=""
                error={fieldState.error?.message}
                fieldErrors={extractErrors(
                  fieldState,
                  field.value as Array<{ en: string; ar: string }>
                )}
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

export default HighlightsStep;
