"use client";
import NavItem from "@/app/[locale]/(root)/components/NavItem";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import LanguageSelector from "../LanguageSelector";
import ThemeToggler from "../ThemeToggler";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "../auth-provider";

const MobileHeader = ({
  headerLinks,
}: {
  headerLinks: { name: string; url: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const text = useTranslations("header");
  const { token, logout, user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const canRenderAuth = isMounted && !!token;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={toggleRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={text("toggleMenu")}
        aria-expanded={isOpen}
        className="xl:hidden flex items-center justify-center size-10 rounded-xl bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors"
      >
        {isOpen ? (
          <IoClose className="size-5" />
        ) : (
          <FaBarsStaggered className="size-5" />
        )}
      </button>

      <div
        ref={menuRef}
        className={cn(
          "xl:hidden absolute top-full inset-x-0 z-50 origin-top transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="container">
          <div className="mx-auto bg-clear-ground border border-primary/10 rounded-2xl shadow-xl shadow-foreground/10 overflow-hidden">
            <nav className="p-3">
              <ul className="space-y-1">
                {headerLinks.map((link) => (
                  <NavItem
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-text-2 hover:text-primary hover:bg-primary/5 transition-colors"
                    activeClass="!text-primary !bg-primary/10 font-semibold"
                    key={link.name}
                    href={link.url}
                    name={link.name}
                  />
                ))}
              </ul>
            </nav>

            <div className="border-t border-primary/10 p-4 flex flex-col gap-3 md:hidden">
              <div
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <LanguageSelector />
                <ThemeToggler />
              </div>
              {canRenderAuth ? (
                <div className="flex flex-col gap-2">
                  {user?.isInstructor && (
                    <Button
                      onClick={() => setIsOpen(false)}
                      asChild
                      className="w-full"
                    >
                      <Link href="/instructor-dashboard/courses">
                        {text("instructorDashboard")}
                      </Link>
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsOpen(false)}
                    asChild
                    className="w-full"
                  >
                    <Link href="/dashboard">{text("dashboard")}</Link>
                  </Button>
                  <Button
                    variant={"outline"}
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                  >
                    {text("logout")}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant={"outline"}
                  >
                    <Link href="/sign-in">{text("signIn")}</Link>
                  </Button>
                  <Button onClick={() => setIsOpen(false)} asChild>
                    <Link href="/sign-up">{text("startNow")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
