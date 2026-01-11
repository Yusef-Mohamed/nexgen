"use client";
import { usePathname } from "@/i18n/routing";
import SidebarFollowing from "./SidebarFollowing";
import SidebarEvents from "./SidebarEvents";

const CommunitySidebar = () => {
  const pathname = usePathname();
  const isInstructorDashboard = pathname.includes("instructor-dashboard");

  if (isInstructorDashboard) {
    return null;
  }

  return (
    <div className="w-full xl:max-w-2xl p-4 py-4 overflow-auto xl:sticky max-xl:mx-auto xl:w-80 sm:py-8 xl:[max-height:calc(100vh-76px)] xl:[top:76px] xl:[height:calc(100vh-76px)]">
      <div className="max-xl:hidden">
        <SidebarFollowing />
        <SidebarEvents />
      </div>
    </div>
  );
};

export default CommunitySidebar;
