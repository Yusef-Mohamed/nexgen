"use client";
import { useAuth } from "@/components/auth-provider";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { BsChatLeftDots } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import { LuBadgeCheck } from "react-icons/lu";
import { RiUser3Line } from "react-icons/ri";

const Sidebar = () => {
  const text = useTranslations("settings");
  const pathname = usePathname();
  const { user } = useAuth();
  const links = [
    {
      label: "myProfile",
      icon: <RiUser3Line className="w-5 h-5" />,
      link: "/dashboard/settings",
    },
    {
      label: "changePassword",
      icon: <FaKey />,
      link: "/dashboard/settings/change-password",
    },
    {
      label: "identityVerification",
      icon: <LuBadgeCheck className="w-5 h-5" />,
      link: "/dashboard/settings/identity-verification",
    },
  ];
  if (user?.authToReview) {
    links.push({
      label: "systemReview",
      icon: <BsChatLeftDots />,
      link: "/dashboard/settings/system-review",
    });
  }
  return (
    <aside className="xl:w-[18rem] w-full ">
      <nav className="space-y-2">
        {links.map(({ label, icon, link }) => (
          <Link
            className={cn(
              "flex items-center gap-2 px-4 py-2 hover:border hover:border-primary hover:bg-primary/10 rounded-md",
              {
                "border-primary border bg-primary/10": pathname === link,
              }
            )}
            key={label}
            href={link}
          >
            <div className="w-6">{icon}</div>
            {text(label)}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
