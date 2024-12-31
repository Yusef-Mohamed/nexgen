"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { cn } from "@/lib/utils";
import { ICourse, ILesson } from "@/types";
import { useTranslations } from "next-intl";
import {
  MdMenu,
  MdOutlineAssignment,
  MdPlayCircleOutline,
} from "react-icons/md";
import { PiExam } from "react-icons/pi";
import LessonBody from "./LessonBody";
import QuizBody from "./QuizBody";
import { FaLock } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { useState } from "react";
import AboutCourse from "./AboutCourse";
import CreatePractice from "../../../practice/components/CreatePractice";

const Main = ({
  sections,
  course,
}: {
  sections: {
    section: string;
    lessons: ILesson[];
  }[];
  course: ICourse;
}) => {
  const text = useTranslations("learn");
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const selectedLesson = searchParams.get("lesson");
  const selectedDisplay = searchParams.get("display");
  const lessonTitle = searchParams.get("lessonTitle");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="flex flex-col-reverse gap-8 xl:flex-row">
      <div className="w-full">
        {!selectedLesson && (
          <div className="flex items-center justify-center rounded-md bg-muted aspect-video">
            <h1>{text("select_quiz_or_lesson")}</h1>
          </div>
        )}
        {selectedLesson && selectedDisplay === "lesson" && (
          <LessonBody
            lessonId={selectedLesson}
            lesson={
              sections
                .flatMap((section) => section.lessons)
                .find((lesson) => lesson?._id === selectedLesson) || undefined
            }
          />
        )}
        {selectedLesson && selectedDisplay === "practice" && (
          <CreatePractice lessonId={selectedLesson} courseId={course._id} />
        )}
        {selectedLesson && selectedDisplay === "quiz" ? (
          <QuizBody
            title={lessonTitle || ""}
            id={selectedLesson}
            quizType="lesson"
          />
        ) : selectedDisplay === "final_exam" ? (
          <QuizBody
            title={course.title || ""}
            id={course._id}
            quizType="course"
          />
        ) : (
          <AboutCourse course={course} />
        )}
      </div>
      <aside className="w-full space-y-2 max-w-96">
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          className="gap-1 xl:hidden"
          variant={"outline"}
        >
          {text("menu")}
          <MdMenu />{" "}
        </Button>
        <Accordion
          type="single"
          collapsible
          className={cn("flex-1 w-full xl:block ", {
            "max-xl:hidden": !isOpen,
          })}
        >
          {sections.map((section, index) => (
            <AccordionItem
              className="p-0 border-none"
              key={index}
              value={"item-" + (index + 1)}
            >
              <Button
                variant={"outline"}
                className="flex justify-between gap-4 text-sm text-start md:text-sm lg:text-sm"
                asChild
              >
                <AccordionTrigger>{section.section}</AccordionTrigger>
              </Button>
              <AccordionContent className="p-0 -mt-2 space-y-1 overflow-hidden bg-transparent ps-4 rounded-2xl">
                {section.lessons?.map((lesson, ind) => (
                  <>
                    <Accordion type="single" collapsible>
                      <AccordionItem
                        className="p-0 border-none"
                        key={index}
                        value={"item-" + (index + 1)}
                      >
                        <Button
                          variant={"outline"}
                          className="flex justify-between gap-4 text-sm whitespace-normal text-start md:text-sm low lg:text-sm"
                          asChild
                        >
                          <AccordionTrigger>{lesson.title}</AccordionTrigger>
                        </Button>
                        <AccordionContent className="p-0 -mt-2 space-y-1 overflow-hidden bg-transparent rounded-2xl">
                          <button
                            key={ind}
                            onClick={() => {
                              setSearchParams({
                                lesson: lesson._id,
                                display: "lesson",
                              });
                            }}
                            disabled={!lesson.videoUrl}
                            className={cn(
                              "flex items-center justify-between disabled:cursor-not-allowed   w-full disabled:opacity-50 gap-2 px-4 py-3 rounded-md hover:bg-primary bg-clear-ground hover:text-clear-ground text-start",
                              {
                                "bg-primary text-clear-ground":
                                  selectedLesson === lesson._id &&
                                  selectedDisplay === "lesson",
                              }
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <MdPlayCircleOutline className="w-6 h-6" />
                              {lesson.title}
                            </div>
                            {!lesson.videoUrl && <FaLock />}
                          </button>
                          <button
                            key={ind}
                            onClick={() => {
                              setSearchParams({
                                lesson: lesson._id,
                                display: "quiz",
                                lessonTitle: lesson.title,
                              });
                            }}
                            disabled={!lesson.videoUrl}
                            className={cn(
                              "flex disabled:cursor-not-allowed justify-between items-center disabled:opacity-50 w-full gap-2 px-4 py-3 rounded-md hover:bg-primary bg-clear-ground hover:text-clear-ground text-start",
                              {
                                "bg-primary text-clear-ground":
                                  selectedLesson === lesson._id &&
                                  selectedDisplay === "quiz",
                              }
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <PiExam className="w-6 h-6" />
                              {lesson.title} - {text("quiz")}
                            </div>{" "}
                            {!lesson.videoUrl && <FaLock />}
                          </button>
                          {lesson.isRequireAnalytic && (
                            <button
                              key={ind}
                              onClick={() => {
                                setSearchParams({
                                  lesson: lesson._id,
                                  display: "practice",
                                  lessonTitle: lesson.title,
                                });
                              }}
                              disabled={!lesson.videoUrl}
                              className={cn(
                                "flex disabled:cursor-not-allowed justify-between items-center disabled:opacity-50 w-full gap-2 px-4 py-3 rounded-md hover:bg-primary bg-clear-ground hover:text-clear-ground text-start",
                                {
                                  "bg-primary text-clear-ground":
                                    selectedLesson === lesson._id &&
                                    selectedDisplay === "practice",
                                }
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <MdOutlineAssignment className="w-6 h-6" />
                                {lesson.title} - {text("practice")}
                              </div>{" "}
                              {!lesson.videoUrl && <FaLock />}
                            </button>
                          )}
                          {sections.length - 1 === index &&
                            (section?.lessons?.length || 0) - 1 === ind && (
                              <button
                                key={ind}
                                onClick={() => {
                                  setSearchParams({
                                    display: "final_exam",
                                  });
                                }}
                                disabled={!lesson.videoUrl}
                                className={cn(
                                  "flex disabled:cursor-not-allowed justify-between items-center disabled:opacity-50 w-full gap-2 px-4 py-3 rounded-md hover:bg-primary bg-clear-ground hover:text-clear-ground text-start",
                                  {
                                    "bg-primary text-clear-ground":
                                      selectedDisplay === "final_exam",
                                  }
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <GiGraduateCap className="w-6 h-6" />
                                  {text("final_exam")}
                                </div>{" "}
                                {!lesson.videoUrl && <FaLock />}
                              </button>
                            )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}{" "}
        </Accordion>
      </aside>
    </section>
  );
};

export default Main;
