import { unstable_setRequestLocale } from "next-intl/server";
import DashboardLayoutClient from "../dashboard/DashboardLayoutClient";

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
