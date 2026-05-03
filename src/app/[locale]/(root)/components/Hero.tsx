"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import TransitionBox from "@/components/TransitionBox";
import { cn } from "@/lib/utils";
import {
  HiOutlineSparkles,
  HiOutlineAcademicCap,
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineArrowRight,
} from "react-icons/hi2";

const Hero: React.FC = () => {
  const text = useTranslations("hero");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section className="pt-8 container">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl bg-primary-faded",
          "px-4 sm:px-8 md:px-16 lg:px-20",
          "py-10 sm:pt-16 md:py-20 lg:py-[5.5rem]",
          "flex max-lg:flex-col gap-6 lg:items-center lg:justify-between"
        )}
      >
        {/* Decorative gradient blobs (existing palette only) */}
        <div
          aria-hidden
          className="absolute -top-24 -left-24 size-72 rounded-full bg-secondary/30 dark:bg-secondary/40 blur-[110px] opacity-70 animate-pulse"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-24 size-72 rounded-full bg-secondary/20 dark:bg-secondary/30 blur-[110px] opacity-70 animate-pulse [animation-delay:1.5s]"
        />
        <div
          aria-hidden
          className="absolute top-1/3 right-1/4 size-40 rounded-full bg-primary/20 blur-[90px] opacity-60"
        />

        {/* Subtle grid pattern overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Left content */}
        <TransitionBox
          containerClassName="overflow-visible relative z-10 lg:max-w-[60%]"
          fromValue="200%"
          transitionType="fromRight"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-clear-ground/80 backdrop-blur-sm border border-primary/20 cardShadowSm">
            <HiOutlineSparkles className="size-4 text-secondary" />
            <span className="text-xs sm:text-sm font-medium text-primary-main">
              {text("bestPlatform")}
            </span>
          </div>

          {/* Heading */}
          <h1
            className={cn(
              "font-bold leading-tight tracking-tight",
              isRTL ? "space-y-5" : "space-y-2"
            )}
          >
            <div className="block text-text-1">{text("headingPart1")}</div>
            <div className="block relative w-fit">
              <div
                className={cn(
                  "w-full h-full bg-primary/10 absolute top-0 left-0 -z-0",
                  isRTL ? "h-[120%]" : "translate-y-[10%]"
                )}
              />
              <span className="relative z-10 text-primary">
                {text("headingPart2")}
              </span>
            </div>
            <div className="block text-text-1">{text("headingPart3")}</div>
            <div className="block text-text-1">{text("headingPart4")}</div>
          </h1>

          <p className="my-6 sm:my-8 !text-base md:!text-lg text-text-2 max-w-xl leading-relaxed">
            {text("newDescription")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Button asChild size="lg" className="group sm:min-w-52">
              <Link href="/sign-up" className="flex items-center gap-2">
                <span>{text("getStarted")}</span>
                <HiOutlineArrowRight
                  className={cn(
                    "size-4 transition-transform group-hover:translate-x-1",
                    isRTL && "rotate-180 group-hover:-translate-x-1"
                  )}
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="primaryOutline"
              size="lg"
              className="sm:min-w-44 bg-clear-ground/60 backdrop-blur-sm"
            >
              <Link href="/courses">{text("startNow")}</Link>
            </Button>
          </div>

          {/* Trust / stats row */}
          <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HiOutlineUsers className="size-5" />
              </div>
              <div>
                <div className="text-base font-bold text-text-1 leading-none">
                  10K+
                </div>
                <div className="text-xs text-text-3 mt-1">
                  {text("activeLearners")}
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-primary/20" />
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <HiOutlineAcademicCap className="size-5" />
              </div>
              <div>
                <div className="text-base font-bold text-text-1 leading-none">
                  200+
                </div>
                <div className="text-xs text-text-3 mt-1">
                  {text("expertCourses")}
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-primary/20" />
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <HiOutlineStar className="size-5" />
              </div>
              <div>
                <div className="text-base font-bold text-text-1 leading-none">
                  4.9/5
                </div>
                <div className="text-xs text-text-3 mt-1">
                  {text("topRated")}
                </div>
              </div>
            </div>
          </div>
        </TransitionBox>

        {/* Right image with floating decorative cards */}
        <div className="w-full lg:max-w-[420px] max-w-[75%] max-lg:mx-auto relative aspect-square z-10">
          <TransitionBox
            className="w-full h-full"
            containerClassName="overflow-visible"
            transitionType="fromBottom"
            fromValue="200%"
          >
            {/* Decorative ring behind image */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent blur-2xl" />

            <Image
              src="/images/new_hero.png"
              alt={text("imageAlt")}
              className={cn(
                "relative w-full h-full object-contain drop-shadow-2xl",
                {
                  "-scale-x-100": isRTL,
                }
              )}
              width={650}
              height={650}
              priority
            />

            {/* Floating badge - top */}
            <div
              className={cn(
                "absolute top-4 sm:top-8 hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-clear-ground cardShadowSm",
                isRTL ? "right-0 sm:-right-4" : "left-0 sm:-left-4"
              )}
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              <div className="size-8 rounded-lg bg-green/15 flex items-center justify-center">
                <HiOutlineAcademicCap className="size-4 text-green" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-text-1 leading-none">
                  {text("liveClasses")}
                </div>
                <div className="text-[10px] text-text-3 mt-0.5">
                  {text("joinAnytime")}
                </div>
              </div>
            </div>

            {/* Floating badge - bottom */}
            <div
              className={cn(
                "absolute bottom-4 sm:bottom-12 hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-clear-ground cardShadowSm",
                isRTL ? "left-0 sm:-left-6" : "right-0 sm:-right-6"
              )}
              style={{ animation: "float 4s ease-in-out infinite 1.5s" }}
            >
              <div className="size-8 rounded-lg bg-secondary/15 flex items-center justify-center">
                <HiOutlineAcademicCap className="size-4 text-secondary" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-text-1 leading-none">
                  {text("certified")}
                </div>
                <div className="text-[10px] text-text-3 mt-0.5">
                  {text("onCompletion")}
                </div>
              </div>
            </div>
          </TransitionBox>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
