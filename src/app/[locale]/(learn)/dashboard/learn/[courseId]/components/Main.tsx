"use client";

import useCustomSearchParams from "@/hooks/useSearchParams";
import LessonBody from "./LessonBody";
import QuizBody from "./QuizBody";
import CreatePractice from "../../../../../dashboard/practice/components/CreatePractice";
import { useCourseContext } from "../context/CourseContext";
import MainSkeleton from "./MainSkeleton";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import ImageWithZoom from "@/components/ImageWithZoom";
import { getDynamicString, isImageFile } from "@/lib/utils";
// import CreateCourseReview from "./CourseReview";

const Main = () => {
  const { sections, course, isLoading } = useCourseContext();
  const { searchParams } = useCustomSearchParams();
  const text = useTranslations("learn");
  const selectedLesson = searchParams.get("lesson");
  const selectedDisplay = searchParams.get("display");

  if (isLoading) {
    return <MainSkeleton />;
  }

  if (!course || !sections) {
    return null;
  }

  const currentLesson =
    (Array.isArray(sections) &&
      sections
        .flatMap((section) =>
          Array.isArray(section.lessons) ? section.lessons : [],
        )
        .find((lesson) => lesson?._id === selectedLesson)) ||
    undefined;

  return (
    <main className="flex flex-col bg-background px-3 py-6 sm:px-5 lg:px-6">
      <div className="container overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm sm:p-6 md:p-8 lg:p-10">
        {selectedLesson && selectedDisplay === "lesson" && (
          <LessonBody lessonId={selectedLesson} lesson={currentLesson} />
        )}
        {selectedLesson && selectedDisplay === "practice" && (
          <div className="space-y-6">
            {currentLesson &&
              (currentLesson.assignmentTitle ||
                currentLesson.assignmentDescription ||
                currentLesson.assignmentFile) && (
                <div className="mb-6 rounded-2xl border border-primary/10 bg-background-2 p-4 sm:p-5">
                  {currentLesson.assignmentTitle && (
                    <div>
                      <h2 className="mb-2 text-xl font-black text-text-1 sm:text-2xl">
                        {getDynamicString(currentLesson.assignmentTitle)}
                      </h2>
                    </div>
                  )}
                  {currentLesson.assignmentDescription && (
                    <div>
                      <p className="whitespace-pre-wrap leading-7 text-text-3">
                        {getDynamicString(currentLesson.assignmentDescription)}
                      </p>
                    </div>
                  )}
                  {currentLesson.assignmentFile && (
                    <div className="pt-2">
                      {isImageFile(currentLesson.assignmentFile) ? (
                        <div className="space-y-2">
                          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground">
                            <ImageWithZoom
                              src={currentLesson.assignmentFile}
                              alt={
                                getDynamicString(
                                  currentLesson.assignmentTitle,
                                ) || "Assignment image"
                              }
                              width={800}
                              height={600}
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Download className="size-5 text-primary" />
                          <a
                            href={currentLesson.assignmentFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-primary underline-offset-4 hover:underline"
                          >
                            {text("downloadAssignmentFile")}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            <CreatePractice lessonId={selectedLesson} courseId={course._id} />
          </div>
        )}
        {selectedLesson && selectedDisplay === "quiz" ? (
          <QuizBody
            id={selectedLesson}
            quizType="lesson"
            contextTitle={currentLesson?.title}
          />
        ) : (
          selectedDisplay === "final_exam" && (
            <QuizBody
              id={course._id}
              quizType="course"
              contextTitle={course.title}
            />
          )
        )}
        {!selectedDisplay && !selectedLesson && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-background-2 px-6 py-16 text-center">
            <h1 className="text-2xl font-black text-text-1">
              {text("welcomeTo")} &quot;{getDynamicString(course.title)}&quot;
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-text-3">
              {text("pleaseSelectLessonToKeepLearning")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Main;
