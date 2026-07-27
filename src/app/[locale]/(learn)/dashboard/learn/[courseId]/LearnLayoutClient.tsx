"use client";

import Logo from "@/components/logo";
import UserHeader from "@/components/layout/UserHeader";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getDynamicString } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  HiOutlineBars3,
  HiOutlineBookOpen,
  HiOutlineQueueList,
} from "react-icons/hi2";
import CourseSidebar from "./components/CourseSidebar";
import Main from "./components/Main";
import { useCourseContext } from "./context/CourseContext";

const LearnLayoutClient: React.FC = () => {
  const text = useTranslations("learn");
  const locale = useLocale();
  const { course, learningSummary, isLoading } = useCourseContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard min-h-screen bg-background-2">
      <div className="flex min-h-screen">
        <CourseSidebar
          className="hidden lg:flex"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
          isCollapsable
        />

        <div className="dashboardMain relative min-w-0 flex-1">
          <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-clear-ground/90 px-3 backdrop-blur-xl sm:px-5 lg:px-6">
            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      aria-label={text("openCourseContent")}
                      className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden"
                    >
                      <HiOutlineBars3 className="size-5" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side={locale === "ar" ? "right" : "left"}
                    className="w-[min(92vw,23rem)] border-primary/10 bg-clear-ground p-0"
                  >
                    <SheetTitle className="sr-only">
                      {text("courseContent")}
                    </SheetTitle>
                    <CourseSidebar
                      className="static h-full w-full max-w-none border-0"
                      onNavigate={() => setMobileOpen(false)}
                    />
                  </SheetContent>
                </Sheet>

                <Logo className="shrink-0 lg:hidden" size="sm" />

                <div className="hidden min-w-0 sm:block">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                    <HiOutlineBookOpen className="size-3.5" />
                    {text("learningWorkspace")}
                  </div>
                  <p className="mt-0.5 max-w-[42vw] truncate text-sm font-black text-text-1">
                    {isLoading
                      ? text("loading")
                      : getDynamicString(course?.title) || text("myLearning")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-primary/10 bg-background-2 px-3 py-1.5 text-xs font-bold text-text-3 md:flex">
                  <HiOutlineQueueList className="size-4 text-primary" />
                  <span>
                    {learningSummary.lessonsCount} {text("lessons")}
                  </span>
                </div>
                <UserHeader />
              </div>
            </div>
          </header>

          <Main />
        </div>
      </div>
    </div>
  );
};

export default LearnLayoutClient;
