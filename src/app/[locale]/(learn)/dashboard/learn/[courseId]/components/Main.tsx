"use client";

import CreatePractice from "../../../../../dashboard/practice/components/CreatePractice";
import ImageWithZoom from "@/components/ImageWithZoom";
import { Button } from "@/components/ui/button";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { getDynamicString, isImageFile } from "@/lib/utils";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  HiOutlineArrowRight,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlinePlayCircle,
  HiOutlineQueueList,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { useCourseContext } from "../context/CourseContext";
import LessonBody from "./LessonBody";
import MainSkeleton from "./MainSkeleton";
import QuizBody from "./QuizBody";

const Main = () => {
  const { sections, course, learningSummary, isLoading, error, refetch } =
    useCourseContext();
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const text = useTranslations("learn");
  const selectedLesson = searchParams.get("lesson");
  const selectedDisplay = searchParams.get("display");
  const allLessons = sections.flatMap((section) => section.lessons);
  const currentLesson = allLessons.find(
    (lesson) => lesson?._id === selectedLesson,
  );
  const firstAvailableLesson = allLessons.find(
    (lesson) => lesson.isUnlocked !== false && Boolean(lesson.videoUrl),
  );

  if (isLoading) return <MainSkeleton />;

  if (error || !course) {
    return (
      <main className="relative min-h-[calc(100vh-72px)] overflow-hidden px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -end-24 top-10 size-72 rounded-full bg-secondary/15 blur-[110px]"
        />
        <div className="relative mx-auto flex min-h-[26rem] max-w-3xl items-center justify-center rounded-3xl border border-destructive/15 bg-clear-ground p-6 text-center cardShadow">
          <div className="max-w-md">
            <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <HiOutlineExclamationTriangle className="size-7" />
            </span>
            <h1 className="mt-5 font-black text-text-1">
              {text("courseLoadFailed")}
            </h1>
            <p className="mt-2 leading-7 text-text-3">
              {text("courseLoadFailedDescription")}
            </p>
            <Button
              type="button"
              onClick={refetch}
              className="mt-6 rounded-full"
            >
              {text("retry")}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const hasSelection = Boolean(selectedDisplay);

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden px-3 py-5 sm:px-5 lg:px-6 lg:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -start-32 top-24 size-80 rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-28 top-1/3 size-72 rounded-full bg-secondary/10 blur-[110px]"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {selectedLesson && selectedDisplay === "lesson" && currentLesson && (
          <LessonBody lessonId={selectedLesson} lesson={currentLesson} />
        )}

        {selectedLesson && selectedDisplay === "practice" && (
          <div className="space-y-5">
            <section className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-secondary/10 p-5 sm:p-6 lg:p-8">
              <div className="absolute start-6 end-6 top-0 h-1 rounded-b-full bg-secondary/70" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-clear-ground/70 px-3 py-1.5 text-xs font-bold text-secondary backdrop-blur-sm">
                  <HiOutlineSparkles className="size-4" />
                  {text("assignmentBrief")}
                </div>
                <h1 className="mt-4 font-black text-text-1">
                  {getDynamicString(currentLesson?.assignmentTitle) ||
                    text("assignment")}
                </h1>
                <p className="mt-3 max-w-3xl whitespace-pre-wrap leading-7 text-text-2">
                  {getDynamicString(currentLesson?.assignmentDescription) ||
                    text("assignmentFallbackDescription")}
                </p>

                {currentLesson?.assignmentFile && (
                  <div className="mt-5">
                    {isImageFile(currentLesson.assignmentFile) ? (
                      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-secondary/15 bg-clear-ground">
                        <ImageWithZoom
                          src={currentLesson.assignmentFile}
                          alt={
                            getDynamicString(currentLesson.assignmentTitle) ||
                            text("assignment")
                          }
                          width={960}
                          height={640}
                          className="h-auto w-full object-contain"
                        />
                      </div>
                    ) : (
                      <a
                        href={currentLesson.assignmentFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-secondary/20 bg-clear-ground px-4 py-3 font-bold text-secondary transition-colors hover:bg-secondary/10"
                      >
                        <Download className="size-5" />
                        {text("downloadAssignmentFile")}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </section>

            <div className="rounded-3xl border border-primary/10 bg-clear-ground p-4 cardShadowSm sm:p-6">
              <CreatePractice lessonId={selectedLesson} courseId={course._id} />
            </div>
          </div>
        )}

        {selectedLesson && selectedDisplay === "quiz" && (
          <QuizBody
            id={selectedLesson}
            quizType="lesson"
            contextTitle={currentLesson?.title}
          />
        )}

        {selectedDisplay === "final_exam" && (
          <QuizBody
            id={course._id}
            quizType="course"
            contextTitle={course.examTitle || course.title}
          />
        )}

        {!hasSelection && (
          <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-primary-faded px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -start-24 -top-24 size-72 rounded-full bg-primary/20 blur-[100px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -end-20 size-80 rounded-full bg-secondary/20 blur-[110px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.025]"
            />

            <div className="relative max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-clear-ground/75 px-3 py-1.5 text-xs font-bold text-primary cardShadowSm backdrop-blur-sm">
                <HiOutlineSparkles className="size-4" />
                {text("readyToBegin")}
              </div>
              <h1 className="mt-5 max-w-3xl font-black leading-tight text-text-1">
                {text("welcomeTo")} “{getDynamicString(course.title)}”
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-text-2">
                {getDynamicString(course.courseWelcomeMessage) ||
                  text("learningWorkspaceDescription")}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                {firstAvailableLesson ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={() =>
                      setSearchParams({
                        lesson: firstAvailableLesson._id,
                        display: "lesson",
                      })
                    }
                    className="group rounded-full"
                  >
                    <HiOutlinePlayCircle className="me-2 size-5" />
                    {text("startCourse")}
                    <HiOutlineArrowRight className="ms-2 size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </Button>
                ) : (
                  <p className="rounded-xl border border-primary/15 bg-clear-ground/70 px-4 py-3 text-sm font-bold text-text-2">
                    {text("noLessonsAvailable")}
                  </p>
                )}
                <p className="text-sm font-medium text-text-3">
                  {text("selectLesson")}
                </p>
              </div>
            </div>

            <div className="relative mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                {
                  label: text("sections"),
                  value: learningSummary.sectionsCount,
                  icon: HiOutlineBookOpen,
                  tone: "primary",
                },
                {
                  label: text("lessons"),
                  value: learningSummary.lessonsCount,
                  icon: HiOutlineQueueList,
                  tone: "secondary",
                },
                {
                  label: text("minutes"),
                  value: learningSummary.totalDuration,
                  icon: HiOutlineClock,
                  tone: "primary",
                },
                {
                  label: text("activities"),
                  value:
                    learningSummary.quizCount + learningSummary.assignmentCount,
                  icon: HiOutlineSparkles,
                  tone: "secondary",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-primary/10 bg-clear-ground/80 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25"
                >
                  <span
                    className={
                      stat.tone === "secondary"
                        ? "inline-flex size-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary"
                        : "inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    }
                  >
                    <stat.icon className="size-5" />
                  </span>
                  <p className="mt-4 text-2xl font-black text-text-1">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-bold text-text-3">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Main;
