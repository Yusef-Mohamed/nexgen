import DashboardContainer from "../components/DashboardContainer";
import Sidebar from "./components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
      <DashboardContainer className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <Sidebar />
        <section className="min-w-0 overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm sm:p-6 lg:p-8 xl:max-w-3xl">
          {children}
        </section>
      </DashboardContainer>
    </main>
  );
}
