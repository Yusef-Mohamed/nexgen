"use client";
import Sidebar from "./components/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserHeader from "@/components/layout/UserHeader";
import { useState } from "react";
import Logo from "@/components/logo";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/SearchInput";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Menu, Plus, ChevronDown } from "lucide-react";

const DashboardLayoutClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const text = useTranslations("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const nav = useRouter();
  return (
    <div className="dashboard">
      <div className="flex min-h-screen bg-background-2">
        <Sidebar
          style={{
            maxHeight: "calc(100vh)",
            height: "calc(100vh)",
          }}
          className="hidden lg:flex"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isCollapsable={true}
        />
        <div className="relative flex-1 w-full dashboardMain">
          <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-clear-ground/95 px-3 backdrop-blur-sm sm:px-6">
            <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between gap-3 py-1">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <Logo className="lg:hidden" size="sm" />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    nav.push(`/dashboard?search=${search}`);
                  }}
                  className="hidden w-full max-w-[30rem] lg:block"
                >
                  <SearchInput
                    value={search}
                    onChange={setSearch}
                    containerClassName="mb-0"
                    className="h-12 rounded-2xl border-primary/10 bg-background-2 text-sm shadow-sm"
                    placeholder={text("searchNexgenAcademy")}
                  />
                </form>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="primaryOutline"
                  className="hidden h-11 min-w-0 gap-2 rounded-xl border-primary/10 bg-clear-ground px-4 text-sm shadow-sm sm:inline-flex"
                >
                  <Plus className="size-4" />
                  {text("create")}
                  <ChevronDown className="size-4 text-text-3" />
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      className="rounded-xl lg:hidden"
                      size="icon"
                      variant="outline"
                    >
                      <Menu className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="p-0">
                    <Sidebar className="w-full h-full" />
                  </SheetContent>
                </Sheet>
                <UserHeader />
              </div>
            </div>
          </header>
          <div className="bg-background-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutClient;
