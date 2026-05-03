"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import TransitionBox from "@/components/TransitionBox";
import { HiOutlineCheckCircle } from "react-icons/hi2";

type Tone = "primary" | "secondary";

const ITEMS: { tone: Tone; number: string }[] = [
  { tone: "primary", number: "01" },
  { tone: "secondary", number: "02" },
  { tone: "primary", number: "03" },
];

const toneStyles: Record<
  Tone,
  {
    bg: string;
    border: string;
    hoverBorder: string;
    bar: string;
    numberBg: string;
    numberText: string;
    iconRing: string;
  }
> = {
  primary: {
    bg: "bg-primary-faded",
    border: "border-primary/15",
    hoverBorder: "hover:border-primary/40",
    bar: "bg-primary",
    numberBg: "bg-primary/15",
    numberText: "text-primary",
    iconRing: "ring-primary/20",
  },
  secondary: {
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    hoverBorder: "hover:border-secondary/50",
    bar: "bg-secondary",
    numberBg: "bg-secondary/15",
    numberText: "text-secondary",
    iconRing: "ring-secondary/25",
  },
};

const WhyChooseUs: React.FC = () => {
  const text = useTranslations("whyChooseUs");

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
              const styles = toneStyles[tone];
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
                      "group relative flex items-center gap-4 p-4 md:gap-6 md:p-6 rounded-2xl border",
                      "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-text-1/5",
                      styles.bg,
                      styles.border,
                      styles.hoverBorder,
                    )}
                  >
                    {/* Side accent bar */}
                    <div
                      className={cn(
                        "absolute top-4 bottom-4 w-1 rounded-full opacity-70 group-hover:opacity-100 transition-opacity",
                        styles.bar,
                        "ltr:left-0 rtl:right-0",
                      )}
                    />

                    <div className="relative shrink-0">
                      <div
                        className={cn(
                          "rounded-xl ring-4 transition-transform group-hover:scale-105",
                          styles.iconRing,
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
                          "rtl:-right-auto rtl:-left-2",
                          styles.numberBg,
                          styles.numberText,
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
        <div className="order-1 lg:order-2 relative lg:sticky lg:top-32">
          <TransitionBox
            transitionType="fromRight"
            fromValue="20%"
            containerClassName="overflow-visible"
          >
            <div className="relative">
              {/* Decorative tinted backdrop (solid) */}
              <div
                aria-hidden
                className="absolute -inset-3 rounded-[40px] bg-primary-faded -z-10"
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
              </div>

              {/* Floating stat card - top-right */}
              <div className="absolute top-5 end-5 sm:top-8 sm:end-8 px-4 py-3 rounded-2xl bg-clear-ground border border-primary/10 cardShadowSm flex items-center gap-3">
                <div className="size-10 rounded-xl bg-fadedGreen flex items-center justify-center">
                  <HiOutlineCheckCircle className="size-5 text-green" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text-1 leading-none">
                    {text("successRate")}
                  </div>
                  <div className="text-xs text-text-3 mt-1">
                    {text("courseCompletion")}
                  </div>
                </div>
              </div>

              {/* Floating stat card - bottom-left */}
              <div className="absolute bottom-5 start-5 sm:bottom-8 sm:start-8 px-4 py-3 rounded-2xl bg-clear-ground border border-primary/10 cardShadowSm">
                <div className="flex items-center -space-x-2 mb-1.5">
                  <span className="size-7 rounded-full bg-primary/30 ring-2 ring-clear-ground" />
                  <span className="size-7 rounded-full bg-secondary/30 ring-2 ring-clear-ground" />
                  <span className="size-7 rounded-full bg-primary/20 ring-2 ring-clear-ground" />
                  <span className="size-7 rounded-full bg-fadedGreen ring-2 ring-clear-ground flex items-center justify-center text-[10px] font-bold text-green">
                    +9k
                  </span>
                </div>
                <div className="text-xs font-medium text-text-2">
                  {text("trustedWorldwide")}
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
