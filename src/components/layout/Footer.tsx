import { useTranslations } from "next-intl";
import React from "react";
import Logo from "../logo";
import { FaFacebookF, FaTelegramPlane, FaTiktok } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { Link } from "@/i18n/routing";
import { FaInstagram } from "react-icons/fa";
const aboutLinks = [
  {
    name: "about",
    link: "/about",
  },
  {
    name: "blogs",
    link: "/blogs",
  },
  {
    name: "courses",
    link: "/courses",
  },
];
const supportLinks = [
  {
    name: "contact",
    link: "/contact",
  },
  {
    name: "whatsapp",
    link: "https://wa.me/+972593442082",
  },
  {
    name: "telegram",
    link: "https://t.me/nexgensupport",
  },
];
const socialLinks = [
  {
    name: "facebook",
    link: "https://www.facebook.com/profile.php?id=61566778123491",
    icon: <FaFacebookF />,
  },
  {
    name: "tiktok",
    link: "https://www.tiktok.com/@nexgen.academy0",
    icon: <FaTiktok />,
  },
  {
    name: "instagram",
    link: "https://www.instagram.com/Nex.genacademy",
    icon: <FaInstagram />,
  },
];
const Footer: React.FC = () => {
  const text = useTranslations("footer");
  return (
    <footer className="bg-muted/50">
      <div className="container pt-8 pb-4 text-text-3">
        <div className="flex flex-col justify-between gap-6 sm:gap-10 lg:flex-row">
          <div className="flex items-start gap-4 sm:gap-8 md:gap-10 lg:gap-14 justify-evenly lg:w-fit">
            <Logo className="text-text-1" size="sm" />
            <div className="mt-4 sm:mt-6">
              <h3 className="h4 text-text-1">{text("about")}</h3>
              <ul className="mt-4 text-xs sm:text-sm sm:mt-6 md::text-base text-text-3">
                {aboutLinks.map((link, index) => (
                  <li key={index} className="mt-2 sm:mt-4">
                    <Link href={link.link}>{text(link.name)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 sm:mt-6">
              <h3 className="h4 text-text-1">{text("support")}</h3>
              <ul className="mt-4 text-xs sm:text-sm sm:mt-6 md::text-base text-text-3">
                {supportLinks.map((link, index) => (
                  <li key={index} className="mt-2 sm:mt-4">
                    <Link href={link.link}>{text(link.name)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <div className="flex flex-col items-start w-full gap-4 sm:mt-6 sm:flex-row sm:gap-10 whitespace-nowrap max-md:max-w-full">
              <div className="flex justify-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-xl rounded-full sm:w-12 sm:h-12 sm:text-2xl text-primary bg-primary/10">
                  <FaTelegramPlane />
                </div>
                <div className="flex-1 ">
                  <div className="text-xs sm:text-sm">
                    {text("haveAQuestion")}
                  </div>
                  <a
                    href="https://t.me/nexgensupport"
                    target="_blank"
                    className="text-sm font-semibold underline sm:text-base text-primary"
                  >
                    {text("telegramSupport")}
                  </a>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-xl rounded-full sm:w-12 sm:h-12 sm:text-2xl text-primary bg-primary/10">
                  <MdOutlineMail />
                </div>
                <div className="flex-1">
                  <div className="text-xs sm:text-sm">{text("contactUs")}</div>
                  <a
                    href="mailto:nexgensupprot@gmail.com"
                    target="_blank"
                    className="text-sm font-semibold underline sm:text-base text-primary"
                  >
                    {text("contactEmail")}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-start self-start justify-center gap-4 mt-6 sm:gap-6 sm:mt-10">
              {socialLinks.map((platform, index) => (
                <a
                  key={index}
                  href={platform.link}
                  className="flex items-center justify-center w-10 h-10 text-xl rounded-full sm:w-12 sm:h-12 sm:text-2xl text-text-1 bg-primary/10"
                >
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-2 mt-6 text-sm sm:text-base ">
          {text("copyRight")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
