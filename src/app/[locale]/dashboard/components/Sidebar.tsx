"use client";
import { cn } from "@/lib/utils";
import { FaHome, FaRegChartBar, FaUser, FaUsers } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import { IoAnalytics, IoBookOutline } from "react-icons/io5";
import { MdLiveTv } from "react-icons/md";
import { GiCash } from "react-icons/gi";
import { AiFillFolderOpen } from "react-icons/ai";
import SidebarLink from "./SidebarLink";
import SidebarFooter from "./SidebarFooter";
import { CiMoneyBill } from "react-icons/ci";
import { RiDiscountPercentLine, RiTeamFill } from "react-icons/ri";
import { useAuth } from "@/components/auth-provider";
const Sidebar: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  const { user } = useAuth();
  const links = [
    {
      href: "/dashboard",
      label: "home",
      icon: <FaHome />,
    },
    {
      href: "/dashboard/community?sharedTo=students",
      label: "community",
      icon: <FaUsers />,
    },
    {
      href: "/dashboard/learn",
      label: "learn",
      icon: <IoBookOutline />,
    },
    {
      href: "/dashboard/analytics",
      label: "analytics",
      icon: <IoAnalytics />,
    },
    {
      href: "/dashboard/lives",
      label: "lives",
      icon: <MdLiveTv />,
    },
    {
      href: "/dashboard/chat",
      label: "chat",
      icon: <IoMdChatboxes />,
    },
    {
      href: "/dashboard/marketing",
      label: "marketing",
      icon: <GiCash />,
      links: [
        {
          href: "/dashboard/marketing/sales-analytics",
          label: "salesAnalytics",
          icon: <FaRegChartBar />,
        },
        {
          href: "/dashboard/marketing/my-team",
          label: "myTeam",
          icon: <RiTeamFill />,
        },
        {
          href: "/dashboard/marketing/invoices",
          label: "invoices",
          icon: <CiMoneyBill />,
        },

        {
          href: "/dashboard/marketing/coupons",
          label: "coupons",
          icon: <RiDiscountPercentLine />,
        },
      ],
    },
    {
      href: "/dashboard/practice",
      label: "practice",
      icon: <AiFillFolderOpen />,
    },
    {
      href: `/dashboard/community/profile/${user?._id}`,
      label: "profile",
      icon: <FaUser />,
    },
  ];
  // if (user && !user.authToReview) {
  //   links = links.filter((link) => {
  //     return !reqAuthToReview?.includes(link.label);
  //   });
  // }
  // if (user && !user.isMarketer) {
  //   links = links.filter((link) => {
  //     return link.label !== "marketing";
  //   });
  // }
  return (
    <aside
      {...props}
      className={cn(
        "py-4 px-3 sm:px-6 sm:py-8 flex flex-col justify-between bg-clear-ground h-screen max-h-screen overflow-auto top-0 sticky w-80",
        className
      )}
    >
      <nav className="mb-2">
        <ul className="space-y-2 ">
          {links.map((link) => (
            <li key={link.href}>
              <SidebarLink link={link} />
            </li>
          ))}
        </ul>
      </nav>
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;
