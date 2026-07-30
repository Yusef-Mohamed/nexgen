"use client";

import { useAuth } from "@/components/auth-provider";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  KeyRound,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";

const Sidebar = () => {
  const text = useTranslations("settings");
  const pathname = usePathname();
  const { user } = useAuth();
  const links = [
    {
      label: "myProfile",
      icon: <UserRound className="size-4" />,
      link: "/dashboard/settings",
    },
    {
      label: "changePassword",
      icon: <KeyRound className="size-4" />,
      link: "/dashboard/settings/change-password",
    },
    {
      label: "identityVerification",
      icon: <BadgeCheck className="size-4" />,
      link: "/dashboard/settings/identity-verification",
    },
  ];

  if (user?.authToReview) {
    links.push({
      label: "systemReview",
      icon: <MessageSquareText className="size-4" />,
      link: "/dashboard/settings/system-review",
    });
  }

  return (
    <aside className="w-full ">
      <nav className="space-y-2 rounded-2xl border border-primary/10 bg-clear-ground p-2 shadow-sm">
        {links.map(({ label, icon, link }) => {
          const isActive = pathname === link;

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-text-3 transition-colors hover:bg-primary/10 hover:text-primary",
                isActive && "bg-primary/10 text-primary",
              )}
              key={label}
              href={link}
            >
              <span
                className={cn(
                  "inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-background-2",
                  isActive && "border-primary/20 bg-primary/15",
                )}
              >
                {icon}
              </span>
              <span className="min-w-0 truncate">{text(label)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
