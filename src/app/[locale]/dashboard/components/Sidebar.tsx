"use client";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { FaHome, FaRegChartBar, FaUser, FaUsers } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import { IoAnalytics, IoBookOutline } from "react-icons/io5";
import { MdLiveTv } from "react-icons/md";
import { GiCash } from "react-icons/gi";
import { AiFillFolderOpen } from "react-icons/ai";
import { BsNewspaper } from "react-icons/bs";
import SidebarLink from "./SidebarLink";
import SidebarFooter from "./SidebarFooter";
import { CiMoneyBill } from "react-icons/ci";
import { RiDiscountPercentLine, RiTeamFill } from "react-icons/ri";
import { useAuth } from "@/components/auth-provider";
import { reqAuthToReview } from "@/constants";
import Logo from "@/components/logo";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type SidebarLinkType = {
  href: string;
  label: string;
  icon: React.ReactNode;
  links?: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];
};

type LinkGroup = {
  title: string | null;
  links: SidebarLinkType[];
};

const Sidebar: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    collapsed?: boolean;
    onToggle?: () => void;
    isCollapsable?: boolean;
  }
> = ({
  className,
  collapsed = false,
  onToggle,
  isCollapsable = false,
  ...props
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const text = useTranslations("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const linkGroups: LinkGroup[] = useMemo(() => {
  let groups: LinkGroup[] = [
    // First group - no title (main links)
    {
      title: null,
      links: [
        {
          href: "/dashboard",
          label: "home",
          icon: <FaHome />,
        },
        {
          href: "/dashboard/blogs",
          label: "blogs",
          icon: <BsNewspaper />,
        },
      ],
    },
    // Community group
    {
      title: "community",
      links: [
        {
          href: "/dashboard/community?sharedTo=students",
          label: "community",
          icon: <FaUsers />,
        },
        {
          href: "/dashboard/chat",
          label: "chat",
          icon: <IoMdChatboxes />,
        },
      ],
    },
    // Learn group
    {
      title: "learn",
      links: [
        {
          href: "/dashboard/lives",
          label: "lives",
          icon: <MdLiveTv />,
        },
        {
          href: "/dashboard/analytics",
          label: "analytics",
          icon: <IoAnalytics />,
        },
        {
          href: "/dashboard/learn",
          label: "learn",
          icon: <IoBookOutline />,
        },
        {
          href: "/dashboard/practice",
          label: "practice",
          icon: <AiFillFolderOpen />,
        },
      ],
    },
    // Marketing group
    {
      title: "marketing",
      links: [
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
      ],
    },
    // Profile group
    {
      title: null,
      links: [
        {
          href: `/dashboard/community/profile/${user?._id}`,
          label: "profile",
          icon: <FaUser />,
        },
      ],
    },
  ];

  if (mounted && user && !user.authToReview) {
    groups = groups
      .map((group) => ({
        ...group,
        links: group.links.filter((link) => {
          return !reqAuthToReview?.includes(link.label);
        }),
      }))
      .filter((group) => group.links.length > 0);
  }

  // Handle marketing section visibility and sublinks
  if (mounted && user) {
    const isMarketer = user.isMarketer;
    const isAffiliateMarketer = user.isAffiliateMarketer;

    // Show marketing section if user is either marketer or affiliate marketer
    if (!isMarketer && !isAffiliateMarketer) {
      groups = groups
        .map((group) => ({
          ...group,
          links: group.links.filter((link) => {
            return link.label !== "marketing";
          }),
        }))
        .filter((group) => group.links.length > 0);
    }
  }
  if (pathname.includes("instructor-dashboard")) {
    groups = [
      {
        title: null,
        links: [
          {
            href: "/instructor-dashboard/courses",
            label: "myCourses",
            icon: <IoBookOutline />,
          },
          {
            href: "/instructor-dashboard/lives",
            label: "lives",
            icon: <MdLiveTv />,
          },
          {
            href: "/instructor-dashboard/blogs",
            label: "blogs",
            icon: <BsNewspaper />,
          },
          {
            href: "/dashboard/marketing",
            label: "marketing",
            icon: <GiCash />,
            links: [
              {
                href: "/instructor-dashboard/wallet",
                label: "wallet",
                icon: <CiMoneyBill />,
              },
              {
                href: "/instructor-dashboard/my-team",
                label: "myTeam",
                icon: <RiTeamFill />,
              },
              {
                href: "/instructor-dashboard/coupons",
                label: "coupons",
                icon: <RiDiscountPercentLine />,
              },
            ],
          },
        ],
      },
      {
        title: "community",
        links: [
          {
            href: "/instructor-dashboard/community?sharedTo=students",
            label: "community",
            icon: <FaUsers />,
          },
          {
            href: "/instructor-dashboard/chat",
            label: "chat",
            icon: <IoMdChatboxes />,
          },
          {
            href: "/instructor-dashboard/practice",
            label: "practice",
            icon: <AiFillFolderOpen />,
          },
        ],
      },
    ];
  }

  return groups;
  }, [mounted, user, pathname]);

  return (
    <aside
      {...props}
      className={cn(
        "py-4 pt-0 flex flex-col justify-between bg-background-2 h-screen max-h-screen overflow-auto top-0 sticky transition-all duration-300",
        collapsed ? "w-16 px-2 pt-4" : "w-80 px-3 sm:px-6 ",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between min-h-[76px] items-center flex-wrap mb-4 gap-4">
          <Logo size="sm" isIconic={collapsed} />

          {isCollapsable && (
            <button
              onClick={onToggle}
              className="w-12 h-12 p-0 flex items-center justify-center rounded-full"
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="43"
                  height="43"
                  rx="21.5"
                  stroke="currentColor"
                  className="stroke-primary"
                />
                <path
                  d="M13 22H31M13 16H31M19 28H31"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        <nav className="mb-2 flex-1">
          {/* <ul className="space-y-4"> */}
          <ul className="space-y-2">
            {linkGroups.map((group, groupIndex) => (
              <li key={groupIndex} className="space-y-2">
                {group.title && !collapsed && (
                  <div className="relative">
                    <div className="h-0.5 w-full bg-foreground absolute top-1/2 -translate-y-1/2 " />
                    <div className="px-3 pe-4 py-2 bg-background-2 w-fit text-xs font-semibold relative z-10 uppercase tracking-wider">
                      {text(group.title)}
                    </div>
                  </div>
                )}
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <SidebarLink link={link} collapsed={collapsed} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <SidebarFooter collapsed={collapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
