/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "./form";
import { countries } from "@/data/countries";
import { CommandSelect } from "@/components/ui/command-select";

interface CountryInputProps<T extends FieldValues> {
  input: {
    type: string;
    label: string;
    placeholder: string;
    name: Path<T>;
    required?: boolean;
    disabled?: boolean;
  };
  form: UseFormReturn<T>;
  loading?: boolean;
}

const CountryInput = <T extends FieldValues>({
  input,
  form,
  loading,
}: CountryInputProps<T>) => {
  const locale = useLocale();
  const selectedValue = form.watch(input.name) as string | undefined;

  const options = React.useMemo(
    () =>
      countries
        .filter((country) => country.slug !== "ps1")
        .map((country) => ({
          value: country.slug,
          label: country.name[locale as "ar" | "en"],
          searchLabel: country.name[locale as "ar" | "en"],
          leading: (
            <img
              src={`https://flagcdn.com/24x18/${country.slug}.png`}
              alt={country.name[locale as "ar" | "en"]}
              width={24}
              height={18}
              className="h-[18px] w-6 rounded-sm object-cover"
            />
          ),
        })),
    [locale],
  );

  return (
    <FormField
      control={form.control}
      name={input.name}
      render={() => (
        <FormItem>
          <FormLabel>
            {input.label}
            {input.required && <span className="text-destructive">*</span>}
          </FormLabel>
          <CommandSelect
            value={selectedValue}
            onValueChange={(countrySlug) => {
              form.setValue(input.name, countrySlug as PathValue<T, Path<T>>);
            }}
            options={options}
            placeholder={input.placeholder}
            searchPlaceholder={input.placeholder}
            emptyText={input.placeholder}
            disabled={loading || input.disabled}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { CountryInput };
