"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import CourseSidebar from "./components/CourseSidebar";
import Logo from "@/components/logo";
import SearchInput from "@/components/SearchInput";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaBars } from "react-icons/fa";
import UserHeader from "@/components/layout/UserHeader";
import Footer from "@/components/layout/Footer";
import Main from "./components/Main";

const LearnLayoutClient: React.FC = () => {
  const textDashboard = useTranslations("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const nav = useRouter();
  return (
    <div className="dashboard">
      <div
        style={{
          minHeight: "calc(100vh)",
        }}
        className="flex bg-dash-ground"
      >
        <CourseSidebar
          className="hidden lg:flex"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isCollapsable={true}
        />
        <div className="relative flex-1 w-full dashboardMain">
          <header className="sticky top-0 z-50 w-full px-3 sm:px-6 bg-background-2">
            <div className="flex items-center h-[76px] py-1 justify-between gap-10">
              <div>
                <Logo className="lg:hidden" size="sm" />
                <form
                  className="max-lg:hidden"
                  onSubmit={(e) => {
                    e.preventDefault();
                    nav.push(`/dashboard?search=${search}`);
                  }}
                >
                  <SearchInput
                    value={search}
                    onChange={setSearch}
                    containerClassName="mb-0"
                    placeholder={textDashboard("searchAboutCourses")}
                  />
                </form>
              </div>
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-primary-faded aspect-square lg:hidden">
                      <FaBars />
                    </button>
                  </SheetTrigger>
                  <SheetContent className="p-0">
                    <CourseSidebar className="w-full" />
                  </SheetContent>
                </Sheet>
                <UserHeader />
              </div>
            </div>
          </header>
          <Main />
          <Footer clear />
        </div>
      </div>
    </div>
  );
};

export default LearnLayoutClient;
