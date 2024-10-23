import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const Hero: React.FC = () => {
  const text = useTranslations("hero");
  return (
    <section className="bg-primary-faded ">
      <div className="container grid items-center gap-6 lg:grid-cols-2">
        <div className="py-10">
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
        </div>
        <Image src="/images/hero.png" alt="hero" width={656} height={468} />
      </div>
    </section>
  );
};

export default Hero;
