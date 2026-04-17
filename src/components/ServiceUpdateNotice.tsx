"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";

export default function ServiceUpdateNotice({
  lastUpdated,
  contactHref = "https://t.me/nexgensupport",
}: {
  lastUpdated: string;
  contactHref?: string;
}) {
  const t = useTranslations("serviceUpdate");
  const titleParts = t("title").split(" ");
  const titleFirst = titleParts[0] ?? "";
  const titleSecond = titleParts.slice(1).join(" ");

  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden"
    >
      {/* Background Glows (same vibe as ComingSoon) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center max-w-3xl"
      >
        {/* Icon + Branding */}
        <Logo />

        {/* Title */}
        <h1 className="text-4xl md:text-7xl font-bold mb-4 tracking-tight leading-tight">
          {titleFirst}{" "}
          <span className="bg-linear-to-r from-blue-500 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            {titleSecond}
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
          {t("description")}
        </p>

        {/* Meta row */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-xs md:text-sm text-white/70">
            {t("lastUpdatedPrefix")}{" "}
            <span className="text-white/90 font-semibold">{lastUpdated}</span>
          </p>
          <Link
            href={contactHref}
            target="_blank"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/15 transition-colors"
          >
            {t("contactSupport")}
          </Link>
        </div>

        {/* Badge (animated) */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-12"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          {t("stayTuned")}
        </motion.div>

        {/* Sub text */}
        <p className="text-gray-500 text-xs md:text-sm tracking-wide mb-4 max-w-xl leading-relaxed">
          {t("subText")}
        </p>

        {/* Footer */}
        <div className="absolute bottom-10 left-0 w-full text-center">
          <p className="text-gray-500 text-xs md:text-sm tracking-widest uppercase">
            {t("footer")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
