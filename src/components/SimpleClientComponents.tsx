"use client";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { deleteCookie } from "cookies-next";
import { useTranslations } from "next-intl";

export const DropdownMenuLogout = ({ className }: { className?: string }) => {
  const router = useRouter();
  const text = useTranslations("header");
  return (
    <button
      className={cn(className)}
      onClick={() => {
        deleteCookie("user");
        deleteCookie("token");
        router.push("/");
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }}
    >
      {text("logout")}
    </button>
  );
};
