/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Input } from "./input";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { countries } from "@/data/countries";
import { useTranslations } from "next-intl";

interface CountryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (countrySlug: string, phoneCode?: string) => void;
  selectedValue?: string;
  showPhoneCode?: boolean;
}

const CountryDialog = ({
  open,
  onOpenChange,
  onSelect,
  selectedValue,
  showPhoneCode = false,
}: CountryDialogProps) => {
  const locale = useLocale();
  const t = useTranslations("Forms");
  const [search, setSearch] = React.useState("");

  const filteredCountries = React.useMemo(() => {
    return countries.filter((country) => {
      return country.name[locale as "ar" | "en"]
        ?.toLowerCase()
        .includes(search?.toLowerCase());
    });
  }, [search, locale]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] border-primary/10 sm:max-w-lg">
        <DialogTitle className="sr-only">{t("searchCountry")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("selectCountryDescription")}
        </DialogDescription>
        <div className="relative">
          <Search
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-6 w-6 opacity-50",
              {
                "right-4": locale === "ar",
                "left-4": locale === "en",
              },
            )}
          />
          <Input
            type="text"
            placeholder={t("searchCountry")}
            value={search}
            className="lg:ps-12 md:ps-12 sm:ps-12 ps-12"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
        <div className="max-h-[40vh] space-y-1 overflow-auto pe-1">
          {filteredCountries.map((country) =>
            country.slug !== "ps1" || showPhoneCode ? (
              <button
                key={country.slug}
                type="button"
                onClick={() => {
                  onSelect(country.slug, country.phoneCode);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start transition-colors hover:bg-primary/10",
                  {
                    "bg-primary/10": country.slug === selectedValue,
                  },
                )}
              >
                <div className="flex min-w-0 items-center gap-3 text-text-2">
                  <img
                    src={`https://flagcdn.com/24x18/${
                      country.slug === "ps1" ? "ps" : country.slug
                    }.png`}
                    alt={country.name[locale as "ar" | "en"]}
                    width={24}
                    height={18}
                    className="h-[18px] w-6 rounded-sm object-cover"
                  />
                  <span className="truncate text-sm md:text-base">
                    {country.name[locale as "ar" | "en"]}
                  </span>
                </div>
                {showPhoneCode && (
                  <span dir="ltr" className="shrink-0 text-sm text-text-3">
                    ({country.phoneCode})
                  </span>
                )}
              </button>
            ) : null,
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CountryDialog };
