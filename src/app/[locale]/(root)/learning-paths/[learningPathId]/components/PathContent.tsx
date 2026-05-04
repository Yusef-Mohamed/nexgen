"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ICourse, ILesson } from "@/types";
import { FiPlayCircle } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { axiosInstance } from "@/app/lib/utils";
import { getDynamicString } from "@/lib/utils";
import SectionBlock from "@/components/SectionBlock";
import {
  HiOutlineArrowRight,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineQueueList,
} from "react-icons/hi2";

interface PathContentProps {
  courses: ICourse[];
}

const PathContent: React.FC<PathContentProps> = ({ courses }) => {
  const text = useTranslations("learningPathPage");
  const coursesSummary = (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-clear-ground/70 border border-primary/10 px-3 py-2">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <HiOutlineBookOpen className="size-4" />
      </span>
      <span className="text-xs sm:text-sm font-medium text-text-2">
        {text("coursesCount", { count: courses.length })}
      </span>
    </div>
  );

  const [courseSections, setCourseSections] = useState<
    Record<
      string,
      {
        sections: { section: string; lessons: ILesson[] }[];
        loading: boolean;
        loaded: boolean;
      }
    >
  >({});

  const fetchCourseContent = async (courseId: string) => {
    if (courseSections[courseId]?.loaded || courseSections[courseId]?.loading) {
      return;
    }

    setCourseSections((prev) => ({
      ...prev,
      [courseId]: {
        sections: [],
        loading: true,
        loaded: false,
      },
    }));

    try {
      const sectionsRes = await axiosInstance.get(
        `/lessons/sectionLessons/${courseId}/public`,
      );

      setCourseSections((prev) => ({
        ...prev,
        [courseId]: {
          sections: sectionsRes.data.data || [],
          loading: false,
          loaded: true,
        },
      }));
    } catch (error) {
      console.error("Error fetching course content:", error);
      setCourseSections((prev) => ({
        ...prev,
        [courseId]: {
          sections: [],
          loading: false,
          loaded: true,
        },
      }));
    }
  };

  const handleAccordionValueChange = (value: string) => {
    if (value) {
      fetchCourseContent(value);
    }
  };

  return (
    <SectionBlock
      tone="primary"
      icon={<HiOutlineQueueList className="size-5" />}
      title={text("coursesIncluded")}
      headerRight={coursesSummary}
    >
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col gap-3"
        onValueChange={handleAccordionValueChange}
      >
        {courses.map((course, index) => (
          <AccordionItem
            key={course._id}
            value={course._id}
            className="my-0 px-0 py-0 rounded-xl border border-primary/15 bg-clear-ground/80 backdrop-blur-sm overflow-hidden transition-colors hover:border-primary/30"
          >
            <AccordionTrigger className="px-4 py-3 sm:py-4 text-text-1 hover:no-underline">
              <div className="flex w-full items-center gap-3 pe-3 text-start">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-semibold text-sm sm:text-base">
                  {getDynamicString(course.title)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0">
              <div className="border-t border-primary/10 space-y-4">
                {courseSections[course._id]?.loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, loadingIndex) => (
                      <div
                        key={loadingIndex}
                        className="h-14 border border-primary/10 bg-clear-ground/60 animate-pulse rounded-xl"
                      />
                    ))}
                  </div>
                ) : courseSections[course._id]?.loaded ? (
                  <Accordion type="single" collapsible className="space-y-2">
                    {courseSections[course._id].sections.map(
                      (section, sectionIndex) => (
                        <AccordionItem
                          key={sectionIndex}
                          value={`${course._id}-${section.section}`}
                          className="rounded-xl border border-secondary/15 bg-secondary/5 px-0 overflow-hidden"
                        >
                          <AccordionTrigger className="px-3 text-start hover:no-underline">
                            <div className="flex items-center justify-between gap-3 w-full">
                              <span className="text-sm font-medium text-text-1">
                                {section.section}
                              </span>
                              <span className="shrink-0 rounded-full bg-clear-ground px-2 py-1 text-xs text-text-3 border border-secondary/10">
                                {section.lessons?.length || 0} {text("lessons")}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-3 pt-3">
                            <div className="border-t border-secondary/10 pt-2 space-y-1">
                              {section.lessons?.map((lesson, lessonIndex) => (
                                <div
                                  key={lessonIndex}
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
                                      {lesson.lessonDuration}{" "}
                                      {text("minuteAbbr")}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ),
                    )}
                  </Accordion>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primaryOutline"
                    size="sm"
                    className="rounded-full bg-clear-ground/80 backdrop-blur-sm group"
                    asChild
                  >
                    <Link href={`/courses/${course._id}`} target="_blank">
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
};

export default PathContent;
