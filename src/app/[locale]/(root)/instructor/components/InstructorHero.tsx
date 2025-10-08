import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const InstructorHero: React.FC = () => {
  const text = useTranslations("instructorPage.hero");

  return (
    <section className="container items-center grid gap-4 lg:grid-cols-2 md:gap-14 secPadding">
      <div>
        <h2 className="!font-medium"> {text("heading")}</h2>
        <p className="sm:text-lg leading-7 my-6  sm:leading-8">
          {text("description")}
        </p>
        <Button size={"lg"} className="max-sm:w-full">
          <Link href="/sign-up">{text("getStarted")}</Link>
        </Button>
      </div>
      <div>
        <Image
          src="/images/instructor-landing.png"
          alt="Instructor teaching"
          className={cn(
            "w-full h-full rounded-2xl object-cover aspect-[343/450] sm:aspect-[645/450]"
          )}
          width={645}
          height={450}
        />
      </div>
    </section>
  );
};

export default InstructorHero;
