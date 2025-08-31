"use client";
import UserAvatar from "./UserAvatar";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useAuth } from "./auth-provider";

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
      <DropdownMenuTrigger
        className="rounded-full"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <UserAvatar
          className="h-[2.5rem] w-[2.5rem]"
          user={user || undefined}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/dashboard" className="block w-full">
            {text("dashboard")}
          </Link>
        </DropdownMenuItem>
        {user?.isInstructor && (
          <DropdownMenuItem>
            <Link href="/instructor-dashboard" className="block w-full">
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
