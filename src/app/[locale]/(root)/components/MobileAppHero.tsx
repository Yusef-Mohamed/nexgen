"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import TransitionBox from "@/components/TransitionBox";
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineStar,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";

const MobileAppHero: React.FC = () => {
  const text = useTranslations("mobileAppHero");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section className="container secPadding">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl bg-primary-faded",
          "px-4 sm:px-8 md:px-16 lg:px-20",
        )}
      >
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 size-72 rounded-full bg-primary/40 opacity-90 blur-[110px]"
        />
        <div
          aria-hidden
          className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 size-72 rounded-full bg-secondary/30 dark:bg-secondary/40 blur-[110px]"
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 rounded-full bg-primary/15 blur-[90px]"
        />

        {/* Subtle dot pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--primary)) 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
          {/* Left: copy */}
          <TransitionBox
            transitionType="fromLeft"
            fromValue="40%"
            containerClassName="overflow-visible"
          >
            <div className="relative z-10 py-10 sm:pt-16 md:py-20 lg:py-[5.5rem]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-clear-ground/80 backdrop-blur border border-primary/20 cardShadowSm">
                <HiOutlineDevicePhoneMobile className="size-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary-main">
                  {text("subtitle")}
                </span>
              </div>

              {/* Main heading */}
              <h2
                className={cn(
                  "font-bold leading-tight tracking-tight",
                  isRTL ? "space-y-5" : "space-y-2",
                )}
              >
                <div className="text-text-1">{text("headingPart1")} </div>
                <div className="block relative w-fit">
                  <div
                    className={cn(
                      "w-full h-full bg-primary/10 absolute top-0 left-0",
                      isRTL ? "h-[120%]" : "translate-y-[10%]",
                    )}
                  />
                  <span className="relative z-10 text-primary">
                    {text("headingPart2")}
                  </span>
                </div>
                <div className="text-text-1">{text("headingPart3")}</div>
              </h2>

              <p className="my-6 sm:my-8 !text-base md:!text-lg text-text-2 max-w-xl leading-relaxed">
                {text("description")}
              </p>

              {/* Rating row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <HiOutlineStar
                      key={i}
                      className="size-4 sm:size-5 text-gold"
                      style={{ fill: "currentColor" }}
                    />
                  ))}
                </div>
                <div className="text-sm text-text-2">
                  {text.rich("rating", {
                    rating: (chunks) => (
                      <span className="font-bold text-text-1">{chunks}</span>
                    ),
                  })}
                </div>
              </div>

              {/* Download buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" className="rounded-full group" asChild>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-2"
                  >
                    <HiOutlineArrowDownTray className="size-4 transition-transform group-hover:translate-y-0.5" />
                    {text("downloadButton")}
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="primaryOutline"
                  className="rounded-full bg-clear-ground/60 backdrop-blur"
                  asChild
                >
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    {text("learnMore")}
                  </a>
                </Button>
              </div>
            </div>
          </TransitionBox>

          {/* Right: phone image (lg+) */}
          <div className="hidden lg:flex justify-center items-end relative">
            <TransitionBox
              transitionType="fromBottom"
              fromValue="20%"
              containerClassName="overflow-visible w-full flex justify-center"
              className="w-full flex justify-center"
            >
              <div className="relative">
                {/* Decorative ring */}
                <div
                  aria-hidden
                  className="absolute inset-0 -z-0 rounded-full bg-gradient-to-br from-primary/20 via-secondary/15 to-transparent blur-3xl"
                />
                <Image
                  src={
                    isRTL
                      ? "/images/download-app-rtl.png"
                      : "/images/download-app.png"
                  }
                  alt={text("imageAlt")}
                  width={1000}
                  height={1000}
                  className="relative z-10 object-contain w-full max-w-lg drop-shadow-2xl"
                  style={{
                    aspectRatio: "1920/1785",
                  }}
                  priority
                />

                {/* Floating download badge */}
                <div
                  className={cn(
                    "absolute top-10 hidden sm:flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl bg-clear-ground/95 backdrop-blur cardShadowSm z-20",
                    isRTL ? "right-0" : "left-0",
                  )}
                  style={{ animation: "floatY 4s ease-in-out infinite" }}
                >
                  <div className="text-[10px] uppercase tracking-wider text-text-3 font-semibold">
                    {text("downloads")}
                  </div>
                  <div className="text-base font-bold text-primary leading-none">
                    50K+
                  </div>
                </div>
              </div>
            </TransitionBox>
          </div>
        </div>

        <style jsx>{`
          @keyframes floatY {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default MobileAppHero;
