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
import { useEffect, useMemo, useState } from "react";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { IReview } from "@/types";
import { BsChatLeftDots } from "react-icons/bs";

const SidebarFooter: React.FC<{ collapsed?: boolean }> = ({
  collapsed = false,
}) => {
  const { setTheme, theme } = useTheme();
  const { logout, token, user } = useAuth();
  const text = useTranslations("dashboard");
  const pathname = usePathname();
  const locale = useLocale();
  const [systemReviewCreatedAt, setSystemReviewCreatedAt] = useState("");
  useEffect(() => {
    const getCurrentReview = async () => {
      const axiosInstance = createClientAxiosInstance();
      axiosInstance
        .get("/systemReviews/myReviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const thisReview = res.data.data[
            res.data.data?.length - 1
          ] as IReview;
          if (!thisReview) return;
          setSystemReviewCreatedAt(thisReview?.createdAt);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCurrentReview();
  }, [token]);
  const showSystemReview = useMemo(() => {
    if (!systemReviewCreatedAt) return true;
    else {
      // check if created at from day or more return true else return false
      const createdAt = new Date(systemReviewCreatedAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 1) {
        return true;
      } else {
        return false;
      }
    }
  }, [systemReviewCreatedAt]);
  return (
    <div className="space-y-2 ">
      {showSystemReview && user?.authToReview && (
        <SidebarLink
          link={{
            href: "/dashboard/settings/system-review",
            label: "systemReview",
            icon: <BsChatLeftDots />,
          }}
          isPinging
          collapsed={collapsed}
        />
      )}

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
      <button
        onClick={logout}
        className={cn(
          "flex w-full items-center gap-2 px-3 hover:text-clear-ground rounded-md py-2 hover:bg-primary transition-all",
          {
            "justify-center w-10 h-10 p-0 flex items-center": collapsed,
          }
        )}
        title={collapsed ? text("logout") : undefined}
      >
        {locale === "ar" ? <RiLogoutBoxLine /> : <RiLogoutBoxRLine />}
        {!collapsed && text("logout")}
      </button>
      {!collapsed ? (
        <>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
            <button
              onClick={() => {
                setTheme("light");
              }}
              className="flex items-center w-full gap-2 px-3 py-2 rounded-md bg-clear-ground dark:bg-muted"
            >
              <FaSun />
              <span className="text-xs">{text("lightMode")}</span>
            </button>
            <button
              onClick={() => {
                setTheme("dark");
              }}
              className="flex items-center w-full gap-2 px-2 py-2 rounded-md dark:bg-clear-ground"
            >
              <IoMoon />
              <span className="text-xs">{text("darkMode")}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
            <Link
              locale="ar"
              href={pathname}
              className={cn(
                "flex items-center text-xs w-full gap-2 px-3 py-2 rounded-md ",
                {
                  "bg-clear-ground": locale === "ar",
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
                  "bg-clear-ground": locale === "en",
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
            className="flex items-center justify-center size-10 rounded-md hover:bg-primary hover:text-clear-ground transition-all"
            title={theme === "dark" ? text("lightMode") : text("darkMode")}
          >
            {theme === "dark" ? <FaSun /> : <IoMoon />}
          </button>
          <Link
            locale={locale === "ar" ? "en" : "ar"}
            href={pathname}
            className="flex items-center justify-center size-10 rounded-md hover:bg-primary hover:text-clear-ground transition-all text-xs"
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
