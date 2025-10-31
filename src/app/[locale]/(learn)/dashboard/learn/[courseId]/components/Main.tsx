"use client";

import useCustomSearchParams from "@/hooks/useSearchParams";
import LessonBody from "./LessonBody";
import QuizBody from "./QuizBody";
import CreatePractice from "../../../../../dashboard/practice/components/CreatePractice";
import { useCourseContext } from "../context/CourseContext";
import MainSkeleton from "./MainSkeleton";
import { useTranslations } from "next-intl";
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
          Array.isArray(section.lessons) ? section.lessons : []
        )
        .find((lesson) => lesson?._id === selectedLesson)) ||
    undefined;

  return (
    <main className="flex flex-col px-2 py-6 lg:px-6 sm:px-4 bg-dash-ground">
      <div className="cardShadow container bg-clear-ground rounded-xl lg:p-12 md:p-8 p-6">
        {selectedLesson && selectedDisplay === "lesson" && (
          <LessonBody lessonId={selectedLesson} lesson={currentLesson} />
        )}
        {selectedLesson && selectedDisplay === "practice" && (
          <CreatePractice lessonId={selectedLesson} courseId={course._id} />
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
              {text("welcomeTo")} &quot;{course.title}&quot;
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
