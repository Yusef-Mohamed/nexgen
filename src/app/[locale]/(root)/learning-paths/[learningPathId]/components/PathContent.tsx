"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { ICourse } from "@/types";
import { Link } from "@/i18n/navigation";
import { getDynamicString } from "@/lib/utils";
import SectionBlock from "@/components/SectionBlock";
import { PublicCurriculum } from "@/components/public-curriculum";
import { HiOutlineArrowRight, HiOutlineBookOpen, HiOutlineQueueList } from "react-icons/hi2";

export default function PathContent({ courses }: { courses: ICourse[] }) {
  const text = useTranslations("learningPathPage");
  const [openCourse, setOpenCourse] = useState("");
  const coursesSummary = (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-clear-ground/70 border border-primary/10 px-3 py-2">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <HiOutlineBookOpen className="size-4" />
      </span>
      <span className="text-xs sm:text-sm font-medium text-text-2">{text("coursesCount", { count: courses.length })}</span>
    </div>
  );
  return (
    <SectionBlock tone="primary" icon={<HiOutlineQueueList className="size-5" />}
      title={text("coursesIncluded")} headerRight={coursesSummary}>
      <Accordion type="single" collapsible value={openCourse} onValueChange={setOpenCourse} className="w-full flex flex-col gap-3">
        {courses.map((course, index) => (
          <AccordionItem key={course._id} value={course._id}
            className="my-0 px-0 py-0 rounded-xl border border-primary/15 bg-clear-ground/80 backdrop-blur-sm overflow-hidden transition-colors hover:border-primary/30">
            <AccordionTrigger className="px-4 py-3 sm:py-4 text-text-1 hover:no-underline">
              <div className="flex w-full items-center gap-3 pe-3 text-start">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-semibold text-sm sm:text-base">{getDynamicString(course.title)}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0">
              <div className="border-t border-primary/10 space-y-4 pt-3">
                {openCourse === course._id ? <PublicCurriculum courseId={course._id} /> : null}
                <div className="flex flex-wrap gap-2">
                  <Button variant="primaryOutline" size="sm" className="rounded-full bg-clear-ground/80 backdrop-blur-sm group" asChild>
                    <Link href={"/courses/" + course._id} target="_blank" rel="noopener noreferrer">
                      {text("goToCourse")}
                      <HiOutlineArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionBlock>
  );
}
