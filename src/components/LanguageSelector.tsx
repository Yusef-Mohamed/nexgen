"use client";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import React from "react";

const LanguageSelector: React.FC = () => {
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <Link
      href={pathname}
      locale={locale === "en" ? "ar" : "en"}
      className="flex items-center justify-center rounded-full h-[3.25rem] w-[3.25rem] bg-primary-faded"
    >
      {locale === "en" ? "ع ر" : "EN"}
    </Link>
  );
};

export default LanguageSelector;
