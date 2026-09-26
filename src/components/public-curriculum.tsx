"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { FiLock } from "react-icons/fi";
import { HiOutlineClock, HiOutlineChevronDoubleDown } from "react-icons/hi2";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getPublicCurriculum } from "@/lib/public-curriculum";
import { curriculumMessages } from "@/lib/curriculum-messages";

export function PublicCurriculum({ courseId }: { courseId: string }) {
  const locale = useLocale() === "ar" ? "ar" : "en";
  const copy = curriculumMessages[locale];
  const [count, setCount] = useState(10);
  const query = useQuery({
    queryKey: ["public-curriculum", 1, courseId, locale],
    queryFn: ({ signal }) => getPublicCurriculum(courseId, locale, signal),
    enabled: Boolean(courseId),
    retry: false,
    staleTime: 0,
  });
  const sections = query.data || [];
  const number = (value: number) => new Intl.NumberFormat(
    locale === "ar" ? "ar-EG-u-nu-latn" : "en-US-u-nu-latn",
    { maximumFractionDigits: 2 },
  ).format(value);

  if (query.isPending) return (
    <div role="status" aria-label={copy.loading} className="space-y-3">
      <span className="sr-only">{copy.loading}</span>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="h-14 rounded-xl border border-primary/10 bg-clear-ground/60 animate-pulse motion-reduce:animate-none" />
      ))}
    </div>
  );
  if (query.isError) return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-primary/15 p-5 text-center">
      <p className="text-sm text-text-2">{copy.error}</p>
      <Button variant="primaryOutline" onClick={() => void query.refetch()} disabled={query.isFetching}>
        {copy.retry}
      </Button>
    </div>
  );
  if (!sections.length) return <p role="status" className="rounded-xl border border-primary/15 p-5 text-center text-sm text-text-2">{copy.empty}</p>;

  const lessonCount = sections.reduce((total, section) => total + section.lessons.length, 0);
  return (
    <div className="space-y-3">
      <p className="text-sm leading-6 text-text-3">{copy.note}</p>
      <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/15 bg-clear-ground px-3 py-1.5 text-xs font-medium text-text-2">
        <FiLock aria-hidden className="size-4 text-primary" />
        {number(sections.length)} {copy.sections} / {number(lessonCount)} {copy.lessons}
      </div>
      <Accordion type="single" collapsible className="flex w-full flex-col gap-3">
        {sections.slice(0, count).map((section, index) => (
          <AccordionItem key={index} value={"section-" + index}
            className="my-0 overflow-hidden rounded-xl border border-primary/15 bg-clear-ground/80 px-0 py-0 backdrop-blur-sm transition-colors hover:border-primary/30">
            <AccordionTrigger className="px-4 py-3 text-text-1 hover:no-underline sm:py-4">
              <div className="flex min-w-0 items-center gap-3 text-start">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {number(index + 1)}
                </span>
                <span className="break-words text-sm font-semibold sm:text-base">{section.section || copy.untitledSection}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3 pt-0">
              <div className="space-y-1 border-t border-primary/10 pt-3">
                {!section.lessons.length ? <p className="text-sm text-text-3">{copy.sectionEmpty}</p>
                  : section.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex flex-wrap items-start justify-between gap-2 rounded-lg px-2 py-2 text-sm">
                      <div className="flex min-w-0 flex-1 items-start gap-2.5">
                        <FiLock aria-label={copy.locked} className="mt-1 size-4 shrink-0 text-primary" />
                        <p className="min-w-0 break-words text-text-2">{lesson.title || copy.untitledLesson}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-text-3">
                        {lesson.type ? <span>{copy[lesson.type]}</span> : null}
                        <HiOutlineClock aria-hidden className="size-3.5" />
                        <span>{lesson.lessonDuration === null ? copy.durationUnknown
                          : number(lesson.lessonDuration) + " " + copy.minute}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {count < sections.length ? (
        <div className="flex justify-center pt-2">
          <Button onClick={() => setCount(sections.length)} variant="primaryOutline"
            className="gap-2 rounded-full bg-clear-ground/80">
            {copy.showAll}<HiOutlineChevronDoubleDown aria-hidden className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
