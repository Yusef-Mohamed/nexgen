"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const MobileAppHero: React.FC = () => {
  const text = useTranslations("mobileAppHero");
  const locale = useLocale();

  return (
    <section className="container secPadding">
      <div className="px-4 sm:px-8 relative overflow-hidden md:px-16 lg:px-20  rounded-3xl bg-primary-faded">
        <div
          style={{
            filter: "blur(100px)",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
          }}
          className="absolute  bg-primary/50 opacity-90 top-0 left-0 -translate-x-1/4 -translate-y-1/4 size-20"
        ></div>
        <div
          style={{
            filter: "blur(100px)",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
          }}
          className="absolute  dark:bg-purple-400 bg-purple-200 bottom-0 right-0 translate-x-1/4 translate-y-1/4 size-20"
        ></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative z-10 py-10 sm:pt-16 md:py-20 lg:py-[5.5rem]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-0.5 bg-primary"></div>
              <h2 className="text-primary h4 font-medium">
                {text("subtitle")}
              </h2>
            </div>

            {/* Main Heading */}
            <div className="flex flex-col gap-4 relative">
              <h1
                className={cn(
                  "mt-4",
                  locale === "ar" ? "space-y-5" : "space-y-2"
                )}
              >
                <div>{text("headingPart1")} </div>
                <div className="block relative w-fit">
                  <div
                    className={cn(
                      "w-full h-full bg-primary/10 absolute top-0 left-0",
                      locale === "ar" ? "h-[120%]" : "translate-y-[10%]"
                    )}
                  />
                  <span className="text-primary rounded">
                    {text("headingPart2")}
                  </span>
                </div>
                <div>{text("headingPart3")}</div>
              </h1>
            </div>

            <p className="my-6 sm:my-10 !text-base md:!text-xl  text-text-1 max-w-xl">
              {text("description")}
            </p>

            {/* Download Button */}
            <Button size="lg" className="rounded-full w-fit" asChild>
              <a href="#" onClick={(e) => e.preventDefault()}>
                {text("downloadButton")}
              </a>
            </Button>
          </div>
          <div className="flex justify-center items-end">
            <Image
              src="/images/download-app.png"
              alt="Mobile app preview"
              width={1000}
              height={1000}
              className={cn("object-contain w-full max-w-lg", {
                "-scale-x-100": locale === "ar",
              })}
              style={{
                aspectRatio: "1920/1785",
              }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppHero;
