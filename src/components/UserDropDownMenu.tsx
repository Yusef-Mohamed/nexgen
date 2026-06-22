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

const UserDropDownMenu = () => {
  const { user, logout } = useAuth();
  const text = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const headerAvatarStyle = { borderRadius: "10px" };

  return (
    <DropdownMenu
      dir={locale === "ar" ? "rtl" : "ltr"}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger asChild>
        <button
          aria-label={user?.name ? `${user.name} menu` : "User menu"}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/10 bg-clear-ground p-1 text-text-2 shadow-none transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          title={user?.name || "User menu"}
          type="button"
        >
          <UserAvatar
            className="h-8 w-8 !rounded-[10px]"
            user={user || undefined}
            innerClassName="!rounded-[10px] text-[11px]"
            style={headerAvatarStyle}
            innerStyle={headerAvatarStyle}
          />
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
