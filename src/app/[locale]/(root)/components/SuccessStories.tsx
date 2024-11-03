import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";

const SuccessStories: React.FC = () => {
  const text = useTranslations("successStories");
  return (
    <section className="container grid gap-4 lg:grid-cols-2 md:gap-14 secPadding">
      <div className="order-2 lg:order-1">
        <div>
          <h4 className="text-primary-main">{text("subHeading")}</h4>
          <h2 className="mt-1.5 sm:mt-4">{text("heading")}</h2>
        </div>
        <p className="my-4 text-lg leading-7 text-justify sm:my-10 sm:text-xl sm:leading-8 text-text-3">
          {text("description")}
        </p>

        <Button size={"lg"} className="block w-full mx-auto">
          <Link href={"/sign-up"}>{text("startYourJourney")}</Link>
        </Button>
      </div>
      <div className="  aspect-[75/45] relative overflow-hidden rounded-3xl">
        <Image
          loading="lazy"
          src="/images/success.jpeg"
          alt="Success story background"
          width={825}
          height={500}
          className="aspect-[75/45] w-full object-cover"
        />
        <div className="absolute top-0 right-0 flex items-center justify-center w-full h-full bg-foreground/30">
          <div className="flex items-center justify-center w-16 h-16 p-3 rounded-full sm:w-20 sm:h-20 bg-background/20">
            <AiOutlinePlayCircle className="w-full h-full text-background" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
