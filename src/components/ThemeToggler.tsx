"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const ThemeToggler: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const t = useTranslations("common");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = mounted && (resolvedTheme ?? theme) === "dark";

  return (
    <button
      {...props}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl border border-primary/10 bg-clear-ground text-text-3 shadow-none transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary",
        className,
      )}
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
      }}
      aria-label={isDark ? t("switchToLightMode") : t("switchToDarkMode")}
      title={isDark ? t("switchToLightMode") : t("switchToDarkMode")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
};

export default ThemeToggler;
