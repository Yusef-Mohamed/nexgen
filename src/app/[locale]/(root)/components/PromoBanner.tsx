import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";

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
    <section className="container flex flex-col items-center justify-between gap-8 text-center lg:text-start lg:gap-16 secPadding lg:flex-row">
      <div className="max-w-4xl">
        <h2 className="mb-4 sm:mb-6">{text("heading")}</h2>
        <p className=" text-text-2">{text("description")}</p>
      </div>
      <Button size={"lg"} asChild className="sm:w-[20rem] w-[15rem]">
        <Link href={"/sign-up"}>{text("action")}</Link>
      </Button>
    </section>
  );
};

export default PromoBanner;
