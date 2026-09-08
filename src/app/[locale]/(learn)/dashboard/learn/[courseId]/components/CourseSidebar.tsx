"use client";

import Logo from "@/components/logo";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { useRouter } from "@/i18n/navigation";
import { cn, getDynamicString } from "@/lib/utils";
import type { ILesson } from "@/types";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowLeft,
  HiOutlineBookOpen,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
  HiOutlinePencilSquare,
  HiOutlinePlayCircle,
  HiOutlineQueueList,
  HiOutlineTrophy,
} from "react-icons/hi2";
import { useCourseContext } from "../context/CourseContext";
import CourseSidebarSkeleton from "./CourseSidebarSkeleton";
import SidebarItemButton from "./SidebarItemButton";
import { isLearningSelectionLocked } from "./unlockLessons";

interface CourseSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
  isCollapsable?: boolean;
}

const getLessonActivityProgress = (lessons: ILesson[], countVideos: boolean) =>
  lessons.reduce(
    (progress, lesson) => {
      if (countVideos) {
        progress.total += 1;
        if (lesson.lessonWatched) progress.completed += 1;
      }

      if (lesson.hasQuiz) {
        progress.total += 1;
        if (lesson.passedExam) progress.completed += 1;
      }

      if (lesson.isRequireAnalytic) {
        progress.total += 1;
        if (lesson.passedAnalyticsTask) progress.completed += 1;
      }

      return progress;
    },
    { completed: 0, total: 0 },
  );

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  className,
  collapsed = false,
  onToggle,
  onNavigate,
  isCollapsable = false,
}) => {
  const {
    sections,
    course,
    courseExam,
    learningSummary,
    totalProgress,
    progressRules,
    canTakeFinalExam,
    passedFinalExam,
    isLoading,
  } = useCourseContext();
  const text = useTranslations("learn");
  const router = useRouter();
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const selectedLesson = searchParams.get("lesson");
  const selectedDisplay = searchParams.get("display");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

  const autoExpandedSection = useMemo(() => {
    if (selectedLesson) {
      return sections.find((section) =>
        section.lessons.some((lesson) => lesson._id === selectedLesson),
      )?.section;
    }

    if (selectedDisplay === "final_exam") {
      return sections.at(-1)?.section;
    }

    return sections[0]?.section;
  }, [sections, selectedDisplay, selectedLesson]);

  const progressPercentage = Math.round(totalProgress ?? 0);

  const toggleSection = (sectionName: string) => {
    setExpandedSections((previous) =>
      previous.includes(sectionName)
        ? previous.filter((section) => section !== sectionName)
        : [...previous, sectionName],
    );
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((previous) =>
      previous.includes(lessonId)
        ? previous.filter((id) => id !== lessonId)
        : [...previous, lessonId],
    );
  };

  const handleLessonChange = (
    lessonId: string,
    display: string,
    title?: string,
  ) => {
    if (
      isLearningSelectionLocked(
        sections.flatMap((section) => section.lessons),
        lessonId,
        display,
        canTakeFinalExam,
      )
    )
      return;
    const params: {
      lesson?: string;
      display: string;
      lessonTitle?: string;
    } = { display };

    if (lessonId) params.lesson = lessonId;
    if (title) params.lessonTitle = title;

    setSearchParams(params);
    onNavigate?.();
  };

  const questionSummary = (count?: number) =>
    Number(count) > 0
      ? Number(count) + " " + text("questions")
      : text("questionCountPending");

  if (isLoading) {
    return (
      <CourseSidebarSkeleton className={className} collapsed={collapsed} />
    );
  }

  if (!course) return null;

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 flex h-screen max-h-screen shrink-0 flex-col border-e border-primary/10 bg-clear-ground transition-[width] duration-300",
        collapsed ? "w-[4.5rem] px-2" : "w-[22rem] max-w-[92vw] px-3",
        className,
      )}
    >
      <div className="flex h-[72px] shrink-0 items-center justify-between gap-2 border-b border-primary/10">
        <Logo size="sm" isIconic={collapsed} />
        {isCollapsable && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={
              collapsed
                ? text("expandCourseContent")
                : text("collapseCourseContent")
            }
            aria-expanded={!collapsed}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 rtl:rotate-180" />
            ) : (
              <PanelLeftClose className="size-4 rtl:rotate-180" />
            )}
          </button>
        )}
      </div>

      {!collapsed && (
        <>
          <div className="shrink-0 space-y-3 py-4">
            <button
              type="button"
              onClick={() => {
                router.push("/dashboard/learn");
                onNavigate?.();
              }}
              className="group inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-text-3 transition-colors hover:text-primary"
            >
              <HiOutlineArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
              {text("backToMyLearning")}
            </button>

            <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-primary-faded p-4">
              <div
                aria-hidden
                className="pointer-events-none absolute -end-12 -top-16 size-32 rounded-full bg-secondary/20 blur-[55px]"
              />
              <div className="relative">
                <div className="mb-3 flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-clear-ground/80 text-primary cardShadowSm">
                    <HiOutlineAcademicCap className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                      {text("learningWorkspace")}
                    </p>
                    <h2 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-text-1">
                      {getDynamicString(course.title)}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-3">{text("courseProgress")}</span>
                  <span className="text-text-1">{progressPercentage}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-clear-ground">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500"
                    style={{ width: progressPercentage + "%" }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-text-3">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineQueueList className="size-3.5 text-primary" />
                    {learningSummary.lessonsCount} {text("lessons")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineClock className="size-3.5 text-secondary" />
                    {learningSummary.totalDuration} {text("minuteAbbr")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3 flex shrink-0 items-center justify-between px-1">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-text-3">
                {text("courseContent")}
              </p>
              <p className="mt-0.5 text-xs text-text-3">
                {learningSummary.sectionsCount} {text("sections")}
              </p>
            </div>
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <HiOutlineBookOpen className="size-5" />
            </span>
          </div>

          <nav
            className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pb-5 pe-1"
            aria-label={text("courseContent")}
          >
            <ol className="space-y-3">
              {sections.map((section, sectionIndex) => {
                const isExpanded =
                  expandedSections.includes(section.section) ||
                  autoExpandedSection === section.section;
                const sectionProgress = getLessonActivityProgress(
                  section.lessons,
                  progressRules.countVideos,
                );
                const sectionPercentage =
                  sectionProgress.total > 0
                    ? Math.round(
                        (sectionProgress.completed / sectionProgress.total) *
                          100,
                      )
                    : 0;

                return (
                  <li
                    key={
                      section.sectionId || section.section + "-" + sectionIndex
                    }
                    className={cn(
                      "overflow-hidden rounded-2xl border bg-background-2 transition-colors",
                      isExpanded
                        ? "border-primary/20"
                        : "border-primary/10 hover:border-primary/20",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.section)}
                      aria-expanded={isExpanded}
                      className="flex w-full cursor-pointer items-center gap-3 p-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
                    >
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-clear-ground text-xs font-black text-primary">
                        {String(sectionIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm font-black leading-5 text-text-1">
                          {section.section ||
                            text("section") + " " + (sectionIndex + 1)}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-[11px] font-medium text-text-3">
                          <span>
                            {sectionProgress.completed}/{sectionProgress.total}{" "}
                            {text("activities")}
                          </span>
                          <span aria-hidden>·</span>
                          <span>
                            {section.lessons.reduce(
                              (total, lesson) =>
                                total + (Number(lesson.lessonDuration) || 0),
                              0,
                            )}{" "}
                            {text("minuteAbbr")}
                          </span>
                        </span>
                        <span className="mt-2 block h-1 overflow-hidden rounded-full bg-muted">
                          <span
                            className="block h-full rounded-full bg-primary/70"
                            style={{ width: sectionPercentage + "%" }}
                          />
                        </span>
                      </span>
                      {isExpanded ? (
                        <HiOutlineChevronUp className="size-4 shrink-0 text-text-3" />
                      ) : (
                        <HiOutlineChevronDown className="size-4 shrink-0 text-text-3" />
                      )}
                    </button>

                    {isExpanded && (
                      <ol className="space-y-2 border-t border-primary/10 bg-clear-ground/60 p-2">
                        {section.lessons.map((lesson, lessonIndex) => {
                          const isLessonExpanded =
                            expandedLessons.includes(lesson._id) ||
                            (selectedLesson === lesson._id &&
                              (selectedDisplay === "quiz" ||
                                selectedDisplay === "practice"));
                          const hasSubItems =
                            lesson.hasQuiz || lesson.isRequireAnalytic;
                          const lessonTitle =
                            getDynamicString(lesson.title) ||
                            text("lesson") + " " + (lessonIndex + 1);
                          const isLocked =
                            lesson.isUnlocked === false || !lesson.videoUrl;
                          const quizTitle =
                            getDynamicString(lesson.examTitle) ||
                            getDynamicString(lesson.quizTitle) ||
                            text("lessonQuiz");
                          const quizAvailable =
                            lesson.examAvailable ?? lesson.hasQuiz;

                          return (
                            <li
                              key={lesson._id}
                              className="space-y-1.5 rounded-xl"
                            >
                              <SidebarItemButton
                                variant={
                                  selectedLesson === lesson._id
                                    ? "primary"
                                    : "none"
                                }
                                title={lessonTitle}
                                icon={
                                  <HiOutlinePlayCircle className="size-5" />
                                }
                                subtitle={[
                                  text("video"),
                                  (Number(lesson.lessonDuration) || 0) +
                                    " " +
                                    text("minuteAbbr"),
                                ].join(" · ")}
                                isFocused={
                                  selectedLesson === lesson._id &&
                                  selectedDisplay === "lesson"
                                }
                                disabled={isLocked}
                                onClick={() => {
                                  handleLessonChange(lesson._id, "lesson");
                                  if (hasSubItems && !isLessonExpanded) {
                                    toggleLesson(lesson._id);
                                  }
                                }}
                                isDone={lesson.lessonWatched}
                                onToggle={
                                  hasSubItems
                                    ? () => toggleLesson(lesson._id)
                                    : undefined
                                }
                                isExpanded={isLessonExpanded}
                              />

                              {hasSubItems && isLessonExpanded && (
                                <div className="space-y-1.5 ps-4">
                                  {lesson.hasQuiz && (
                                    <SidebarItemButton
                                      variant={
                                        selectedLesson === lesson._id &&
                                        selectedDisplay === "quiz"
                                          ? "primary-outline"
                                          : "none"
                                      }
                                      title={quizTitle}
                                      subtitle={[
                                        text("quiz"),
                                        questionSummary(
                                          lesson.examQuestionsNumber,
                                        ),
                                      ].join(" · ")}
                                      icon={
                                        <HiOutlineClipboardDocumentCheck className="size-5" />
                                      }
                                      isFocused={
                                        selectedLesson === lesson._id &&
                                        selectedDisplay === "quiz"
                                      }
                                      isDone={lesson.passedExam}
                                      disabled={isLocked || !quizAvailable}
                                      onClick={() =>
                                        handleLessonChange(
                                          lesson._id,
                                          "quiz",
                                          lessonTitle,
                                        )
                                      }
                                    />
                                  )}

                                  {lesson.isRequireAnalytic && (
                                    <SidebarItemButton
                                      variant={
                                        selectedLesson === lesson._id &&
                                        selectedDisplay === "practice"
                                          ? "primary-outline"
                                          : "none"
                                      }
                                      title={
                                        getDynamicString(
                                          lesson.assignmentTitle,
                                        ) || text("assignment")
                                      }
                                      subtitle={text("assignment")}
                                      icon={
                                        <HiOutlinePencilSquare className="size-5" />
                                      }
                                      isFocused={
                                        selectedLesson === lesson._id &&
                                        selectedDisplay === "practice"
                                      }
                                      isDone={lesson.passedAnalyticsTask}
                                      disabled={
                                        isLocked ||
                                        Boolean(
                                          lesson.hasQuiz && !lesson.passedExam,
                                        )
                                      }
                                      onClick={() =>
                                        handleLessonChange(
                                          lesson._id,
                                          "practice",
                                          lessonTitle,
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="mt-3 rounded-2xl border border-secondary/20 bg-secondary/10 p-2">
              <SidebarItemButton
                variant={selectedDisplay === "final_exam" ? "primary" : "none"}
                title={
                  getDynamicString(courseExam.title) ||
                  getDynamicString(course.examTitle) ||
                  text("final_exam")
                }
                subtitle={
                  courseExam.available
                    ? [
                        text("final_exam"),
                        questionSummary(courseExam.questionsCount),
                      ].join(" · ")
                    : text("examNotConfigured")
                }
                icon={<HiOutlineTrophy className="size-5" />}
                isFocused={selectedDisplay === "final_exam"}
                isDone={passedFinalExam}
                disabled={
                  !courseExam.available ||
                  (!canTakeFinalExam && !passedFinalExam)
                }
                onClick={() => handleLessonChange("", "final_exam")}
              />
              {courseExam.available &&
                !canTakeFinalExam &&
                !passedFinalExam && (
                  <p className="px-3 pb-2 pt-1 text-xs leading-5 text-text-3">
                    {text("finalExamLockedHint")}
                  </p>
                )}
            </div>
          </nav>
        </>
      )}
    </aside>
  );
};

export default CourseSidebar;
