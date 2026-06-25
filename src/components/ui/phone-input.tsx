/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Input } from "./input";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Check, ChevronDown } from "lucide-react";
import { countries } from "@/data/countries";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const listId = React.useId();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [popoverWidth, setPopoverWidth] = React.useState<number>();

  const value = form.watch(input.name) as string;
  const [selectedCountry, setSelectedCountry] = React.useState(() => {
    const palestine = countries.find((country) => country.slug === "ps");
    return palestine || countries[0];
  });

  React.useEffect(() => {
    const updateWidth = () => {
      setPopoverWidth(wrapperRef.current?.getBoundingClientRect().width);
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue?.startsWith(selectedCountry.phoneCode))
      form.setValue(input.name, newValue as unknown as PathValue<T, Path<T>>);
  };

  const handleCountrySelect = (countrySlug: string) => {
    const country = countries.find((c) => c.slug === countrySlug);
    if (!country) return;

    const nextValue = value?.startsWith(selectedCountry.phoneCode)
      ? `${country.phoneCode}${value.slice(selectedCountry.phoneCode.length)}`
      : country.phoneCode;

    setSelectedCountry(country);
    form.setValue(input.name, nextValue as unknown as PathValue<T, Path<T>>);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const country = countries.find((c) =>
      input.defValue?.startsWith(c.phoneCode),
    );
    if (country) {
      setSelectedCountry(country);
    }
  }, [input.defValue, setSelectedCountry]);

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
          <div ref={wrapperRef} className="relative" dir="ltr">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button
                  disabled={loading || input.disabled}
                  type="button"
                  role="combobox"
                  aria-controls={listId}
                  aria-expanded={isOpen}
                  className="absolute inset-y-0 start-0 z-10 flex w-20 items-center justify-center gap-1 rounded-s-xl border-e border-primary/10 text-text-2 transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <img
                    src={`https://flagcdn.com/24x18/${selectedCountry.slug}.png`}
                    alt={selectedCountry.name[locale as "ar" | "en"]}
                    width={24}
                    height={18}
                    className="h-[18px] w-6 rounded-sm object-cover"
                  />
                  <ChevronDown className="size-4 text-text-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="overflow-hidden rounded-xl border-primary/10 bg-clear-ground p-0 shadow-lg shadow-text-1/5"
                style={{ width: popoverWidth }}
              >
                <Command>
                  <CommandInput placeholder={input.placeholder} />
                  <CommandList id={listId}>
                    <CommandEmpty>{input.placeholder}</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.slug}
                          value={`${country.name[locale as "ar" | "en"]} ${country.phoneCode}`}
                          onSelect={() => handleCountrySelect(country.slug)}
                        >
                          <span className="flex min-w-0 flex-1 items-center gap-3">
                            <img
                              src={`https://flagcdn.com/24x18/${
                                country.slug === "ps1" ? "ps" : country.slug
                              }.png`}
                              alt={country.name[locale as "ar" | "en"]}
                              width={24}
                              height={18}
                              className="h-[18px] w-6 rounded-sm object-cover"
                            />
                            <span className="truncate">
                              {country.name[locale as "ar" | "en"]}
                            </span>
                          </span>
                          <span
                            className="shrink-0 text-sm text-text-3"
                            dir="ltr"
                          >
                            {country.phoneCode}
                          </span>
                          <Check
                            className={cn(
                              "ms-2 size-4 text-primary",
                              selectedCountry.slug === country.slug
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Input
              value={
                value?.startsWith(selectedCountry.phoneCode)
                  ? value
                  : selectedCountry.phoneCode
              }
              onChange={handlePhoneChange}
              style={{ paddingInlineStart: "6rem" }}
              className={cn(
                "ps-24",
                form.formState.errors[input.name] &&
                  "border-destructive/60 focus-visible:ring-destructive/15",
              )}
              placeholder={input.placeholder}
              disabled={loading || input.disabled}
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { PhoneInput };
