"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import TransitionBox from "@/components/TransitionBox";

type FeatureTone = "primary" | "secondary";

interface FeatureItem {
  index: number;
  number: string;
  tone: FeatureTone;
}

const FEATURES: FeatureItem[] = [
  { index: 1, number: "01", tone: "primary" },
  { index: 2, number: "02", tone: "secondary" },
  { index: 3, number: "03", tone: "primary" },
];

const toneStyles: Record<
  FeatureTone,
  {
    bg: string;
    border: string;
    hoverBorder: string;
    accent: string;
    iconBg: string;
    numberText: string;
  }
> = {
  primary: {
    bg: "bg-primary-faded",
    border: "border-primary/15",
    hoverBorder: "group-hover:border-primary/40",
    accent: "bg-primary",
    iconBg: "bg-primary/15",
    numberText: "text-primary/25",
  },
  secondary: {
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    hoverBorder: "group-hover:border-secondary/50",
    accent: "bg-secondary",
    iconBg: "bg-secondary/20",
    numberText: "text-secondary/30",
  },
};

const Features: React.FC = () => {
  const text = useTranslations("features");

  return (
    <section className="container secPadding">
      {/* Section heading */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-primary">
            {text("eyebrow")}
          </span>
        </div>
        <h2 className="text-text-1 font-bold">
          {text("headingStart")}{" "}
          <span className="text-primary">{text("headingHighlight")}</span>
        </h2>
        <p className="mt-4 text-text-3">{text("intro_text")}</p>
      </div>

      <div className="grid gap-5 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ index, number, tone }, i) => {
          const styles = toneStyles[tone];
          return (
            <TransitionBox
              key={index}
              transitionType="fromBottom"
              fromValue="40%"
              delay={i * 0.1}
              containerClassName="overflow-visible h-full"
              className="h-full"
            >
              <div
                className={cn(
                  "group relative h-full p-6 sm:p-7 rounded-2xl border transition-all duration-300",
                  "hover:-translate-y-1.5 hover:shadow-lg hover:shadow-text-1/5",
                  styles.bg,
                  styles.border,
                  styles.hoverBorder,
                )}
              >
                {/* Top accent bar */}
                <div
                  className={cn(
                    "absolute top-0 left-6 right-6 h-1 rounded-b-full opacity-70 group-hover:opacity-100 transition-opacity",
                    styles.accent,
                  )}
                />

                {/* Background number */}
                <div
                  className={cn(
                    "absolute top-4 right-5 text-5xl sm:text-6xl font-black leading-none select-none pointer-events-none",
                    "rtl:right-auto rtl:left-5",
                    styles.numberText,
                  )}
                >
                  {number}
                </div>

                <div className="relative z-10 flex flex-col gap-5">
                  <div
                    className={cn(
                      "flex items-center justify-center size-16 sm:size-[4.5rem] rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      styles.iconBg,
                    )}
                  >
                    <Image
                      src={`/images/feature_${index}.png`}
                      alt={text(`feature_${index}_title`)}
                      width={72}
                      height={72}
                      className="size-12 sm:size-14 object-contain"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-text-1">
                      {text(`feature_${index}_title`)}
                    </h3>
                    <p className="mt-2.5 text-sm sm:text-base text-text-3 leading-relaxed">
                      {text(`feature_${index}_description`)}
                    </p>
                  </div>
                </div>
              </div>
            </TransitionBox>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
