"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ILesson } from "@/types";
import { useParams } from "next/navigation";
import { FiPlayCircle } from "react-icons/fi";
import {
  HiOutlineQueueList,
  HiOutlineClock,
  HiOutlineChevronDoubleDown,
} from "react-icons/hi2";
import { axiosInstance } from "@/app/lib/utils";
import { getDynamicString } from "@/lib/utils";
import SectionBlock from "@/components/SectionBlock";

async function getSections(courseId: string): Promise<
  {
    section: string;
    lessons: ILesson[];
  }[]
> {
  try {
    const sectionsRes = await axiosInstance.get(
      `/lessons/sectionLessons/${courseId}/public`,
    );

    return sectionsRes.data.data;
  } catch (error) {
    console.error("Error fetching sections or lessons:", error);
    return [];
  }
}

const CourseContent: React.FC = () => {
  const text = useTranslations("coursePage");
  const [count, setCount] = useState(10);
  const [sections, setSections] = useState<
    {
      section: string;
      lessons: ILesson[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const locale = useLocale();

  useEffect(() => {
    let cancelled = false;
    getSections(courseId as string).then((sections) => {
      if (cancelled) return;
      setSections(sections);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const totalLessons = sections.reduce(
    (acc, s) => acc + (s.lessons?.length || 0),
    0,
  );
  const sectionsSummary =
    !loading && totalLessons > 0 ? (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-clear-ground border border-primary/15 cardShadowSm">
        <FiPlayCircle className="size-4 text-primary" />
        <span className="text-xs sm:text-sm font-medium text-text-2">
          {sections.length} {locale === "ar" ? "أقسام" : "sections"} ·{" "}
          {totalLessons} {locale === "ar" ? "درس" : "lessons"}
        </span>
      </div>
    ) : null;

  return (
    <SectionBlock
      tone="primary"
      title={text("courseContent")}
      icon={<HiOutlineQueueList className="size-5" />}
      headerRight={sectionsSummary}
    >
      <Accordion
        type="single"
        collapsible
        className="flex-1 w-full flex flex-col gap-3"
      >
        {sections.slice(0, count).map((section, index) => (
          <AccordionItem
            key={index}
            value={section.section}
            className="my-0 px-0 py-0 rounded-xl border border-primary/15 bg-clear-ground/80 backdrop-blur-sm overflow-hidden transition-colors hover:border-primary/30"
          >
            <AccordionTrigger className="px-4 py-3 sm:py-4 text-text-1 hover:no-underline">
              <div className="flex items-center gap-3 text-start">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-sm sm:text-base">
                  {section.section}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3 pt-0">
              <div className="border-t border-primary/10 pt-3 space-y-1">
                {section.lessons?.map((lesson, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 py-2 px-2 rounded-lg text-sm transition-colors hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FiPlayCircle className="size-4 text-primary shrink-0" />
                      <p className="truncate text-text-2">
                        {getDynamicString(lesson.title)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-3 shrink-0">
                      <HiOutlineClock className="size-3.5" />
                      <span>
                        {lesson.lessonDuration}
                        {locale === "ar" ? " د" : " min"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-14 border border-primary/10 bg-clear-ground/60 animate-pulse rounded-xl"
            />
          ))}

        {!loading && count < sections.length && (
          <div className="flex justify-center pt-2">
            <Button
              onClick={() => setCount(sections.length)}
              variant="primaryOutline"
              size="lg"
              className="bg-clear-ground/80 backdrop-blur-sm rounded-full group"
            >
              <span className="flex items-center gap-2">
                {text("displayMore")}
                <HiOutlineChevronDoubleDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </span>
            </Button>
          </div>
        )}
      </Accordion>
    </SectionBlock>
  );
};

export default CourseContent;
