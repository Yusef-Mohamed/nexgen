"use client";

import { useTranslations } from "next-intl";
import { FaTelegramPlane } from "react-icons/fa";
import { usePathname } from "@/i18n/navigation";
// import AiChatWidget from "@/components/AiChatWidget";

export default function FloatingSupportActions() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const isDashboard = ["/dashboard", "/instructor-dashboard"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isDashboard) return null;

  return (
    <div className="fixed bottom-5 end-4 z-500 flex flex-col items-end gap-3 sm:bottom-8 sm:end-8">
      {/* <AiChatWidget /> */}
      <a
        target="_blank"
        href="https://t.me/nexgensupport"
        className="relative flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary text-2xl text-primary-foreground cardShadowprimary transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90"
        aria-label={t("contactTelegramAria")}
      >
        <FaTelegramPlane className="z-10" />
        <div
          aria-hidden
          className="absolute inset-0 z-0 animate-ping rounded-full bg-primary opacity-30"
        />
      </a>
    </div>
  );
}
