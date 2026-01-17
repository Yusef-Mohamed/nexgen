"use client";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";

const SuccessStories: React.FC = () => {
  const text = useTranslations("successStories");
  const commonT = useTranslations("common");
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

        <Button size={"lg"} className="block mx-auto w-full">
          <Link href={"/sign-up"}>{text("startYourJourney")}</Link>
        </Button>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="  aspect-75/45 relative overflow-hidden rounded-3xl cursor-pointer">
            <Image
              loading="lazy"
              src="/images/success.jpeg"
              alt="Success story background"
              width={825}
              height={500}
              className="aspect-75/45 w-full object-cover"
            />
            <div className="flex absolute top-0 right-0 justify-center items-center w-full h-full bg-foreground/30">
              <div className="flex justify-center items-center p-3 w-16 h-16 rounded-full sm:w-20 sm:h-20 bg-background/20">
                <AiOutlinePlayCircle className="w-full h-full text-background" />
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="p-0 max-w-4xl bg-transparent border-none">
          <DialogTitle className="sr-only">
            {commonT("dialog.success_stories_title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {commonT("dialog.success_stories_description")}
          </DialogDescription>
          <iframe
            className="w-full aspect-video"
            src="https://www.youtube.com/embed/PrpYc-IaUlk?si=z0s9FHtgJIEuPPTG"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SuccessStories;
