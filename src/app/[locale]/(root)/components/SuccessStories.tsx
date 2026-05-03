"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { HiOutlineSparkles, HiOutlineArrowRight } from "react-icons/hi2";
import TransitionBox from "@/components/TransitionBox";
import { cn } from "@/lib/utils";

const SuccessStories: React.FC = () => {
  const text = useTranslations("successStories");
  const commonT = useTranslations("common");
  return (
    <section className="container secPadding">
      <div className="grid gap-8 lg:grid-cols-2 md:gap-12 lg:gap-16 items-center">
        {/* Copy */}
        <TransitionBox
          transitionType="fromLeft"
          fromValue="40%"
          containerClassName="overflow-visible order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-secondary/10 border border-secondary/20">
            <HiOutlineSparkles className="size-4 text-secondary" />
            <span className="text-xs sm:text-sm font-medium text-secondary">
              {text("subHeading")}
            </span>
          </div>

          <h2 className="font-bold text-text-1 leading-tight">
            {text("heading")}
          </h2>

          <p className="my-6 sm:my-8 text-base sm:text-lg leading-7 sm:leading-8 text-text-3">
            {text("description")}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="group">
              <Link
                href={"/sign-up"}
                className="flex items-center gap-2"
              >
                <span>{text("startYourJourney")}</span>
                <HiOutlineArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
            </Button>
          </div>
        </TransitionBox>

        {/* Video tile */}
        <TransitionBox
          transitionType="fromRight"
          fromValue="40%"
          containerClassName="overflow-visible order-1 lg:order-2"
        >
          <div className="relative">
            {/* Backdrop blur */}
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-primary/20 via-secondary/15 to-transparent blur-2xl"
            />

            <Dialog>
              <DialogTrigger aria-hidden="true" asChild>
                <div
                  className={cn(
                    "group relative aspect-[75/45] overflow-hidden rounded-3xl cursor-pointer cardShadow",
                    "transition-transform duration-300 hover:-translate-y-1"
                  )}
                >
                  <Image
                    loading="lazy"
                    src="/images/success.jpeg"
                    alt={text("imageAlt")}
                    width={825}
                    height={500}
                    className="aspect-[75/45] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-clear-ground/30 animate-ping"
                      />
                      <div className="relative flex justify-center items-center size-16 sm:size-20 rounded-full bg-clear-ground/95 backdrop-blur ring-4 ring-clear-ground/30 transition-transform group-hover:scale-110">
                        <AiOutlinePlayCircle className="size-9 sm:size-11 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Caption pill */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                    <div className="px-3 py-1.5 rounded-full bg-clear-ground/95 backdrop-blur text-xs font-semibold text-text-1">
                      {text("watchStory")}
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-primary text-clear-ground text-xs font-semibold">
                      {text("videoDuration")}
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
                  title={text("youtubeTitle")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </DialogContent>
            </Dialog>
          </div>
        </TransitionBox>
      </div>
    </section>
  );
};

export default SuccessStories;
