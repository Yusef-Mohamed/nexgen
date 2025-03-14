"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "./form";
import { ChevronDown } from "lucide-react";
import { countries } from "@/data/countries";
import { CountryDialog } from "./country-dialog";

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
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedValue = form.watch(input.name) as string | undefined;
  const selectedCountry = React.useMemo(() => {
    return countries.find((country) => country.slug === selectedValue);
  }, [selectedValue]);

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
            <FormControl>
              <div className="relative">
                {selectedCountry ? (
                  <button
                    onClick={() => setIsOpen(true)}
                    type="button"
                    className="w-full flex items-center md:h-[3rem] disabled:opacity-50 disabled:cursor-not-allowed lg:h-[3.25rem] min-w-36 md:px-5 md:py-3 px-4 py-2 h-[2.75rem] text-sm md:text-base justify-between gap-2 border rounded-md hover:bg-accent"
                    disabled={loading || input.disabled}
                  >
                    <div className="flex items-center gap-4 text-subText">
                      <img
                        src={`https://flagcdn.com/24x18/${selectedCountry.slug}.png`}
                        alt={selectedCountry.name[locale as "ar" | "en"]}
                        width={24}
                        height={18}
                        className="w-8"
                      />
                      <span className="sm:text-lg">
                        {selectedCountry.name[locale as "ar" | "en"]}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOpen(true)}
                    type="button"
                    className="w-full flex items-center md:h-[3rem] lg:h-[3.25rem] disabled:cursor-not-allowed disabled:opacity-50 min-w-36 md:px-5 md:py-3 px-4 py-2 h-[2.75rem] text-sm md:text-base justify-between gap-2 border rounded-md hover:bg-accent"
                    disabled={loading || input.disabled}
                  >
                    <span>{input.placeholder}</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <CountryDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onSelect={(countrySlug) => {
          form.setValue(input.name, countrySlug as PathValue<T, Path<T>>);
        }}
        selectedValue={selectedValue}
      />
    </>
  );
};

export { CountryInput };
