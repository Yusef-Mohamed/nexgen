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
import { ILesson, ISection } from "@/types";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useParams } from "next/navigation";
import { FiPlayCircle } from "react-icons/fi";
import { useAuth } from "@/components/auth-provider";
async function getSections(
  courseId: string,
  token: string
): Promise<ISection[]> {
  const axiosInstance = createClientAxiosInstance();

  try {
    const sectionsRes = await axiosInstance.get(`/sections/${courseId}/course`);
    const sections = sectionsRes.data.data as ISection[];
    const sectionsWithLessons = await Promise.all(
      sections.map(async (section) => {
        try {
          const lessonsRes = await axiosInstance.get(
            `/lessons/sectionLessons/${courseId}/${section._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const lessons = lessonsRes.data.data as ILesson[];
          return {
            ...section,
            lessons,
          };
        } catch (e) {
          console.log(e);
          return {
            ...section,
            lessons: [],
          };
        }
      })
    );

    return sectionsWithLessons;
  } catch (error) {
    console.error("Error fetching sections or lessons:", error);
    return [];
  }
}
const FAQ: React.FC = () => {
  const text = useTranslations("coursePage");
  const [count, setCount] = useState(10);
  const [sections, setSections] = useState<ISection[]>([]);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const locale = useLocale();
  const { token } = useAuth();
  useEffect(() => {
    setLoading(true);
    getSections(courseId as string, token).then((sections) => {
      setSections(sections);
      setLoading(false);
    });
  }, []);
  return (
    <div className="my-4 md:my-8">
      <h3 className="mb-4 md:mb-8">{text("courseContent")}</h3>
      <Accordion type="single" collapsible className="flex-1 w-full">
        {sections.reverse().map((section, index) => (
          <AccordionItem key={index} value={section._id}>
            <AccordionTrigger>{section.title}</AccordionTrigger>
            <AccordionContent>
              {section.lessons?.map((lesson, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 py-1 text-sm"
                >
                  <div className="flex items-center gap-1 ">
                    <FiPlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <p className="flex-1">{lesson.title}</p>
                  </div>
                  <span>
                    {lesson.lessonDuration} {locale === "ar" ? " د" : " min"}
                  </span>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}{" "}
        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-16 my-4 border bg-muted animate-pulse rounded-xl"
            />
          ))}
        {count < sections.length && (
          <Button
            onClick={() => setCount(sections.length)}
            className="block w-64 mx-auto mt-4"
            size={"lg"}
            variant={"outline"}
          >
            {text("displayMore")}{" "}
          </Button>
        )}
      </Accordion>
    </div>
  );
};

export default FAQ;
