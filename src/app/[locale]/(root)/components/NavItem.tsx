"use client";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React from "react";

type NavItemProps = {
  name: string;
  href: string;
  className: string;
  activeClass: string;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({
  name,
  href,
  className,
  activeClass,
  onClick = () => {},
}) => {
  const text = useTranslations("header");
  const pathname = usePathname();
  return (
    <li onClick={onClick}>
      <Link
        className={cn(className, {
          [activeClass]: pathname === href,
        })}
        href={href}
      >
        {text(name)}
      </Link>
    </li>
  );
};

export default NavItem;
