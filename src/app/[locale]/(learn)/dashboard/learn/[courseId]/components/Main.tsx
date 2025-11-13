"use client";

import useCustomSearchParams from "@/hooks/useSearchParams";
import LessonBody from "./LessonBody";
import QuizBody from "./QuizBody";
import CreatePractice from "../../../../../dashboard/practice/components/CreatePractice";
import { useCourseContext } from "../context/CourseContext";
import MainSkeleton from "./MainSkeleton";
import { useLocale, useTranslations } from "next-intl";
import { FaFileDownload } from "react-icons/fa";
import ImageWithZoom from "@/components/ImageWithZoom";
import { getDynamicString } from "@/lib/utils";
// import CreateCourseReview from "./CourseReview";

const Main = () => {
  const { sections, course, isLoading } = useCourseContext();
  const { searchParams } = useCustomSearchParams();
  const text = useTranslations("learn");
  const locale = useLocale();
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
          Array.isArray(section.lessons) ? section.lessons : []
        )
        .find((lesson) => lesson?._id === selectedLesson)) ||
    undefined;

  // Check if assignment file is an image
  const isImageFile = (url: string) => {
    if (!url) return false;
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
    ];
    const urlLower = url.toLowerCase();
    return imageExtensions.some((ext) => urlLower.includes(ext));
  };
  return (
    <main className="flex flex-col px-2 py-6 lg:px-6 sm:px-4 bg-dash-ground">
      <div className="cardShadow container bg-clear-ground rounded-xl lg:p-12 md:p-8 p-6">
        {selectedLesson && selectedDisplay === "lesson" && (
          <LessonBody lessonId={selectedLesson} lesson={currentLesson} />
        )}
        {selectedLesson && selectedDisplay === "practice" && (
          <div className="space-y-6">
            {currentLesson &&
              (currentLesson.assignmentTitle ||
                currentLesson.assignmentDescription ||
                currentLesson.assignmentFile) && (
                <div className="mb-6 space-y-4">
                  {currentLesson.assignmentTitle && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {getDynamicString(currentLesson.assignmentTitle)}
                      </h2>
                    </div>
                  )}
                  {currentLesson.assignmentDescription && (
                    <div>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {getDynamicString(currentLesson.assignmentDescription)}
                      </p>
                    </div>
                  )}
                  {currentLesson.assignmentFile && (
                    <div className="pt-2">
                      {isImageFile(currentLesson.assignmentFile) ? (
                        <div className="space-y-2">
                          <div className="relative w-full max-w-2xl rounded-lg overflow-hidden border">
                            <ImageWithZoom
                              src={currentLesson.assignmentFile}
                              alt={
                                getDynamicString(
                                  currentLesson.assignmentTitle
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
                          <FaFileDownload className="w-5 h-5 text-primary" />
                          <a
                            href={currentLesson.assignmentFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {locale === "ar"
                              ? "تحميل ملف الواجب"
                              : "Download Assignment File"}
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
          <QuizBody id={selectedLesson} quizType="lesson" />
        ) : (
          selectedDisplay === "final_exam" && (
            <QuizBody id={course._id} quizType="course" />
          )
        )}
        {!selectedDisplay && !selectedLesson && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h1 className="text-foreground">
              {text("welcomeTo")} &quot;{getDynamicString(course.title)}&quot;
            </h1>
            <p className="mt-2 text-muted-foreground">
              {text("pleaseSelectLessonToKeepLearning")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Main;
