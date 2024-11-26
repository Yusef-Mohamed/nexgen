import { unstable_setRequestLocale } from "next-intl/server";
import Sidebar from "./components/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaBars } from "react-icons/fa";
import Logo from "@/components/logo";
import UserHeader from "@/components/layout/UserHeader";
// import UserDropDownMenu from "@/components/UserDropDownMenu";
// import NotificationDropDownMenu from "@/components/NotificationDropDownMenu";

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);

  return (
    <div className="dashboard">
      <header className="sticky top-0 z-50 h-[76px] w-full px-3 py-1 sm:px-6 bg-clear-ground">
        <div className="flex items-center justify-between gap-10">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-primary-faded aspect-square lg:hidden">
                  <FaBars />
                </button>
              </SheetTrigger>
              <SheetContent className="p-0">
                <Sidebar className="w-full" />
              </SheetContent>
            </Sheet>
            <UserHeader />
          </div>
        </div>
      </header>

      <div
        style={{
          minHeight: "calc(100vh - 76px)",
        }}
        className="flex bg-muted"
      >
        <Sidebar
          style={{
            maxHeight: "calc(100vh - 76px)",
            top: "76px",
            height: "calc(100vh - 76px)",
          }}
          className="hidden lg:flex"
        />
        <div className="relative flex-1">{children}</div>
      </div>
    </div>
  );
}
