"use client";

import { useState } from "react";
import LearningPathFormSidebar from "./LearningPathFormSidebar";
import Logo from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaBars } from "react-icons/fa";
import UserHeader from "@/components/layout/UserHeader";
import Footer from "@/components/layout/Footer";

interface LearningPathFormLayoutClientProps {
  children: React.ReactNode;
}

const LearningPathFormLayoutClient: React.FC<
  LearningPathFormLayoutClientProps
> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard">
      <div
        style={{
          minHeight: "calc(100vh)",
        }}
        className="flex bg-dash-ground"
      >
        <LearningPathFormSidebar
          className="hidden lg:flex"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isCollapsable={true}
        />
        <div className="relative flex-1 w-full dashboardMain">
          <header className="sticky top-0 z-50 w-full px-3 sm:px-6 bg-clear-ground">
            <div className="flex items-center h-[76px] py-1 justify-between gap-10">
              <div>
                <Logo className="lg:hidden" size="sm" />
              </div>
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-primary-faded aspect-square lg:hidden">
                      <FaBars />
                    </button>
                  </SheetTrigger>
                  <SheetContent className="p-0">
                    <LearningPathFormSidebar className="w-full" />
                  </SheetContent>
                </Sheet>
                <UserHeader />
              </div>
            </div>
          </header>
          <div className="bg-dash-ground py-6">{children}</div>
          <Footer clear />
        </div>
      </div>
    </div>
  );
};

export default LearningPathFormLayoutClient;
