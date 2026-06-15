"use client";

import { useTranslations } from "next-intl";
import { FaTelegramPlane } from "react-icons/fa";
import AiChatWidget from "@/components/AiChatWidget";

export default function FloatingSupportActions() {
  const t = useTranslations("common");

  return (
    <div className="fixed bottom-5 end-4 z-[2147483647] flex flex-col items-end gap-3 sm:bottom-8 sm:end-8">
      <AiChatWidget />
      <a
        target="_blank"
        href="https://t.me/nexgensupport"
        className="relative flex size-12 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary text-2xl text-secondary-foreground cardShadowSecondary transition-all duration-300 hover:-translate-y-1 hover:bg-secondary/90"
        aria-label={t("contactTelegramAria")}
      >
        <FaTelegramPlane className="z-10" />
        <div
          aria-hidden
          className="absolute inset-0 z-0 animate-ping rounded-2xl bg-secondary opacity-30"
        />
      </a>
    </div>
  );
}
