import React from "react";
import CustomFormField from "../FormField";
import { Button } from "../ui/button";
import useCustomForm from "@/hooks/useCustomForm";
import { ZodSchema } from "zod";
import { Form } from "../ui/form";
import { FieldValues, Path } from "react-hook-form";

interface CustomFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  fields: Array<{
    type: string;
    label: string;
    placeholder: string;
    name: keyof T;
    required?: boolean;
  }>;
  submitLabel: string;
  onSubmit: (data: T) => Promise<void>;
  extraComponents?: React.ReactNode;
}

function CustomForm<T extends FieldValues>({
  schema,
  defaultValues,
  fields,
  submitLabel,
  onSubmit,
  extraComponents,
}: CustomFormProps<T>) {
  const { form, isLoading, formError, handleSubmit } = useCustomForm<T>({
    schema,
    defaultValues,
    onSubmit,
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <CustomFormField
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
        ))}

        {formError && (
          <div className="text-sm text-destructive">{formError}</div>
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
