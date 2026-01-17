"use client";

import * as React from "react";
import { Input } from "./input";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./dialog";
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
      <DialogContent className="sm:max-w-lg max-w-[95vw]">
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
              }
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
        <div className="max-h-[40vh] overflow-auto">
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
                  "flex items-center justify-between gap-2 cursor-pointer w-full py-2 px-3 hover:bg-primary/10",
                  {
                    "bg-primary/10": country.slug === selectedValue,
                  }
                )}
              >
                <div className="flex items-center gap-4 text-subText">
                  <img
                    src={`https://flagcdn.com/24x18/${
                      country.slug === "ps1" ? "ps" : country.slug
                    }.png`}
                    alt={country.name[locale as "ar" | "en"]}
                    width={24}
                    height={18}
                    className="w-8"
                  />
                  <span className="sm:text-lg">
                    {country.name[locale as "ar" | "en"]}
                  </span>
                </div>
                {showPhoneCode && (
                  <span dir="ltr" className="sm:text-xl text-subText">
                    ({country.phoneCode})
                  </span>
                )}
              </button>
            ) : null
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CountryDialog };
