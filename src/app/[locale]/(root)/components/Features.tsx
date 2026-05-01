"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import TransitionBox from "@/components/TransitionBox";

type FeatureTone = "primary" | "secondary" | "gold";

interface FeatureItem {
  index: number;
  number: string;
  tone: FeatureTone;
}

const FEATURES: FeatureItem[] = [
  { index: 1, number: "01", tone: "primary" },
  { index: 2, number: "02", tone: "secondary" },
  { index: 3, number: "03", tone: "gold" },
];

const toneStyles: Record<
  FeatureTone,
  {
    light: React.CSSProperties;
    dark: React.CSSProperties;
    accent: string;
    iconBg: string;
    numberText: string;
    border: string;
  }
> = {
  primary: {
    light: {
      background: "linear-gradient(180deg, #FFF 0%, #BCE4FF 100%)",
      boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
    },
    dark: {
      background: "linear-gradient(180deg, #282828 0%, #003051 100%)",
      boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
    },
    accent: "bg-primary",
    iconBg: "bg-primary/10",
    numberText: "text-primary/30",
    border: "group-hover:border-primary/40",
  },
  secondary: {
    light: {
      background: "linear-gradient(0deg, #E2CEFD 0%, #FFF 100%)",
      boxShadow: "2px 4px 200px 0 #F3EBFF",
    },
    dark: {
      background: "linear-gradient(0deg, #1A003B 0%, #282828 100%)",
      boxShadow: "0 2px 16px 0 rgba(142, 213, 255, 0.24)",
    },
    accent: "bg-secondary",
    iconBg: "bg-secondary/10",
    numberText: "text-secondary/30",
    border: "group-hover:border-secondary/40",
  },
  gold: {
    light: {
      background: "linear-gradient(180deg, #FFF 0%, #B2F7FF 100%)",
      boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
    },
    dark: {
      background: "linear-gradient(180deg, #282828 0%, #00424A 100%)",
      boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
    },
    accent: "bg-gold",
    iconBg: "bg-gold/15",
    numberText: "text-gold/40",
    border: "group-hover:border-gold/40",
  },
};

const Features: React.FC = () => {
  const text = useTranslations("features");
  const theme = useTheme();
  const isDark = theme.resolvedTheme === "dark";

  return (
    <section className="container secPadding">
      {/* Section heading */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-primary">
            Why learners pick us
          </span>
        </div>
        <h2 className="text-text-1 font-bold">
          Everything you need to{" "}
          <span className="text-primary">level up</span>
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
                  "group relative h-full p-6 sm:p-7 rounded-2xl border border-transparent transition-all duration-300",
                  "hover:-translate-y-1.5 hover:shadow-xl",
                  styles.border
                )}
                style={isDark ? styles.dark : styles.light}
              >
                {/* Top accent bar */}
                <div
                  className={cn(
                    "absolute top-0 left-6 right-6 h-1 rounded-b-full opacity-60 group-hover:opacity-100 transition-opacity",
                    styles.accent
                  )}
                />

                {/* Background number */}
                <div
                  className={cn(
                    "absolute top-4 right-5 text-5xl sm:text-6xl font-black leading-none select-none pointer-events-none",
                    styles.numberText
                  )}
                >
                  {number}
                </div>

                <div className="relative z-10 flex flex-col gap-5">
                  <div
                    className={cn(
                      "flex items-center justify-center size-16 sm:size-[4.5rem] rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      styles.iconBg
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
