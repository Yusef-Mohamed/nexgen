"use client";
import UserAvatar from "./UserAvatar";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useAuth } from "./auth-provider";
import { ChevronDown } from "lucide-react";

const UserDropDownMenu = () => {
  const { user, logout } = useAuth();
  const text = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  return (
    <DropdownMenu
      dir={locale === "ar" ? "rtl" : "ltr"}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-10 items-center gap-2 rounded-xl border border-primary/10 bg-clear-ground py-1 ps-1 pe-2 text-text-2 shadow-none transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          type="button"
        >
          <UserAvatar
            className="h-8 w-8"
            user={user || undefined}
            innerClassName="text-[11px]"
          />
          <span className="hidden max-w-36 truncate text-xs font-bold xl:block">
            {user?.name}
          </span>
          <ChevronDown className="hidden size-4 text-text-3 sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl border-primary/10 p-2 shadow-xl shadow-text-1/10"
      >
        <DropdownMenuItem>
          <Link href="/dashboard" className="block w-full">
            {text("dashboard")}
          </Link>
        </DropdownMenuItem>
        {user?.isInstructor && (
          <DropdownMenuItem>
            <Link href="/instructor-dashboard/courses" className="block w-full">
              {text("instructorDashboard")}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={logout}>{text("logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDownMenu;
