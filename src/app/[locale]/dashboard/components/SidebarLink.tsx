"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";

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
  collapsed?: boolean;
}> = ({ link, isPinging, collapsed = false }) => {
  const pathname = usePathname();
  const text = useTranslations("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();

  if (link.links) {
    const isSelected =
      (link.href !== "/dashboard"
        ? pathname.startsWith(link.href.split("?")[0])
        : pathname === link.href) || isOpen;

    return (
      <div>
        <Button
          key={link.href}
          onClick={() => setIsOpen((prev) => !prev)}
          variant={isSelected ? "default" : "hoverToDefault"}
          className={cn(
            "flex w-full items-center justify-between px-3 rounded-md py-2 transition-all",
            {
              "w-12 h-12 !p-0 flex min-w-12 items-center justify-center":
                collapsed,
            }
          )}
          title={collapsed ? text(link.label) : undefined}
        >
          <div
            className={cn("flex items-center gap-2", { "gap-0": collapsed })}
          >
            {link.icon}
            {!collapsed && text(link.label)}
          </div>
          {!collapsed && (
            <FaChevronDown
              className={cn("transition-transform w-3 h-3 rotate-90", {
                "transform rotate-0": isOpen,
                "-rotate-90": locale === "en" && !isOpen,
              })}
            />
          )}
        </Button>
        {collapsed ? (
          <div
            style={{
              maxHeight: isOpen ? "1000px" : "0",
            }}
            className="overflow-hidden"
          >
            {link.links.map((sublink) => (
              <Link
                key={sublink.href}
                href={sublink.href}
                className={cn(
                  "flex w-full items-center gap-2 px-3 rounded-md py-2 transition-all border border-transparent hover:border-primary justify-center"
                )}
              >
                {sublink.icon}
              </Link>
            ))}
          </div>
        ) : (
          <div
            style={{
              maxHeight: isOpen ? "1000px" : "0",
            }}
            className="space-y-1 overflow-hidden ps-4"
          >
            {link.links.map((sublink, ind) => (
              <Link
                key={sublink.href}
                href={sublink.href}
                className={cn(
                  "flex w-full items-center gap-2 px-3 rounded-md py-2 transition-all border border-transparent hover:border-primary",
                  {
                    "border-r-4 border-primary":
                      pathname === sublink.href.split("?")[0] &&
                      locale === "ar",
                    "border-l-4 border-primary":
                      pathname === sublink.href.split("?")[0] &&
                      locale === "en",
                    "mt-2": isOpen && ind === 0,
                  }
                )}
              >
                {sublink.icon}
                {text(sublink.label)}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const isSelected =
    link.href !== "/dashboard"
      ? pathname.startsWith(link.href.split("?")[0])
      : pathname === link.href;

  return (
    <Button
      key={link.href}
      asChild
      variant={isSelected ? "default" : "hoverToDefault"}
      className={cn(
        "flex w-full items-center gap-2 px-3 rounded-md py-2 justify-between transition-all",
        {
          "w-12 h-12 !p-0 flex min-w-12 items-center justify-center": collapsed,
        }
      )}
    >
      <Link href={link.href} target={link.target}>
        <div className={cn("flex items-center gap-2", { "gap-0": collapsed })}>
          {link.icon}
          {!collapsed && text(link.label)}
        </div>
        {!collapsed && isPinging && (
          <div className="w-6 h-6 rounded-full bg-primary animate-ping" />
        )}
      </Link>
    </Button>
  );
};

export default SidebarLink;
