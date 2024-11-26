"use client";
import { IUser } from "@/types";
import UserAvatar from "./UserAvatar";
import { useLocale, useTranslations } from "next-intl";
import { getClientCookie } from "@/app/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useRouter } from "@/i18n/routing";
import { deleteCookie } from "cookies-next";
import { useState } from "react";

const UserDropDownMenu = () => {
  const user = getClientCookie("user", true) as IUser;
  const text = useTranslations("header");
  const router = useRouter();
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
        <UserAvatar className="h-[2.5rem] w-[2.5rem]" user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/dashboard" className="block w-full">
            {text("dashboard")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            deleteCookie("user");
            deleteCookie("token");
            router.refresh();
            router.push("/");
          }}
        >
          {text("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDownMenu;
