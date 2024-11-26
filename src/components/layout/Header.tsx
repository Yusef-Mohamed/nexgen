import React from "react";
import LanguageSelector from "../LanguageSelector";
import NavItem from "../../app/[locale]/(root)/components/NavItem";
import { Button } from "../ui/button";
import Logo from "../logo";
import ThemeToggler from "../ThemeToggler";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import MobileHeader from "./MobileHeader";
import { getServerCookie } from "@/app/lib/serverUtils";
import UserHeader from "./UserHeader";
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
  const token = getServerCookie("token");
  return (
    <header className="sticky top-0 z-50 w-full py-1 shadow-md md:py-2 bg-clear-ground">
      <div className="container flex items-center justify-between gap-10">
        <nav className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <MobileHeader headerLinks={headerLinks} />
            <Logo />
          </div>
          <ul className="items-center hidden gap-3 whitespace-nowrap xl:flex ">
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
        <div className="items-center hidden gap-2 lg:gap-3 md:flex ">
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
