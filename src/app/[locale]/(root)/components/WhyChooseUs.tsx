"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";
const getCardStyle = (index: number, isDark: boolean) => {
  if (index === 0) {
    return isDark
      ? {
          background: "linear-gradient(180deg, #282828 0%, #003051 100%)",
          boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
        }
      : {
          background: "linear-gradient(180deg, #FFF 0%, #BCE4FF 100%)",
          boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
        };
  } else if (index === 1) {
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
const WhyChooseUs: React.FC = () => {
  const text = useTranslations("whyChooseUs");
  const theme = useTheme();
  const isDark = theme.resolvedTheme === "dark";
  // why_chose_us_1.png
  return (
    <section className="container grid gap-8 md:gap-12 lg:gap-24 lg:grid-cols-2">
      <div className="order-2 lg:order-1">
        <div className="flex flex-col w-full font-semibold">
          <h2 className="h4">{text("heading")}</h2>
          <h3 className="mt-6 h2">{text("subHeading")}</h3>
        </div>
        <div className="mt-12 space-y-8 max-md:mt-10 max-md:space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 md:gap-6 md:p-6 md:rounded-2xl rounded-xl"
              style={getCardStyle(index, isDark)}
            >
              <Image
                src={`/images/why_chose_us_${index + 1}.png`}
                width={200}
                height={200}
                alt={text(`case_${index + 1}_title`)}
                className="w-20 rounded-lg md:w-24 md:h-24 aspect-square"
              />{" "}
              <div>
                <h4>{text(`case_${index + 1}_title`)}</h4>
                <p className="mt-3 text-text-3">
                  {text(`case_${index + 1}_description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[32px]">
        <Image
          src="/images/why_chose_us.png"
          alt={text("heading")}
          height={1000}
          width={1000}
          className="aspect-[66/69] w-full object-cover"
        />
      </div>
    </section>
  );
};

export default WhyChooseUs;
