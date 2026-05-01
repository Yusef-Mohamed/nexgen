"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CAROUSEL_CLASSES } from "@/constants";
import { cn } from "@/lib/utils";
import OneSidedContainer from "@/components/OneSidedContainer";
import SectionHeader from "@/components/SectionHeader";
import CourseCard, { CourseCardSkeleton } from "@/components/cards/CourseCard";
import LearningPath, { LearningPathSkeleton } from "../LearningPath";
import ServiceCard, {
  ServiceCardSkeleton,
} from "@/components/cards/ServiceCard";
import CategoryFilter from "../CategoryFilter";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import {
  useFilteredCourses,
  useFilteredLearningPaths,
  useFilteredServices,
} from "./usePopularData";
import { HiOutlineArrowRight } from "react-icons/hi2";

type Tone = "primary" | "secondary" | "gold";

interface ShellProps {
  eyebrow: string;
  heading: string;
  description?: string;
  tone: Tone;
  href: string;
  cta: string;
  filterSlot: React.ReactNode;
  children: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({
  eyebrow,
  heading,
  description,
  tone,
  href,
  cta,
  filterSlot,
  children,
}) => (
  <section className="py-10 space-y-5">
    <div className="container space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow={eyebrow}
          heading={heading}
          description={description}
          tone={tone}
          className="flex-1"
        />
        <Button
          asChild
          variant="primaryOutline"
          size="default"
          className="group w-fit shrink-0"
        >
          <Link href={href} className="flex items-center gap-2">
            <span>{cta}</span>
            <HiOutlineArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </Button>
      </div>
      {filterSlot}
    </div>
    <OneSidedContainer>{children}</OneSidedContainer>
  </section>
);

const LearningPathsBlock: React.FC = () => {
  const lpText = useTranslations("learningPaths");
  const { categories, selectedCategory, setSelectedCategory, loading } =
    useCategoryFilter(false);
  const { data: items = [], isLoading } = useFilteredLearningPaths(
    selectedCategory?._id,
    10,
    !!selectedCategory,
  );
  return (
    <Shell
      eyebrow="Structured journeys"
      heading={lpText("ourPopularLearningPaths")}
      description={lpText("heading")}
      tone="primary"
      href="/learning-paths"
      cta={lpText("exploreAllPaths")}
      filterSlot={
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          loading={loading}
          enableSearch={false}
        />
      }
    >
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className={CAROUSEL_CLASSES.content}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className={CAROUSEL_CLASSES.item}>
                  <LearningPathSkeleton className={CAROUSEL_CLASSES.card} />
                </CarouselItem>
              ))
            : items.map((p) => (
                <CarouselItem key={p._id} className={CAROUSEL_CLASSES.item}>
                  <LearningPath {...p} className={CAROUSEL_CLASSES.card} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </Shell>
  );
};

const CoursesBlock: React.FC = () => {
  const courseText = useTranslations("popularCourses");
  const { categories, selectedCategory, setSelectedCategory, loading } =
    useCategoryFilter(false);
  const { data: items = [], isLoading } = useFilteredCourses(
    selectedCategory?._id,
    10,
    !!selectedCategory,
  );
  return (
    <Shell
      eyebrow="Hand-picked for you"
      heading={courseText("ourPopularCourses")}
      description={courseText("exploreOurPopularCourses")}
      tone="secondary"
      href="/courses"
      cta={courseText("exploreAllCourses")}
      filterSlot={
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          loading={loading}
          enableSearch={false}
        />
      }
    >
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className={CAROUSEL_CLASSES.content}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className={CAROUSEL_CLASSES.item}>
                  <CourseCardSkeleton className={CAROUSEL_CLASSES.card} />
                </CarouselItem>
              ))
            : items.map((c) => (
                <CarouselItem key={c._id} className={CAROUSEL_CLASSES.item}>
                  <CourseCard {...c} className={CAROUSEL_CLASSES.card} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </Shell>
  );
};

const ServicesBlock: React.FC = () => {
  const serviceText = useTranslations("services");
  const { categories, selectedCategory, setSelectedCategory, loading } =
    useCategoryFilter(false);
  const { data: items = [], isLoading } = useFilteredServices(
    selectedCategory?._id,
    10,
    !!selectedCategory,
  );
  return (
    <Shell
      eyebrow={serviceText("weOffer")}
      heading={serviceText("ourPopularServices")}
      description="Premium plans and ongoing support to keep you moving forward."
      tone="gold"
      href="/services"
      cta={serviceText("exploreAllServices")}
      filterSlot={
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          loading={loading}
          enableSearch={false}
        />
      }
    >
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className={CAROUSEL_CLASSES.content}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className={CAROUSEL_CLASSES.item}>
                  <ServiceCardSkeleton className={CAROUSEL_CLASSES.card} />
                </CarouselItem>
              ))
            : items.map((s) => (
                <CarouselItem key={s._id} className={CAROUSEL_CLASSES.item}>
                  <ServiceCard {...s} className={CAROUSEL_CLASSES.card} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </Shell>
  );
};

const PopularShowcase: React.FC = () => {
  return (
    <div className="relative">
      <LearningPathsBlock />
      <div className={cn("relative", "bg-background-2")}>
        <CoursesBlock />
      </div>
      <ServicesBlock />
    </div>
  );
};

export default PopularShowcase;
