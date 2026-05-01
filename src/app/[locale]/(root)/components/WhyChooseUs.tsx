"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import TransitionBox from "@/components/TransitionBox";
import { HiOutlineCheckCircle } from "react-icons/hi2";

type Tone = "primary" | "secondary" | "gold";

const ITEMS: { tone: Tone; number: string }[] = [
  { tone: "primary", number: "01" },
  { tone: "secondary", number: "02" },
  { tone: "gold", number: "03" },
];

const getCardStyle = (tone: Tone, isDark: boolean): React.CSSProperties => {
  if (tone === "primary") {
    return isDark
      ? {
          background: "linear-gradient(180deg, #282828 0%, #003051 100%)",
          boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
        }
      : {
          background: "linear-gradient(180deg, #FFF 0%, #BCE4FF 100%)",
          boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
        };
  }
  if (tone === "secondary") {
    return isDark
      ? {
          background: "linear-gradient(0deg, #1A003B 0%, #282828 100%)",
          boxShadow: "0 2px 16px 0 rgba(142, 213, 255, 0.24)",
        }
      : {
          background: "linear-gradient(0deg, #E2CEFD 0%, #FFF 100%)",
          boxShadow: "2px 4px 200px 0 #F3EBFF",
        };
  }
  return isDark
    ? {
        background: "linear-gradient(180deg, #282828 0%, #00424A 100%)",
        boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
      }
    : {
        background: "linear-gradient(180deg, #FFF 0%, #B2F7FF 100%)",
        boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
      };
};

const toneAccent: Record<
  Tone,
  { bar: string; numberBg: string; numberText: string; iconRing: string }
> = {
  primary: {
    bar: "bg-primary",
    numberBg: "bg-primary/10",
    numberText: "text-primary",
    iconRing: "ring-primary/20",
  },
  secondary: {
    bar: "bg-secondary",
    numberBg: "bg-secondary/10",
    numberText: "text-secondary",
    iconRing: "ring-secondary/20",
  },
  gold: {
    bar: "bg-gold",
    numberBg: "bg-gold/15",
    numberText: "text-gold",
    iconRing: "ring-gold/30",
  },
};

const WhyChooseUs: React.FC = () => {
  const text = useTranslations("whyChooseUs");
  const theme = useTheme();
  const isDark = theme.resolvedTheme === "dark";

  return (
    <section className="container secPadding">
      <div className="grid gap-10 md:gap-12 lg:gap-20 lg:grid-cols-2 items-start">
        {/* Left: copy + items */}
        <div className="order-2 lg:order-1">
          <div className="flex flex-col w-full">
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-primary/10 border border-primary/20">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                {text("heading")}
              </span>
            </div>
            <h2 className="font-bold text-text-1 leading-tight">
              {text("subHeading")}
            </h2>
          </div>

          <div className="mt-10 space-y-5 max-md:mt-8 max-md:space-y-4">
            {ITEMS.map(({ tone, number }, index) => {
              const accent = toneAccent[tone];
              return (
                <TransitionBox
                  key={index}
                  transitionType="fromLeft"
                  fromValue="40%"
                  delay={index * 0.1}
                  containerClassName="overflow-visible"
                >
                  <div
                    className={cn(
                      "group relative flex items-center gap-4 p-4 md:gap-6 md:p-6 rounded-2xl",
                      "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    )}
                    style={getCardStyle(tone, isDark)}
                  >
                    {/* Side accent bar */}
                    <div
                      className={cn(
                        "absolute top-4 bottom-4 w-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity",
                        accent.bar,
                        "ltr:left-0 rtl:right-0"
                      )}
                    />

                    <div className="relative shrink-0">
                      <div
                        className={cn(
                          "rounded-xl ring-4 transition-transform group-hover:scale-105",
                          accent.iconRing
                        )}
                      >
                        <Image
                          src={`/images/why_chose_us_${index + 1}.png`}
                          width={200}
                          height={200}
                          alt={text(`case_${index + 1}_title`)}
                          className="w-20 rounded-xl md:w-24 md:h-24 aspect-square object-cover"
                        />
                      </div>
                      <div
                        className={cn(
                          "absolute -top-2 -right-2 size-7 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-clear-ground",
                          accent.numberBg,
                          accent.numberText
                        )}
                      >
                        {number}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-text-1">
                        {text(`case_${index + 1}_title`)}
                      </h4>
                      <p className="mt-2 text-text-3 text-sm md:text-base leading-relaxed">
                        {text(`case_${index + 1}_description`)}
                      </p>
                    </div>
                  </div>
                </TransitionBox>
              );
            })}
          </div>
        </div>

        {/* Right: image + floating accents */}
        <div className="order-1 lg:order-2 relative lg:sticky lg:top-24">
          <TransitionBox
            transitionType="fromRight"
            fromValue="20%"
            containerClassName="overflow-visible"
          >
            <div className="relative">
              {/* Backdrop blob */}
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-primary/15 via-secondary/10 to-gold/10 blur-2xl"
              />

              {/* Image frame */}
              <div className="relative rounded-[32px] overflow-hidden cardShadow">
                <Image
                  src="/images/why_chose_us.png"
                  alt={text("heading")}
                  height={1000}
                  width={1000}
                  className="aspect-[66/69] w-full object-cover"
                />
                {/* Subtle overlay tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating stat card - top-right */}
              <div className="absolute top-5 right-5 sm:top-8 sm:right-8 px-4 py-3 rounded-2xl bg-clear-ground/95 backdrop-blur cardShadowSm flex items-center gap-3">
                <div className="size-10 rounded-xl bg-green/15 flex items-center justify-center">
                  <HiOutlineCheckCircle className="size-5 text-green" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text-1 leading-none">
                    98% Success
                  </div>
                  <div className="text-xs text-text-3 mt-1">
                    Course completion
                  </div>
                </div>
              </div>

              {/* Floating stat card - bottom-left */}
              <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 px-4 py-3 rounded-2xl bg-clear-ground/95 backdrop-blur cardShadowSm">
                <div className="flex items-center -space-x-2 mb-1.5">
                  <span className="size-7 rounded-full bg-primary/20 ring-2 ring-clear-ground" />
                  <span className="size-7 rounded-full bg-secondary/30 ring-2 ring-clear-ground" />
                  <span className="size-7 rounded-full bg-gold/30 ring-2 ring-clear-ground" />
                  <span className="size-7 rounded-full bg-green/20 ring-2 ring-clear-ground flex items-center justify-center text-[10px] font-bold text-green">
                    +9k
                  </span>
                </div>
                <div className="text-xs font-medium text-text-2">
                  Trusted by traders worldwide
                </div>
              </div>
            </div>
          </TransitionBox>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
