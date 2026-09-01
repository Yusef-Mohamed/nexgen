"use client";
import Sidebar from "./components/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserHeader from "@/components/layout/UserHeader";
import { useState, useSyncExternalStore } from "react";
import Logo from "@/components/logo";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/SearchInput";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import DashboardContainer from "./components/DashboardContainer";

const subscribeToClientState = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const DashboardLayoutClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const text = useTranslations("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const nav = useRouter();
  const interactiveHeaderReady = useSyncExternalStore(
    subscribeToClientState,
    getClientSnapshot,
    getServerSnapshot,
  );
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
        <div
          className="relative flex-1 w-full dashboardMain"
          style={
            {
              "--dashboard-sidebar-width": sidebarCollapsed ? "96px" : "292px",
            } as React.CSSProperties
          }
        >
          <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-clear-ground/95 px-3 backdrop-blur-sm sm:px-6">
            <DashboardContainer className="flex h-[76px] items-center justify-between gap-3 py-1">
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
                    className="!h-11 !min-w-0 rounded-full border-primary/10 bg-background-2/80 !py-0 text-sm shadow-none transition-colors focus-visible:ring-primary/20 md:!h-11 md:!text-sm"
                    placeholder={text("searchNexgenAcademy")}
                  />
                </form>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {interactiveHeaderReady ? (
                  <>
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
                  </>
                ) : (
                  <div
                    aria-hidden
                    className="h-10 w-44 shrink-0 lg:w-[128px]"
                  />
                )}
              </div>
            </DashboardContainer>
          </header>
          <div className="relative overflow-hidden bg-background-2">
            <div
              aria-hidden
              data-dashboard-ambient-layer=""
              className="pointer-events-none fixed bottom-0 end-0 start-0 top-[76px] z-0 overflow-hidden lg:start-[var(--dashboard-sidebar-width)]"
            >
              <div className="absolute -top-24 end-12 size-72 rounded-full bg-primary/10 blur-[110px]" />
              <div className="absolute top-72 start-8 size-64 rounded-full bg-secondary/10 blur-[110px]" />
            </div>
            <div className="relative z-10 [&>main]:!bg-transparent">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutClient;
