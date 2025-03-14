import React from "react";
import CustomFormField from "../FormField";
import { Button } from "../ui/button";
import useCustomForm from "@/hooks/useCustomForm";
import { ZodSchema } from "zod";
import { Form } from "../ui/form";
import { FieldValues, Path } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { PhoneInput } from "../ui/phone-input";
import { CountryInput } from "../ui/country-input";

interface CustomFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  fields: Array<{
    type: string;
    label: string;
    placeholder: string;
    name: keyof T;
    required?: boolean;
    values?: {
      value: string;
      label: string;
      image?: string;
    }[];
  }>;
  submitLabel: string;
  onSubmit: (data: T) => Promise<void>;
  extraComponents?: React.ReactNode;
  hasTerms?: boolean;
}

function CustomForm<T extends FieldValues>({
  schema,
  defaultValues,
  fields,
  submitLabel,
  onSubmit,
  extraComponents,
  hasTerms,
}: CustomFormProps<T>) {
  const { form, isLoading, formError, handleSubmit } = useCustomForm<T>({
    schema,
    defaultValues,
    onSubmit,
  });
  const locale = useLocale();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) =>
          field.type === "phone" ? (
            <PhoneInput
              key={String(field.name)}
              input={{
                type: field.type,
                label: field.label,
                placeholder: field.placeholder,
                name: field.name as Path<T>,
                required: field.required,
              }}
              form={form}
              loading={isLoading}
            />
          ) : field.type === "select" && field.values?.some((v) => v.image) ? (
            <CountryInput
              key={String(field.name)}
              input={{
                type: field.type,
                label: field.label,
                placeholder: field.placeholder,
                name: field.name as Path<T>,
                required: field.required,
              }}
              form={form}
              loading={isLoading}
            />
          ) : (
            <CustomFormField
              key={String(field.name)}
              input={{
                type: field.type,
                label: field.label,
                placeholder: field.placeholder,
                name: field.name as Path<T>,
                required: field.required,
                values: field.values,
              }}
              form={form}
              loading={isLoading}
            />
          )
        )}

        {formError && (
          <div className="text-sm text-destructive">{formError}</div>
        )}
        {hasTerms && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-2"
            >
              {locale === "ar" ? (
                <>
                  أوافق علي{" "}
                  <Link
                    href={"/terms-of-services"}
                    className="underline text-primary"
                    target="_blank"
                  >
                    الشروط الخدمات
                  </Link>
                </>
              ) : (
                <>
                  I agree to the{" "}
                  <Link
                    href={"/terms-of-services"}
                    className="underline text-primary"
                    target="_blank"
                  >
                    Terms of Services
                  </Link>
                </>
              )}
            </label>
            <Checkbox required id="terms" />
          </div>
        )}
        <Button isLoading={isLoading} className="w-full" type="submit">
          {submitLabel}
        </Button>

        {extraComponents}
      </form>
    </Form>
  );
}

export default CustomForm;
