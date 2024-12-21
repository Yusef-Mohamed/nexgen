"use client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useAuth } from "./auth-provider";

export const DropdownMenuLogout = ({ className }: { className?: string }) => {
  const text = useTranslations("header");
  const { logout } = useAuth();
  return (
    <button className={cn(className)} onClick={logout}>
      {text("logout")}
    </button>
  );
};
