"use client";
import React from "react";
import FeatureCard from "../../../../components/cards/FeatureCard";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

const Features: React.FC = () => {
  const text = useTranslations("features");
  const theme = useTheme();
  const isDark = theme.resolvedTheme === "dark";
  return (
    <section className="container secPadding">
      <div className="grid gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          key={1}
          description={text(`feature_${1}_description`)}
          iconSrc={`/images/feature_${1}.png`}
          title={text(`feature_${1}_title`)}
          style={
            isDark
              ? {
                  background:
                    "linear-gradient(180deg, #282828 0%, #003051 100%)",
                  boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
                }
              : {
                  background: "linear-gradient(180deg, #FFF 0%, #BCE4FF 100%)",
                  boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
                }
          }
        />

        <FeatureCard
          key={2}
          description={text(`feature_${2}_description`)}
          iconSrc={`/images/feature_${2}.png`}
          title={text(`feature_${2}_title`)}
          style={
            isDark
              ? {
                  background: "linear-gradient(0deg, #1A003B 0%, #282828 100%)",
                  boxShadow: "0 2px 16px 0 rgba(142, 213, 255, 0.24)",
                }
              : {
                  background: "linear-gradient(0deg, #E2CEFD 0%, #FFF 100%)",
                  boxShadow: "2px 4px 200px 0 #F3EBFF",
                }
          }
        />

        <FeatureCard
          key={3}
          description={text(`feature_${3}_description`)}
          iconSrc={`/images/feature_${3}.png`}
          title={text(`feature_${3}_title`)}
          style={
            isDark
              ? {
                  background:
                    "linear-gradient(180deg, #282828 0%, #00424A 100%)",
                  boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
                }
              : {
                  background: "linear-gradient(180deg, #FFF 0%, #B2F7FF 100%)",
                  boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
                }
          }
        />
      </div>
    </section>
  );
};

export default Features;
