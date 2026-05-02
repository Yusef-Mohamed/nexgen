"use client";
import React, { useEffect, useState } from "react";
import LanguageSelector from "../LanguageSelector";
import NavItem from "../../app/[locale]/(root)/components/NavItem";
import { Button } from "../ui/button";
import Logo from "../logo";
import ThemeToggler from "../ThemeToggler";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import MobileHeader from "./MobileHeader";
import UserHeader from "./UserHeader";
import { useAuth } from "../auth-provider";
import { cn } from "@/lib/utils";

const headerLinks = [
  { name: "home", url: "/" },
  { name: "about", url: "/about" },
  { name: "courses", url: "/courses" },
  { name: "contact", url: "/contact" },
  { name: "blogs", url: "/blogs" },
];

const Header = () => {
  const text = useTranslations("header");
  const { token } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.12)]"
          : "bg-background border-b border-transparent"
      )}
    >
      <div
        className={cn(
          "container flex gap-6 lg:gap-10 justify-between items-center transition-[padding] duration-300",
          scrolled ? "py-2" : "py-2.5 md:py-3"
        )}
      >
        <nav className="flex gap-8 items-center min-w-0">
          <div className="flex gap-3 items-center min-w-0">
            <MobileHeader headerLinks={headerLinks} />
            <Logo />
            {token && (
              <Button size={"sm"} className="lg:hidden" asChild>
                <Link href="/dashboard">{text("dashboard")}</Link>
              </Button>
            )}
          </div>
          <ul className="hidden gap-1 items-center whitespace-nowrap xl:flex">
            {headerLinks.map((link) => (
              <NavItem
                className="relative px-3.5 py-2 rounded-full text-sm font-medium text-text-2 hover:text-primary hover:bg-primary/5 transition-colors"
                activeClass="!text-primary !bg-primary/10 font-semibold"
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
              <Button asChild variant={"outline"} size="sm">
                <Link href="/sign-in">{text("signIn")}</Link>
              </Button>
              <Button asChild size="sm" className="shadow-md shadow-primary/20">
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
