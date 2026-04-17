"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import Logo from "./logo";

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export default function ComingSoon({ targetDate }: { targetDate: string }) {
  const t = useTranslations("comingSoon");

  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, "0"),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0"),
        minutes: Math.floor((difference / 1000 / 60) % 60)
          .toString()
          .padStart(2, "0"),
        seconds: Math.floor((difference / 1000) % 60)
          .toString()
          .padStart(2, "0"),
      };
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center max-w-3xl"
      >
        {/* Icon */}
        <Logo />
        <div className="mb-8 mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
          <Clock className="w-8 h-8 text-blue-500" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-7xl font-bold mb-4 tracking-tight leading-tight">
          {t("enhancingYour")} <br />
          <span className="bg-linear-to-r from-blue-500 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            {t("experience")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-xl leading-relaxed">
          {t("description")}
        </p>

        {/* Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <TimeUnit value={timeLeft.days} label={t("days")} />
          <TimeUnit value={timeLeft.hours} label={t("hours")} />
          <TimeUnit value={timeLeft.minutes} label={t("minutes")} />
          <TimeUnit value={timeLeft.seconds} label={t("seconds")} />
        </div>

        {/* Badge */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-12"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          {t("stayTuned")}
        </motion.div>

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

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="text-4xl md:text-6xl font-bold font-mono"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-3 text-blue-500/80 text-[10px] md:text-xs font-bold tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}
