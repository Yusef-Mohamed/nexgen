"use client";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const SidebarLink: React.FC<{
  link: {
    href: string;
    label: string;
    icon: React.ReactNode;
    target?: string;
  };
}> = ({ link }) => {
  const pathname = usePathname();
  const text = useTranslations("dashboard");
  return (
    <Link
      key={link.href}
      href={link.href}
      target={link.target}
      className={cn(
        "flex w-full items-center gap-2 px-3 hover:text-clear-ground rounded-md py-2 hover:bg-primary transition-all",
        {
          "bg-primary text-clear-ground": pathname === link.href,
        }
      )}
    >
      {link.icon}
      {text(link.label)}
    </Link>
  );
};

export default SidebarLink;
