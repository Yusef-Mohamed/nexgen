"use client";
import { useTranslations } from "next-intl";
import React from "react";
import Logo from "../logo";
import { FaFacebookF, FaTelegramPlane, FaTiktok } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { Link } from "@/i18n/navigation";
import { FaInstagram } from "react-icons/fa";
import {
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineArrowUp,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";

const learnLinks = [
  { name: "courses", link: "/courses" },
  { name: "blogs", link: "/blogs" },
];

const companyLinks = [
  { name: "about", link: "/about" },
  { name: "contact", link: "/contact" },
];

const supportLinks = [
  { name: "whatsapp", link: "https://wa.me/+972593442082" },
  { name: "telegram", link: "https://t.me/nexgensupport" },
];

const legalLinks = [
  { name: "termsAndConditions", link: "/terms-of-services" },
  { name: "privacyPolicy", link: "/privacy-policy" },
  { name: "returnAndRefundPolicy", link: "/return-and-refund-policy" },
  { name: "communityGuidelines", link: "/community-guidelines" },
  { name: "deleteAccount", link: "/account-deletion" },
];
const socialLinks = [
  {
    name: "facebook",
    link: "https://www.facebook.com/profile.php?id=61566778123491",
    icon: <FaFacebookF />,
    ariaLabelKey: "facebookAriaLabel",
    hoverClass: "hover:bg-[#1877F2] hover:border-[#1877F2]",
  },
  {
    name: "tiktok",
    link: "https://www.tiktok.com/@nexgen.academy0",
    icon: <FaTiktok />,
    ariaLabelKey: "tiktokAriaLabel",
    hoverClass: "hover:bg-foreground hover:border-foreground",
  },
  {
    name: "instagram",
    link: "https://www.instagram.com/Nex.genacademy",
    icon: <FaInstagram />,
    ariaLabelKey: "instagramAriaLabel",
    hoverClass:
      "hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-transparent",
  },
];

const Footer = ({}: { clear?: boolean }) => {
  const text = useTranslations("footer");

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative mt-12 bg-background-2 border-t border-primary/10 overflow-hidden">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 start-1/4 size-72 rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 end-1/4 size-72 rounded-full bg-secondary/10 blur-[120px]"
      />

      {/* Main grid */}
      <div className="container relative pt-12 pb-8">
        <div className="grid gap-10 md:gap-8 grid-cols-2 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Logo className="text-text-1" size="sm" />
            <p className="mt-4 text-sm text-text-3 leading-relaxed max-w-xs">
              {text("description")}
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socialLinks.map((platform, index) => (
                <a
                  key={index}
                  href={platform.link}
                  aria-label={text(platform.ariaLabelKey)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center justify-center size-10 rounded-full bg-clear-ground border border-primary/15 text-text-2 hover:text-clear-ground transition-all hover:-translate-y-0.5 hover:shadow-md",
                    platform.hoverClass,
                  )}
                >
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <FooterColumn title={text("learn")}>
            {learnLinks.map((l) => (
              <FooterLink key={l.name} href={l.link}>
                {text(l.name)}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Company */}
          <FooterColumn title={text("about")}>
            {companyLinks.map((l) => (
              <FooterLink key={l.name} href={l.link}>
                {text(l.name)}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Support */}
          <FooterColumn title={text("support")}>
            {supportLinks.map((l) => (
              <FooterLink key={l.name} href={l.link} external>
                {text(l.name)}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Contact */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-sm font-bold text-text-1 uppercase tracking-wider">
              {text("contact")}
            </h3>
            <div className="mt-4 space-y-3">
              <a
                href="https://t.me/nexgensupport"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-2 -mx-2 rounded-lg group hover:bg-primary/5 transition-colors"
              >
                <span className="flex shrink-0 size-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-clear-ground transition-colors">
                  <FaTelegramPlane className="size-4" />
                </span>
                <span className="text-xs">
                  <span className="block text-text-3">
                    {text("haveAQuestion")}
                  </span>
                  <span className="block font-semibold text-text-1 group-hover:text-primary transition-colors">
                    {text("telegramSupport")}
                  </span>
                </span>
              </a>
              <a
                href="mailto:nexgensupprot@gmail.com"
                className="flex items-start gap-3 p-2 -mx-2 rounded-lg group hover:bg-primary/5 transition-colors"
              >
                <span className="flex shrink-0 size-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-clear-ground transition-colors">
                  <MdOutlineMail className="size-4" />
                </span>
                <span className="text-xs">
                  <span className="block text-text-3">{text("contactUs")}</span>
                  <span className="block font-semibold text-text-1 group-hover:text-primary transition-colors break-all">
                    {text("contactEmail")}
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <nav
          aria-label={text("legalAndPolicies")}
          className="mt-10 pt-6 border-t border-primary/10"
        >
          <h3 className="text-sm font-bold text-text-1 uppercase tracking-wider">
            {text("legalAndPolicies")}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {legalLinks.map((link) => (
              <FooterLink key={link.name} href={link.link}>
                {text(link.name)}
              </FooterLink>
            ))}
          </ul>
        </nav>
        {/* Trust badges + bottom row */}
        <div className="mt-10 pt-6 border-t border-primary/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-clear-ground border border-primary/10">
              <HiOutlineShieldCheck className="size-4 text-green" />
              <span className="font-medium">{text("licensedAccredited")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-clear-ground border border-primary/10">
              <HiOutlineGlobeAlt className="size-4 text-primary" />
              <span className="font-medium">{text("availableLanguages")}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-3">{text("copyRight")}</span>
            <button
              onClick={scrollToTop}
              aria-label={text("backToTop")}
              className="inline-flex items-center justify-center size-9 rounded-full bg-clear-ground border border-primary/15 text-primary hover:bg-primary hover:text-clear-ground hover:border-primary transition-colors"
            >
              <HiOutlineArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="col-span-1 md:col-span-2">
    <h3 className="text-sm font-bold text-text-1 uppercase tracking-wider">
      {title}
    </h3>
    <ul className="mt-4 space-y-2.5">{children}</ul>
  </div>
);

const FooterLink: React.FC<{
  href: string;
  external?: boolean;
  children: React.ReactNode;
}> = ({ href, external, children }) => {
  const className =
    "group inline-flex items-center gap-1.5 text-sm text-text-3 hover:text-primary transition-colors";
  const content = (
    <>
      <span className="size-1 rounded-full bg-primary/30 group-hover:bg-primary group-hover:scale-125 transition-all" />
      <span>{children}</span>
    </>
  );
  if (external) {
    return (
      <li>
        <a
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={className}>
        {content}
      </Link>
    </li>
  );
};

export default Footer;
