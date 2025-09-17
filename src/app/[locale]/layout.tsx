import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
import { FaTelegramPlane } from "react-icons/fa";
import ToastProvider from "@/components/ToastProvider";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/components/auth-provider";
import { GoogleTagManager } from "@next/third-parties/google";
import QueryProvider from "@/components/QueryProvider";
const SocketWrapper = dynamic(() => import("@/components/SocketWrapper"), {
  ssr: false,
});

const alexandria = Alexandria({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimum-scale=1.0"
        />
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
 w.TiktokAnalyticsObject=t;var 
ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","
debug","on","off","once","ready","alias","group","enableCookie","di
sableCookie","holdConsent","revokeConsent","grantConsent"],ttq.
setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.p
rototype.slice.call(arguments,0)))}};for(var 
i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq
.instance=function(t){for(
var 
e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.
methods[n]);return e},ttq.load=function(e,n){var 
r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partne
r;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+n
ew 
Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("s
cript")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t
;e=document.getElementsByTagName("script")[0];e.parentNode.i
nsertBefore(n,e)};
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
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>
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
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
