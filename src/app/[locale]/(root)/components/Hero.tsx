import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import TransitionBox from "@/components/TransitionBox";
import { cn } from "@/lib/utils";

const Hero: React.FC = () => {
  const text = useTranslations("hero");
  // hero_person.png
  // revenue.png
  // win.png
  // chart.png
  const locale = useLocale();
  return (
    <section className="bg-primary-faded overflow-hidden">
      <div className="container grid items-center gap-6 lg:grid-cols-2">
        <TransitionBox
          className="py-10"
          containerClassName="overflow-visible"
          fromValue="200%"
          transitionType="fromRight"
        >
          <div>
            <h2 className="text-primary-main h3">{text("subHeading")}</h2>
            <h1 className="mt-4 ">{text("heading")}</h1>
          </div>
          <p className="my-6 sm:my-10 sm:text-lg text-text-1">
            {text("description")}
          </p>
          <Button className="sm:min-w-52">
            <Link href="/sign-up"> {text("startNow")}</Link>
          </Button>
        </TransitionBox>
        <div className="w-full lg:max-w-[650px] relative aspect-square">
          <TransitionBox
            className={cn(
              "absolute z-10  top-[8.5%] w-[65%]  aspect-[464/517]",
              {
                "left-[8%]": locale === "ar",
                "right-[8%]": locale !== "ar",
              }
            )}
            containerClassName="overflow-visible"
            transitionType="fromBottom"
            fromValue="200%"
          >
            <Image
              src="/images/hero_person.png"
              alt="hero"
              className={cn("w-full aspect-[464/517]  object-cover", {
                "-scale-x-100": locale === "ar",
              })}
              width={464}
              height={517}
            />
          </TransitionBox>
          <TransitionBox
            className={cn("absolute bottom-[0%] w-[56%] aspect-[400/270]", {
              "right-0": locale === "ar",
              "left-0": locale !== "ar",
            })}
            containerClassName="overflow-visible"
            fromValue="200%"
            transitionType="fromBottom"
          >
            <Image
              src="/images/revenue.png"
              alt="hero"
              width={400}
              height={270}
              className="w-full"
            />
          </TransitionBox>
          <TransitionBox
            className={cn("absolute top-0  w-[20%] aspect-[140/50]", {
              "left-0": locale === "ar",
              "right-0": locale !== "ar",
            })}
            containerClassName="overflow-visible"
            fromValue="200%"
            transitionType="fromLeft"
          >
            <Image src="/images/win.png" alt="hero" width={140} height={50} />
          </TransitionBox>
          <TransitionBox
            className={cn("absolute top-[10%] w-[75%] aspect-[520/190]", {
              " left-0": locale === "ar",
              "right-0": locale !== "ar",
            })}
            containerClassName="overflow-visible"
            fromValue="200%"
            transitionType="fromLeft"
          >
            <Image
              src="/images/chart.png"
              alt="hero"
              className={cn({
                "-scale-x-100": locale !== "ar",
              })}
              width={520}
              height={190}
            />{" "}
          </TransitionBox>
        </div>
      </div>
    </section>
  );
};

export default Hero;
