"use client";
import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ICourse, ILesson } from "@/types";
import { FiPlayCircle } from "react-icons/fi";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { axiosInstance } from "@/app/lib/utils";
import { getDynamicString } from "@/lib/utils";

interface PathContentProps {
  courses: ICourse[];
}

const PathContent: React.FC<PathContentProps> = ({ courses }) => {
  const text = useTranslations("learningPathPage");
  const locale = useLocale();

  // State to manage course sections for each course
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
    // Check if already loaded or loading
    if (courseSections[courseId]?.loaded || courseSections[courseId]?.loading) {
      return;
    }

    // Set loading state
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
        `/lessons/sectionLessons/${courseId}/public`
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
    <div className="my-4 md:my-8">
      <h3 className="mb-4 md:mb-8">{text("coursesIncluded")}</h3>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        onValueChange={handleAccordionValueChange}
      >
        {courses.map((course, index) => (
          <AccordionItem key={course._id} value={course._id}>
            <AccordionTrigger className="text-left hover:no-underline">
              <Link
                target="_blank"
                href={`/courses/${course._id}`}
                className="hover:underline"
              >
                {" "}
                <h4 className="font-semibold h5 text-base">
                  {index + 1} - {getDynamicString(course.title)}
                </h4>
              </Link>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {courseSections[course._id]?.loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, loadingIndex) => (
                      <div
                        key={loadingIndex}
                        className="h-16 bg-muted animate-pulse rounded-xl"
                      />
                    ))}
                  </div>
                ) : courseSections[course._id]?.loaded ? (
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {courseSections[course._id].sections.map(
                        (section, sectionIndex) => (
                          <AccordionItem
                            key={sectionIndex}
                            value={`${course._id}-${section.section}`}
                          >
                            <AccordionTrigger className="text-left">
                              <div className="flex items-center justify-between w-full">
                                <span className="text-sm">
                                  {section.section}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {section.lessons?.length || 0}{" "}
                                  {text("lessons")}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 ps">
                                {section.lessons?.map((lesson, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between gap-2 py-1 text-xs"
                                  >
                                    <div className="flex items-center gap-1 ">
                                      <FiPlayCircle className="w-4 h-4" />
                                      <p className="flex-1 !text-sm">
                                        {getDynamicString(lesson.title)}
                                      </p>
                                    </div>
                                    <span>
                                      {lesson.lessonDuration}{" "}
                                      {locale === "ar" ? " د" : " min"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-2"
                    asChild
                  >
                    <Link href={`/courses/${course._id}`}>
                      <ChevronRight className="w-4 h-4 " />
                      {text("goToCourse")}
                    </Link>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PathContent;
