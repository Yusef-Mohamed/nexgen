import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FaTelegramPlane } from "react-icons/fa";
import ToastProvider from "@/components/ToastProvider";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/components/auth-provider";
import Script from "next/script";
const SocketWrapper = dynamic(() => import("@/components/SocketWrapper"), {
  ssr: false,
});

const alexandria = Alexandria({ subsets: ["latin"] });
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale === "en") {
    return {
      title: "Nexgen Academy",
      description:
        "Welcome to Nexgen Academy, your premier destination for comprehensive trading courses and expert coaching. Whether you're a beginner or an experienced trader, our tailored programs and personalized coaching sessions will help you master the art of trading. Join us to enhance your skills, gain practical insights, and achieve your financial goals with confidence.",
      keywords: [
        "Trading Courses",
        "Trading Coaching",
        "Financial Education",
        "Stock Market Training",
        "Forex Trading Courses",
        "Investment Strategies",
        "Online Trading Classes",
        "Trading Mentorship",
        "Market Analysis",
        "Trading Skills Development",
      ],
    };
  } else {
    return {
      title: "أكاديمية نيكسجين",
      description:
        "مرحبًا بكم في أكاديمية نيكستجن، وجهتكم الأولى للدورات التدريبية الشاملة والتدريب الاحترافي في مجال التداول. سواء كنت مبتدئًا أو متداولًا متمرسًا، فإن برامجنا المخصصة وجلسات التدريب الشخصية ستساعدك على إتقان فن التداول. انضم إلينا لتعزيز مهاراتك، واكتساب رؤى عملية، وتحقيق أهدافك المالية بثقة.",
      keywords: [
        "دورات التداول",
        "تدريب التداول",
        "التعليم المالي",
        "تدريب سوق الأسهم",
        "دورات تداول الفوركس",
        "استراتيجيات الاستثمار",
        "دروس التداول عبر الإنترنت",
        "الإرشاد في التداول",
        "تحليل السوق",
        "تطوير مهارات التداول",
      ],
    };
  }
}

const locales = ["en", "ar"];
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);
  const messages = useMessages();

  return (
    <html
      lang={locale}
      style={{
        direction: locale === "ar" ? "rtl" : "ltr",
      }}
    >
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WTJFT9FN');
            `,
          }}
        />
        {/* End Google Tag Manager */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimum-scale=1.0"
        />
      </head>
      <body className={`${alexandria.className} overflow-x-hidden`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WTJFT9FN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <SocketWrapper>
                <ToastProvider />
                <div className="min-h-screen w-full">{children}</div>
                <div
                  style={{
                    pointerEvents: "none",
                  }}
                  className="fixed right-0 z-10 flex justify-end w-full px-10 bottom-10"
                >
                  <a
                    style={{
                      pointerEvents: "auto",
                    }}
                    target="_blank"
                    href="https://t.me/nexgensupport"
                    className="relative flex items-center justify-center w-12 h-12 text-3xl text-white rounded-full bg-sky-500"
                  >
                    <FaTelegramPlane className="z-10" />
                    <div
                      className="absolute w-full h-full rounded-full opacity-50 animate-ping top-0 right-0  bg-sky-500 z-[0]"
                      style={{
                        transformOrigin: "center",
                      }}
                    />
                  </a>
                </div>
              </SocketWrapper>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
