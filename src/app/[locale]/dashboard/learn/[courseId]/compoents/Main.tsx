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
  MdOutlineErrorOutline,
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

  const currentLesson =
    (Array.isArray(sections) &&
      sections
        .flatMap((section) =>
          Array.isArray(section.lessons) ? section.lessons : []
        )
        .find((lesson) => lesson?._id === selectedLesson)) ||
    undefined;
  // Add safety check for lesson transitions
  const handleLessonChange = (
    lessonId: string,
    display: string,
    title?: string
  ) => {
    try {
      const params: { lesson?: string; display: string; lessonTitle?: string } =
        {
          display,
        };

      if (lessonId) {
        params.lesson = lessonId;
      }

      if (title) {
        params.lessonTitle = title;
      }

      setSearchParams(params);
      setIsOpen(false); // Close mobile menu after selection
    } catch (error) {
      console.error("Error changing lesson:", error);
    }
  };

  return (
    <section className="flex flex-col-reverse gap-8 xl:flex-row">
      <div className="w-full">
        {!selectedLesson && (
          <div className="flex justify-center items-center rounded-md bg-muted aspect-video">
            <h1>{text("select_quiz_or_lesson")}</h1>
          </div>
        )}
        {selectedLesson && selectedDisplay === "lesson" && (
          <LessonBody lessonId={selectedLesson} lesson={currentLesson} />
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
      <aside className="space-y-2 w-full max-w-96">
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
          className={cn("flex-1 w-full xl:block", {
            "max-xl:hidden": !isOpen,
          })}
        >
          {Array.isArray(sections) &&
            sections.map((section, index) => (
              <AccordionItem
                className="p-0 border-none"
                key={index}
                value={"item-" + (index + 1)}
              >
                <Button
                  variant={"outline"}
                  className="flex gap-4 justify-between text-sm text-start md:text-sm lg:text-sm"
                  asChild
                >
                  <AccordionTrigger className="whitespace-normal">
                    {section.section}
                  </AccordionTrigger>
                </Button>
                <AccordionContent className="overflow-hidden p-0 -mt-2 space-y-1 bg-transparent rounded-2xl ps-4">
                  {Array.isArray(section.lessons) &&
                    section.lessons?.map((lesson, ind) => {
                      if (!lesson) return null;
                      return (
                        <>
                          <Accordion type="single" collapsible>
                            <AccordionItem
                              className="p-0 border-none"
                              key={index}
                              value={"item-" + (index + 1)}
                            >
                              <Button
                                variant={"outline"}
                                className="flex gap-4 justify-between text-sm whitespace-normal text-start md:text-sm low lg:text-sm"
                                asChild
                              >
                                <AccordionTrigger className="whitespace-normal">
                                  {lesson.title}
                                </AccordionTrigger>
                              </Button>
                              <AccordionContent className="overflow-hidden p-0 -mt-2 space-y-1 bg-transparent rounded-2xl">
                                <button
                                  key={ind}
                                  onClick={() =>
                                    handleLessonChange(lesson._id, "lesson")
                                  }
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
                                  <div className="flex gap-2 items-center">
                                    <MdPlayCircleOutline className="w-6 h-6" />
                                    {lesson.title}
                                  </div>
                                  {!lesson.videoUrl && <FaLock />}
                                </button>
                                <button
                                  key={ind}
                                  onClick={() =>
                                    handleLessonChange(
                                      lesson._id,
                                      "quiz",
                                      lesson.title
                                    )
                                  }
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
                                  <div className="flex gap-2 items-center">
                                    <PiExam className="w-6 h-6" />
                                    {lesson.title} - {text("quiz")}
                                  </div>{" "}
                                  {!lesson.videoUrl && <FaLock />}
                                  {lesson.videoUrl && !lesson.passedExam && (
                                    <MdOutlineErrorOutline className="text-destructive" />
                                  )}
                                </button>
                                {lesson.isRequireAnalytic && (
                                  <button
                                    key={ind}
                                    onClick={() => {
                                      handleLessonChange(
                                        lesson._id,
                                        "practice",
                                        lesson.title
                                      );
                                    }}
                                    disabled={
                                      !lesson.videoUrl || !lesson.passedExam
                                    }
                                    className={cn(
                                      "flex disabled:cursor-not-allowed justify-between items-center disabled:opacity-50 w-full gap-2 px-4 py-3 rounded-md hover:bg-primary bg-clear-ground hover:text-clear-ground text-start",
                                      {
                                        "bg-primary text-clear-ground":
                                          selectedLesson === lesson._id &&
                                          selectedDisplay === "practice",
                                      }
                                    )}
                                  >
                                    <div className="flex gap-2 items-center">
                                      <MdOutlineAssignment className="w-6 h-6" />
                                      {lesson.title} - {text("practice")}
                                    </div>{" "}
                                    {!lesson.videoUrl && <FaLock />}{" "}
                                    {lesson.videoUrl &&
                                      lesson.passedExam &&
                                      !lesson.passedAnalyticsTask && (
                                        <MdOutlineErrorOutline className="text-destructive" />
                                      )}
                                  </button>
                                )}
                                {sections.length - 1 === index &&
                                  (section?.lessons?.length || 0) - 1 ===
                                    ind && (
                                    <button
                                      key={ind}
                                      onClick={() => {
                                        handleLessonChange("", "final_exam");
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
                                      <div className="flex gap-2 items-center">
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
                      );
                    })}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </aside>
    </section>
  );
};

export default Main;
