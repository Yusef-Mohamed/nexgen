/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Input } from "./input";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "./form";
import { ChevronDown } from "lucide-react";
import { CountryDialog } from "./country-dialog";
import { countries } from "@/data/countries";

interface PhoneInputProps<T extends FieldValues> {
  input: {
    type: string;
    label: string;
    placeholder: string;
    name: Path<T>;
    required?: boolean;
    values?: {
      value: string;
      label: string;
    }[];
    defValue?: string;
    disabled?: boolean;
  };
  form: UseFormReturn<T>;
  loading?: boolean;
}

const PhoneInput = <T extends FieldValues>({
  input,
  form,
  loading,
}: PhoneInputProps<T>) => {
  const locale = useLocale();
  const [isOpen, setIsOpen] = React.useState(false);

  const value = form.watch(input.name) as string;
  const [selectedCountry, setSelectedCountry] = React.useState(() => {
    const palestine = countries.find((country) => country.slug === "ps");
    return palestine || countries[0];
  });

  // Handle phone number changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue?.startsWith(selectedCountry.phoneCode))
      form.setValue(input.name, newValue as unknown as PathValue<T, Path<T>>);
  };

  // Handle country selection
  const handleCountrySelect = (countrySlug: string) => {
    const country = countries.find((c) => c.slug === countrySlug);
    if (country) {
      setSelectedCountry(country);
    }
  };
  React.useEffect(() => {
    const country = countries.find((c) =>
      input.defValue?.startsWith(c.phoneCode)
    );
    if (country) {
      setSelectedCountry(country);
    }
  }, [input.defValue, setSelectedCountry]);

  return (
    <>
      <FormField
        control={form.control}
        name={input.name}
        render={() => (
          <FormItem>
            <FormLabel>
              {input.label}
              {input.required && <span className="text-destructive">*</span>}
            </FormLabel>
            <div className="relative" dir="ltr">
              <button
                disabled={input.disabled}
                onClick={() => setIsOpen(true)}
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src={`https://flagcdn.com/24x18/${selectedCountry.slug}.png`}
                  alt={selectedCountry.name[locale as "ar" | "en"]}
                  width={24}
                  height={18}
                  className="w-6"
                />
                <ChevronDown className="w-4 h-4 opacity-50 ms-auto" />
              </button>
              <Input
                value={
                  value?.startsWith(selectedCountry.phoneCode)
                    ? value
                    : selectedCountry.phoneCode
                }
                onChange={handlePhoneChange}
                className={cn(
                  "lg:pl-16 sm:pl-16 md:pl-16 pl-16",
                  form.formState.errors[input.name] &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                placeholder={input.placeholder}
                disabled={loading || input.disabled}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <CountryDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onSelect={handleCountrySelect}
        selectedValue={selectedCountry.slug}
        showPhoneCode
      />
    </>
  );
};

export { PhoneInput };
