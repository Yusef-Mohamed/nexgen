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
} from "react-icons/hi2";

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

const socialLinks = [
  {
    name: "facebook",
    link: "https://www.facebook.com/profile.php?id=61566778123491",
    icon: <FaFacebookF />,
    ariaLabelKey: "facebookAriaLabel",
  },
  {
    name: "tiktok",
    link: "https://www.tiktok.com/@nexgen.academy0",
    icon: <FaTiktok />,
    ariaLabelKey: "tiktokAriaLabel",
  },
  {
    name: "instagram",
    link: "https://www.instagram.com/Nex.genacademy",
    icon: <FaInstagram />,
    ariaLabelKey: "instagramAriaLabel",
  },
];

const Footer = ({}: { clear?: boolean }) => {
  const text = useTranslations("footer");
  return (
    <footer className="relative mt-12 bg-background-2 border-t border-primary/10">
      {/* Top contact strip */}
      <div className="container -mt-8">
        <div className="relative overflow-hidden rounded-2xl bg-clear-ground border border-primary/15 cardShadowSm px-5 py-5 sm:px-8 sm:py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            aria-hidden
            className="absolute -top-12 -end-12 size-40 rounded-full bg-primary/10 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-12 -start-12 size-40 rounded-full bg-secondary/10 blur-2xl"
          />
          <div className="relative flex items-start sm:items-center gap-3">
            <div className="flex shrink-0 size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <HiOutlineSparkles className="size-5" />
            </div>
            <div>
              <div className="font-bold text-text-1">
                {text("readyToStart")}
              </div>
              <p className="text-sm text-text-3 mt-0.5">
                {text("readyDescription")}
              </p>
            </div>
          </div>
          <div className="relative flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-clear-ground border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
            >
              {text("browseCourses")}
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-b from-[#1b7df5] to-[#10498F] text-clear-ground text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-shadow"
            >
              {text("getStarted")}
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container pt-12 pb-8">
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
                  className="group flex items-center justify-center size-10 rounded-full bg-clear-ground border border-primary/15 text-text-2 hover:text-clear-ground hover:bg-primary hover:border-primary transition-colors"
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
                className="flex items-start gap-3 group"
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
                className="flex items-start gap-3 group"
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

        {/* Trust badges */}
        <div className="mt-10 pt-6 border-t border-primary/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-3">
            <span className="inline-flex items-center gap-1.5">
              <HiOutlineShieldCheck className="size-4 text-green" />
              {text("licensedAccredited")}
            </span>
            <span className="hidden sm:inline-block size-1 rounded-full bg-text-3/40" />
            <span className="inline-flex items-center gap-1.5">
              <HiOutlineGlobeAlt className="size-4 text-primary" />
              {text("availableLanguages")}
            </span>
          </div>
          <div className="text-xs text-text-3">{text("copyRight")}</div>
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
    "text-sm text-text-3 hover:text-primary transition-colors inline-block";
  if (external) {
    return (
      <li>
        <a
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  );
};

export default Footer;
