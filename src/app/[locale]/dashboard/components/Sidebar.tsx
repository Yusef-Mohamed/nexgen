import { cn } from "@/lib/utils";
import { FaHome, FaUser, FaUsers } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import { IoAnalytics } from "react-icons/io5";
import { MdLiveTv } from "react-icons/md";
import { GiCash } from "react-icons/gi";
import { AiFillFolderOpen } from "react-icons/ai";
import SidebarLink from "./SidebarLink";
import SidebarFooter from "./SidebarFooter";

const Sidebar: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  // const cookiesStore = cookies();
  // const user = JSON.parse(cookiesStore.get("user")?.value || "{}") as IUser;
  const links = [
    {
      href: "/dashboard",
      label: "home",
      icon: <FaHome />,
    },
    {
      href: "/dashboard/community?sharedTo=courses",
      label: "community",
      icon: <FaUsers />,
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
    },
    {
      href: "/dashboard/practice",
      label: "practice",
      icon: <AiFillFolderOpen />,
    },
    {
      href: "/dashboard/profile",
      label: "profile",
      icon: <FaUser />,
    },
  ];
  // if (!user.authToReview) {
  //   links = links.filter((link) => {
  //     return !reqAuthToReview?.includes(link.label);
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
      <nav>
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
