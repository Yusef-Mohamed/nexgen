"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import CourseSidebar from "./components/CourseSidebar";
import Logo from "@/components/logo";
import SearchInput from "@/components/SearchInput";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
        className="flex bg-background"
      >
        <CourseSidebar
          className="hidden lg:flex"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isCollapsable={true}
        />
        <div className="relative min-w-0 flex-1 w-full dashboardMain">
          <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-clear-ground/95 px-3 backdrop-blur sm:px-6">
            <div className="flex h-[76px] items-center justify-between gap-4 py-1">
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
                    <button className="flex size-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary lg:hidden">
                      <Menu className="size-5" />
                    </button>
                  </SheetTrigger>
                  <SheetContent className="border-primary/10 p-0">
                    <CourseSidebar className="w-full h-full" />
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
