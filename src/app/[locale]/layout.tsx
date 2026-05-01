import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";

import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
import ToastProvider from "@/components/ToastProvider";
import { AuthProvider } from "@/components/auth-provider";
import { GoogleTagManager } from "@next/third-parties/google";
import QueryProvider from "@/components/QueryProvider";
import ProgressBarProvider from "@/components/progress-bar";

import SocketWrapper from "@/components/SocketWrapper";
import FloatingSupportActions from "@/components/FloatingSupportActions";

const alexandria = Alexandria({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "en") {
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

import ServiceUpdateNotice from "@/components/ServiceUpdateNotice";

const locales = ["en", "ar"];
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  // utc date
  const finishDate = "2025-06-31T00:00:00.000Z";
  const isFinishInPast = new Date(finishDate) < new Date();
  const serviceUpdateLastUpdated = "April 2, 2026";
  return (
    <html
      lang={locale}
      style={{
        direction: locale === "ar" ? "rtl" : "ltr",
      }}
      suppressHydrationWarning
    >
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CQS7J6MTDF"
          strategy="afterInteractive"
        ></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CQS7J6MTDF');
        `}
        </Script>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,
          document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '681168971375494');
          fbq('track', 'PageView');
          `}
        </Script>
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D1BHKSJC77U6QA6T05A0');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=681168971375494&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <GoogleTagManager gtmId="GTM-WTJFT9FN" />
      <body className={`${alexandria.className} overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <QueryProvider>
              <AuthProvider>
                <SocketWrapper>
                  <ProgressBarProvider>
                    <ToastProvider />
                    {!isFinishInPast ? (
                      <ServiceUpdateNotice
                        lastUpdated={serviceUpdateLastUpdated}
                      />
                    ) : (
                      <div className="min-h-screen w-full">{children}</div>
                    )}
                    <FloatingSupportActions />
                  </ProgressBarProvider>
                </SocketWrapper>
              </AuthProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
