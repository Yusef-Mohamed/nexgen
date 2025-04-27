"use client";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const SidebarLink: React.FC<{
  link: {
    href: string;
    label: string;
    icon: React.ReactNode;
    target?: string;
    links?: {
      href: string;
      label: string;
      icon: React.ReactNode;
    }[];
  };
  isPinging?: boolean;
}> = ({ link, isPinging }) => {
  const pathname = usePathname();
  const text = useTranslations("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  if (link.links)
    return (
      <div>
        <button
          key={link.href}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex w-full items-center justify-between px-3 hover:text-clear-ground rounded-md py-2 hover:bg-primary transition-all",
            {
              "bg-primary text-clear-ground":
                (link.href !== "/dashboard"
                  ? pathname.startsWith(link.href.split("?")[0])
                  : pathname === link.href) || isOpen,
            }
          )}
        >
          <div className="flex items-center gap-2">
            {link.icon}
            {text(link.label)}
          </div>
          <FaChevronDown
            className={cn("transition-transform w-3 h-3 rotate-90", {
              "transform rotate-0": isOpen,
              "-rotate-90": locale === "en" && !isOpen,
            })}
          />
        </button>
        <div
          style={{
            maxHeight: isOpen ? "1000px" : "0",
          }}
          className="space-y-1 overflow-hidden ps-4 "
        >
          {link.links.map((sublink, ind) => (
            <Link
              key={sublink.href}
              href={sublink.href}
              className={cn(
                "flex w-full items-center gap-2 px-3 rounded-md py-2 transition-all border border-transparent hover:border-primary",
                {
                  "border-r-4 border-primary":
                    pathname === sublink.href.split("?")[0] && locale === "ar",
                  "border-l-4 border-primary":
                    pathname === sublink.href.split("?")[0] && locale === "en",
                  "mt-2": isOpen && ind === 0,
                }
              )}
            >
              {sublink.icon}
              {text(sublink.label)}
            </Link>
          ))}
        </div>
      </div>
    );
  else
    return (
      <Link
        key={link.href}
        href={link.href}
        target={link.target}
        className={cn(
          "flex w-full items-center gap-2 px-3 hover:text-clear-ground rounded-md py-2 hover:bg-primary justify-between transition-all",
          {
            "bg-primary text-clear-ground":
              link.href !== "/dashboard"
                ? pathname.startsWith(link.href.split("?")[0])
                : pathname === link.href,
          }
        )}
      >
        <div className="flex items-center gap-2">
          {link.icon}
          {text(link.label)}
        </div>
        {isPinging && (
          <div className="w-6 h-6 rounded-full bg-primary animate-ping" />
        )}
      </Link>
    );
};

export default SidebarLink;
