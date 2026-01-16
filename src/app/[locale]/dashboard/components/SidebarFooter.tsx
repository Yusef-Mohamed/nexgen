"use client";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { FaSun } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";
import SidebarLink from "./SidebarLink";
// import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutBoxLine, RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

const SidebarFooter: React.FC<{ collapsed?: boolean }> = ({
  collapsed = false,
}) => {
  const { setTheme, theme } = useTheme();
  const { logout } = useAuth();
  const text = useTranslations("dashboard");
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="space-y-2 ">
      <SidebarLink
        link={{
          href: "/dashboard/settings",
          label: "settings",
          icon: <IoMdSettings />,
        }}
        collapsed={collapsed}
      />
      {/* <SidebarLink
        link={{
          href: "/dashboard/notifications",
          label: "notifications",
          icon: <IoIosNotifications />,
        }}
      /> */}
      <Button
        onClick={logout}
        variant="hoverToDefault"
        className={cn(
          "flex w-full items-center gap-2 justify-start px-3 rounded-md py-2 transition-all"
        )}
      >
        {locale === "ar" ? <RiLogoutBoxLine /> : <RiLogoutBoxRLine />}
        {!collapsed && text("logout")}
      </Button>
      {!collapsed ? (
        <>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background">
            <button
              onClick={() => {
                setTheme("light");
              }}
              className="flex items-center w-full gap-2 px-3 py-2 rounded-md bg-primary/20 dark:bg-background"
            >
              <FaSun />
              <span className="text-xs">{text("lightMode")}</span>
            </button>
            <button
              onClick={() => {
                setTheme("dark");
              }}
              className="flex items-center w-full gap-2 px-2 py-2 rounded-md dark:bg-primary/20"
            >
              <IoMoon />
              <span className="text-xs">{text("darkMode")}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background">
            <Link
              locale="ar"
              href={pathname}
              className={cn(
                "flex items-center text-xs w-full gap-2 px-3 py-2 rounded-md ",
                {
                  "bg-primary/20": locale === "ar",
                }
              )}
            >
              العربية
            </Link>
            <Link
              locale="en"
              href={pathname}
              className={cn(
                "flex items-center text-xs w-full gap-2 px-3 py-2 rounded-md ",
                {
                  "bg-primary/20": locale === "en",
                }
              )}
            >
              English
            </Link>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center size-10 rounded-md hover:bg-primary hover:text-primary/20 transition-all"
            title={theme === "dark" ? text("lightMode") : text("darkMode")}
          >
            {theme === "dark" ? <FaSun /> : <IoMoon />}
          </button>
          <Link
            locale={locale === "ar" ? "en" : "ar"}
            href={pathname}
            className="flex items-center justify-center size-10 rounded-md hover:bg-primary hover:text-primary/20 transition-all text-xs"
            title={
              locale === "ar" ? "Switch to English" : "التبديل إلى العربية"
            }
          >
            {locale === "ar" ? "E" : "ع"}
          </Link>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
