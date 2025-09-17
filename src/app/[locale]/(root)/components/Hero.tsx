import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import TransitionBox from "@/components/TransitionBox";
import { cn } from "@/lib/utils";

const Hero: React.FC = () => {
  const text = useTranslations("hero");
  const locale = useLocale();
  return (
    <section className="pt-8 max-xl:px-4">
      <div className="container px-4 sm:px-8 md:px-16 lg:px-20 py-10 sm:pt-16 md:py-20 lg:py-[5.5rem] rounded-3xl bg-primary-faded lg:items-center gap-6 flex max-lg:flex-col lg:justify-between">
        <TransitionBox
          containerClassName="overflow-visible"
          fromValue="200%"
          transitionType="fromRight"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-0.5 bg-primary"></div>
              <h2 className="text-primary h4 font-medium">
                {text("bestPlatform")}
              </h2>
            </div>
            <h1
              className={cn(
                "mt-4",
                locale === "ar" ? "space-y-5" : "space-y-2"
              )}
            >
              <div className="block">{text("headingPart1")}</div>
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
              <div className="block">{text("headingPart3")}</div>
              <div className="block">{text("headingPart4")}</div>
            </h1>
          </div>
          <p className="my-6 sm:my-10 !text-base md:!text-xl  text-text-1 max-w-xl">
            {text("newDescription")}
          </p>
          <Button className="sm:min-w-52">
            <Link href="/sign-up">{text("getStarted")}</Link>
          </Button>
        </TransitionBox>
        <div className="w-full lg:max-w-[350px] max-w-[70%] max-lg:mx-auto relative aspect-square">
          <TransitionBox
            className="w-full h-full"
            containerClassName="overflow-visible"
            transitionType="fromBottom"
            fromValue="200%"
          >
            <Image
              src="/images/new_hero.png"
              alt="hero"
              className={cn("w-full h-full object-contain", {
                "-scale-x-100": locale === "ar",
              })}
              width={650}
              height={650}
            />
          </TransitionBox>
        </div>
      </div>
    </section>
  );
};

export default Hero;
