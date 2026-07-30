"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import React from "react";

const LanguageSelector: React.FC<{ className?: string }> = ({ className }) => {
  const locale = useLocale();
  const pathname = usePathname();
  const targetLocale = locale === "en" ? "ar" : "en";
  const targetLabel = targetLocale === "ar" ? "\u0639" : "EN";

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl border border-primary/10 bg-clear-ground text-text-3 shadow-none transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary",
        className,
      )}
      aria-label={
        targetLocale === "ar" ? "Switch to Arabic" : "Switch to English"
      }
      title={targetLocale === "ar" ? "Switch to Arabic" : "Switch to English"}
    >
      <span className="text-xs font-bold leading-none">{targetLabel}</span>
    </Link>
  );
};

export default LanguageSelector;
