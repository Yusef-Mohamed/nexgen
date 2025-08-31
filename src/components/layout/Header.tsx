"use client";
import React from "react";
import LanguageSelector from "../LanguageSelector";
import NavItem from "../../app/[locale]/(root)/components/NavItem";
import { Button } from "../ui/button";
import Logo from "../logo";
import ThemeToggler from "../ThemeToggler";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import MobileHeader from "./MobileHeader";
import UserHeader from "./UserHeader";
import { useAuth } from "../auth-provider";
const headerLinks = [
  {
    name: "home",
    url: "/",
  },
  {
    name: "about",
    url: "/about",
  },
  {
    name: "courses",
    url: "/courses",
  },
  {
    name: "contact",
    url: "/contact",
  },
  {
    name: "blogs",
    url: "/blogs",
  },
];
const Header = () => {
  const text = useTranslations("header");
  const { token } = useAuth();
  return (
    <header className="sticky top-0 z-50 py-1 w-full shadow-md md:py-2 bg-clear-ground">
      <div className="container flex gap-10 justify-between items-center">
        <nav className="flex gap-10 items-center">
          <div className="flex gap-4 items-center">
            <MobileHeader headerLinks={headerLinks} />
            <Logo />
            {token && (
              <Button size={"sm"} className="lg:hidden" asChild>
                <Link href="/dashboard">{text("dashboard")}</Link>
              </Button>
            )}
          </div>
          <ul className="hidden gap-3 items-center whitespace-nowrap xl:flex">
            {headerLinks.map((link) => (
              <NavItem
                className="gap-2.5 self-stretch px-2.5 py-2 my-auto hover:text-primary transition-colors"
                activeClass="font-semibold text-primary border-primary border-b-[3px]"
                key={link.name}
                href={link.url}
                name={link.name}
              />
            ))}
          </ul>
        </nav>
        <div className="hidden gap-2 items-center lg:gap-3 md:flex">
          {token && (
            <Button size={"sm"} asChild>
              <Link href="/dashboard">{text("dashboard")}</Link>
            </Button>
          )}
          <LanguageSelector />
          <ThemeToggler />
          {token ? (
            <UserHeader />
          ) : (
            <>
              {" "}
              <Button asChild variant={"outline"}>
                <Link href="/sign-in">{text("signIn")}</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">{text("startNow")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
