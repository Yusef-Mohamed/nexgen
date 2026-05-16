"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { FaTelegramPlane } from "react-icons/fa";
import AiChatWidget from "@/components/AiChatWidget";

export default function FloatingSupportActions() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 end-4 z-[2147483647] flex flex-col items-end gap-4 sm:bottom-10 sm:end-10">
      <AiChatWidget />
      <a
        target="_blank"
        href="https://t.me/nexgensupport"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-3xl text-white shadow-lg shadow-sky-500/25"
        aria-label={t("contactTelegramAria")}
      >
        <FaTelegramPlane className="z-10" />
        <div
          className="absolute right-0 top-0 z-0 h-full w-full animate-ping rounded-full bg-sky-500 opacity-50"
          style={{
            transformOrigin: "center",
          }}
        />
      </a>
    </div>,
    document.body,
  );
}
