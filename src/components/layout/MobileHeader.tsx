"use client";
import NavItem from "@/app/[locale]/(root)/components/NavItem";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import LanguageSelector from "../LanguageSelector";
import ThemeToggler from "../ThemeToggler";
import { Button } from "../ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const MobileHeader = ({
  headerLinks,
}: {
  headerLinks: { name: string; url: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const text = useTranslations("header");
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="block xl:hidden"
      >
        {isOpen ? (
          <IoClose className="w-8 h-8" />
        ) : (
          <FaBarsStaggered className="w-8 h-8" />
        )}
      </button>
      <div
        ref={menuRef}
        style={{
          transition: "max-height 0.3s",
        }}
        className={cn(
          "absolute bottom-0 xl:hidden right-0 overflow-hidden w-full translate-y-full shadow-md bg-clear-ground",
          {
            "max-h-0": !isOpen,
            "max-h-[calc(100vh-4rem)]": isOpen,
          }
        )}
      >
        <div className="p-4">
          <nav>
            <ul>
              {headerLinks.map((link) => (
                <NavItem
                  className="gap-2.5 px-2.5 py-2 my-auto hover:text-primary transition-colors w-full block"
                  activeClass="font-semibold text-primary bg-primary/10"
                  key={link.name}
                  href={link.url}
                  name={link.name}
                />
              ))}
            </ul>
          </nav>
          <div className="flex flex-col items-start justify-start gap-4 mt-4 md:hidden">
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <ThemeToggler />
            </div>
            <Button variant={"outline"}>
              <Link href="/sign-in">{text("signIn")}</Link>
            </Button>
            <Button>
              <Link href="/sign-up">{text("startNow")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
