"use client";

import { useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { reqAuthToReview } from "@/constants";
import Logo from "@/components/logo";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  FileText,
  FolderOpen,
  Home,
  Languages,
  Menu,
  MessageCircle,
  Moon,
  Settings,
  Sun,
  Tags,
  Users,
  Video,
  WalletCards,
} from "lucide-react";

type SidebarLinkType = {
  href: string;
  label: string;
  icon: React.ReactNode;
  links?: SidebarLinkType[];
};

type LinkGroup = {
  title: string | null;
  links: SidebarLinkType[];
};

const Sidebar: React.FC<
  React.HTMLAttributes<HTMLElement> & {
    collapsed?: boolean;
    onToggle?: () => void;
    isCollapsable?: boolean;
  }
> = ({
  className,
  collapsed = false,
  onToggle,
  isCollapsable = false,
  style,
  ...props
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const locale = useLocale();
  const text = useTranslations("dashboard");
  const logoText = useTranslations("logo");
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const linkGroups = useMemo<LinkGroup[]>(() => {
    let groups: LinkGroup[] = [
      {
        title: null,
        links: [
          {
            href: "/dashboard",
            label: "home",
            icon: <Home className="size-5" />,
          },
          {
            href: "/dashboard/blogs",
            label: "blogs",
            icon: <FileText className="size-5" />,
          },
        ],
      },
      {
        title: "community",
        links: [
          {
            href: "/dashboard/community?sharedTo=students",
            label: "community",
            icon: <Users className="size-5" />,
          },
          {
            href: "/dashboard/chat",
            label: "chat",
            icon: <MessageCircle className="size-5" />,
          },
        ],
      },
      {
        title: "learn",
        links: [
          {
            href: "/dashboard/lives",
            label: "lives",
            icon: <Video className="size-5" />,
          },
          {
            href: "/dashboard/analytics",
            label: "analytics",
            icon: <BarChart3 className="size-5" />,
          },
          {
            href: "/dashboard/learn",
            label: "learn",
            icon: <BookOpen className="size-5" />,
          },
          {
            href: "/dashboard/practice",
            label: "practice",
            icon: <FolderOpen className="size-5" />,
          },
        ],
      },
      {
        title: "marketing",
        links: [
          {
            href: "/dashboard/marketing/sales-analytics",
            label: "marketing",
            icon: <Award className="size-5" />,
            links: [
              {
                href: "/dashboard/marketing/sales-analytics",
                label: "salesAnalytics",
                icon: <BarChart3 className="size-4" />,
              },
              {
                href: "/dashboard/marketing/my-team",
                label: "myTeam",
                icon: <Users className="size-4" />,
              },
              {
                href: "/dashboard/marketing/invoices",
                label: "invoices",
                icon: <WalletCards className="size-4" />,
              },
              {
                href: "/dashboard/marketing/coupons",
                label: "coupons",
                icon: <Tags className="size-4" />,
              },
            ],
          },
        ],
      },
      {
        title: null,
        links: [
          {
            href:
              mounted && user?._id
                ? "/dashboard/community/profile/" + user._id
                : "/dashboard/settings",
            label: "profile",
            icon: <Users className="size-5" />,
          },
          {
            href: "/dashboard/settings",
            label: "settings",
            icon: <Settings className="size-5" />,
          },
        ],
      },
    ];

    if (mounted && user && !user.authToReview) {
      groups = groups
        .map((group) => ({
          ...group,
          links: group.links.filter(
            (link) => !reqAuthToReview?.includes(link.label),
          ),
        }))
        .filter((group) => group.links.length > 0);
    }

    if (mounted && user && !user.isMarketer && !user.isAffiliateMarketer) {
      groups = groups
        .map((group) => ({
          ...group,
          links: group.links.filter((link) => link.label !== "marketing"),
        }))
        .filter((group) => group.links.length > 0);
    }

    if (pathname.includes("instructor-dashboard")) {
      groups = [
        {
          title: null,
          links: [
            {
              href: "/instructor-dashboard/courses",
              label: "myCourses",
              icon: <BookOpen className="size-5" />,
            },
            {
              href: "/instructor-dashboard/lives",
              label: "lives",
              icon: <Video className="size-5" />,
            },
            {
              href: "/instructor-dashboard/blogs",
              label: "blogs",
              icon: <FileText className="size-5" />,
            },
            {
              href: "/instructor-dashboard/wallet",
              label: "marketing",
              icon: <Award className="size-5" />,
              links: [
                {
                  href: "/instructor-dashboard/wallet",
                  label: "wallet",
                  icon: <WalletCards className="size-4" />,
                },
                {
                  href: "/instructor-dashboard/my-team",
                  label: "myTeam",
                  icon: <Users className="size-4" />,
                },
                {
                  href: "/instructor-dashboard/coupons",
                  label: "coupons",
                  icon: <Tags className="size-4" />,
                },
              ],
            },
          ],
        },
        {
          title: "community",
          links: [
            {
              href: "/instructor-dashboard/community?sharedTo=students",
              label: "community",
              icon: <Users className="size-5" />,
            },
            {
              href: "/instructor-dashboard/chat",
              label: "chat",
              icon: <MessageCircle className="size-5" />,
            },
            {
              href: "/instructor-dashboard/practice",
              label: "practice",
              icon: <FolderOpen className="size-5" />,
            },
          ],
        },
      ];
    }

    return groups;
  }, [mounted, pathname, user]);

  return (
    <aside
      {...props}
      style={{
        ...style,
        ...(isCollapsable ? { width: collapsed ? 76 : 292 } : {}),
      }}
      className={cn(
        "sticky top-0 flex h-screen max-h-screen flex-col border-e border-primary/10 bg-clear-ground transition-all duration-300",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex h-[76px] shrink-0 items-center border-b border-primary/10",
          {
            "px-3": collapsed,
            "px-4": !collapsed,
            "justify-center": collapsed,
            "justify-between gap-3": !collapsed,
          },
        )}
      >
        {collapsed && isCollapsable ? (
          <button
            aria-label={text("toggleSidebar")}
            className="inline-flex size-12 items-center justify-center rounded-2xl  transition-colors hover:bg-primary/10"
            onClick={onToggle}
            title={text("toggleSidebar")}
            type="button"
          >
            <Image
              src="/logos/logo.svg"
              alt={logoText("alt")}
              width={40}
              height={40}
              className="size-10 object-contain"
            />
          </button>
        ) : (
          <Logo size="sm" className="min-w-0" />
        )}
        {isCollapsable && !collapsed && (
          <button
            aria-label={text("toggleSidebar")}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-background-2 text-text-3 transition-colors hover:border-primary/30 hover:text-primary"
            onClick={onToggle}
            type="button"
          >
            <Menu className="size-5" />
          </button>
        )}
      </div>

      <nav
        className={cn("flex-1 overflow-auto py-5", collapsed ? "px-3" : "px-4")}
      >
        <ul className="flex flex-col gap-4">
          {linkGroups.map((group, groupIndex) => (
            <li className="flex flex-col gap-2" key={groupIndex}>
              {group.title && !collapsed && (
                <div className="px-4 text-[11px] font-bold uppercase tracking-wide text-text-3">
                  {text(group.title)}
                </div>
              )}
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <SidebarNavLink
                    collapsed={collapsed}
                    key={`${link.label}:${link.href}`}
                    link={link}
                  />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <SidebarControls
        collapsed={collapsed}
        locale={locale}
        mounted={mounted}
        pathname={pathname}
        setTheme={setTheme}
        text={text}
        theme={theme}
      />
    </aside>
  );
};

const SidebarControls: React.FC<{
  collapsed: boolean;
  locale: string;
  mounted: boolean;
  pathname: string;
  setTheme: (theme: string) => void;
  text: (key: "lightMode" | "darkMode") => string;
  theme?: string;
}> = ({ collapsed, locale, mounted, pathname, setTheme, text, theme }) => {
  const isDark = mounted && theme === "dark";

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 border-t border-primary/10 px-3 py-5">
        <button
          className="inline-flex size-11 items-center justify-center rounded-xl border border-primary/10 bg-background-2 text-text-3 transition-colors hover:border-primary/30 hover:text-primary"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          title={isDark ? text("lightMode") : text("darkMode")}
          type="button"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <Link
          className="inline-flex size-11 items-center justify-center rounded-xl border border-primary/10 bg-background-2 text-xs font-bold text-text-3 transition-colors hover:border-primary/30 hover:text-primary"
          href={pathname}
          locale={locale === "ar" ? "en" : "ar"}
          title={locale === "ar" ? "English" : "العربية"}
        >
          <Languages className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-t border-primary/10 px-4 py-5">
      <div className="rounded-2xl border border-primary/10 bg-background-2 p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-bold text-text-3 transition-colors hover:text-primary",
              !isDark && "bg-clear-ground text-primary shadow-sm",
            )}
            onClick={() => setTheme("light")}
            type="button"
          >
            <Sun className="size-4" />
            {text("lightMode")}
          </button>
          <button
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-bold text-text-3 transition-colors hover:text-primary",
              isDark && "bg-clear-ground text-primary shadow-sm",
            )}
            onClick={() => setTheme("dark")}
            type="button"
          >
            <Moon className="size-4" />
            {text("darkMode")}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-background-2 p-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            className={cn(
              "flex h-10 items-center justify-center rounded-xl text-xs font-bold text-text-3 transition-colors hover:text-primary",
              locale === "ar" && "bg-clear-ground text-primary shadow-sm",
            )}
            href={pathname}
            locale="ar"
          >
            العربية
          </Link>
          <Link
            className={cn(
              "flex h-10 items-center justify-center rounded-xl text-xs font-bold text-text-3 transition-colors hover:text-primary",
              locale === "en" && "bg-clear-ground text-primary shadow-sm",
            )}
            href={pathname}
            locale="en"
          >
            English
          </Link>
        </div>
      </div>
    </div>
  );
};

const SidebarNavLink: React.FC<{
  link: SidebarLinkType;
  collapsed: boolean;
}> = ({ link, collapsed }) => {
  const pathname = usePathname();
  const text = useTranslations("dashboard");
  const itemPath = link.href.split("?")[0];
  const isActive =
    itemPath === "/dashboard"
      ? pathname === itemPath
      : pathname.startsWith(itemPath);

  if (collapsed && link.links) {
    return (
      <li className="flex flex-col items-center gap-1.5">
        <Link
          className={cn(
            "group flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold text-text-3 transition-all duration-300 hover:bg-primary/10 hover:text-primary",
            isActive && "bg-primary/10 text-primary shadow-sm",
          )}
          href={link.href}
          title={text(link.label)}
        >
          <span className="shrink-0">{link.icon}</span>
        </Link>
        <ul className="flex w-full flex-col items-center gap-1 rounded-2xl border border-primary/10 bg-background-2/60 p-1">
          {link.links.map((sublink) => {
            const subPath = sublink.href.split("?")[0];
            const isSubActive = pathname.startsWith(subPath);

            return (
              <li className="w-full" key={sublink.href}>
                <Link
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-xl text-text-3 transition-colors hover:bg-primary/10 hover:text-primary",
                    isSubActive && "bg-primary/10 text-primary",
                  )}
                  href={sublink.href}
                  title={text(sublink.label)}
                >
                  <span className="shrink-0">{sublink.icon}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <Link
        className={cn(
          "group flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold text-text-3 transition-all duration-300 hover:bg-primary/10 hover:text-primary",
          {
            "justify-center px-0": collapsed,
            "bg-primary/10 text-primary shadow-sm": isActive,
          },
        )}
        href={link.href}
        title={collapsed ? text(link.label) : undefined}
      >
        <span className="shrink-0">{link.icon}</span>
        {!collapsed && <span className="truncate">{text(link.label)}</span>}
        {!collapsed && link.links && (
          <ChevronDown className="ms-auto size-4 text-text-3" />
        )}
      </Link>
      {!collapsed && link.links && (
        <ul className="mt-2 flex flex-col gap-1 ps-8">
          {link.links.map((sublink) => {
            const subPath = sublink.href.split("?")[0];
            const isSubActive = pathname.startsWith(subPath);

            return (
              <li key={sublink.href}>
                <Link
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-text-3 transition-colors hover:bg-primary/10 hover:text-primary",
                    isSubActive && "bg-primary/10 text-primary",
                  )}
                  href={sublink.href}
                >
                  <span className="shrink-0">{sublink.icon}</span>
                  <span className="truncate">{text(sublink.label)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;
