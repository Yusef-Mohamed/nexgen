import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowRight,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
} from "react-icons/hi2";

const PromoBanner: React.FC = () => {
  const text = useTranslations("promoBanner");
  return (
    <section className="container secPadding">
      <div className="px-4 py-6 text-center md:p-20 bg-primary-faded rounded-xl">
        <div className="flex flex-col items-center justify-center gap-10 mx-auto">
          <h2>{text("heading")}</h2>
          <p
            style={{
              fontWeight: 400,
            }}
            className="h3 text-text-2"
          >
            {text("description")}
          </p>
          <Button size={"lg"} asChild className="sm:w-[20rem] w-[15rem]">
            <Link href={"/sign-up"}>{text("startNow")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
export const PromoBanner2: React.FC = () => {
  const text = useTranslations("promoBanner2");
  return (
    <section className="container secPadding">
      <div className="relative overflow-hidden rounded-3xl bg-primary-faded border border-primary/10 px-4 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div
          aria-hidden
          className="absolute -top-24 -start-20 size-72 rounded-full bg-secondary/25 dark:bg-secondary/35 blur-[110px] opacity-80 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -end-20 size-72 rounded-full bg-primary/20 dark:bg-primary/30 blur-[110px] opacity-80 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--primary)) 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_21rem] lg:items-center">
          <div className="max-w-4xl text-center lg:text-start">
            <h2 className="font-bold leading-tight text-text-1">
              {text("heading")}
            </h2>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-7 text-text-2 max-w-3xl mx-auto lg:mx-0">
              {text("description")}
            </p>
          </div>
          <Button size="lg" asChild className="group w-full rounded-full">
            <Link
              href={"/sign-up"}
              className="flex items-center justify-center gap-2"
            >
              <span>{text("action")}</span>
              <HiOutlineArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
