import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { unstable_setRequestLocale } from "next-intl/server";

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Header />
      <div className="main">{children}</div>
      <Footer />
    </>
  );
}
