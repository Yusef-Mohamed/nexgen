"use client";

import { cn, getDynamicString } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { ChevronDown, ChevronUp, PlayCircle, ArrowLeft } from "lucide-react";
import { FaBook } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { GiGraduateCap } from "react-icons/gi";
import Logo from "@/components/logo";
// Button import removed; replaced lesson items with SidebarItemButton
import SidebarItemButton from "./SidebarItemButton";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { useCourseContext } from "../context/CourseContext";
import CourseSidebarSkeleton from "./CourseSidebarSkeleton";
import { ILesson } from "@/types";

interface CourseSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  isCollapsable?: boolean;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  className,
  collapsed = false,
  onToggle,
  isCollapsable = false,
}) => {
  const { sections, course, isLoading } = useCourseContext();
  const text = useTranslations("learn");
  const router = useRouter();
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const selectedLesson = searchParams.get("lesson");
  const selectedDisplay = searchParams.get("display");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  console.log(sections, course);
  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName]
    );
  };

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
    } catch (error) {
      console.error("Error changing lesson:", error);
    }
  };

  const isLessonActive = (lessonId: string, display: string) => {
    return selectedLesson === lessonId && selectedDisplay === display;
  };

  const calculateSectionProgress = (lessons: ILesson[]) => {
    let completed = 0;
    let total = 0;
    lessons.forEach((l) => {
      if (l.lessonWatched) {
        completed++;
      }
      if (l.hasQuiz) {
        if (l.passedExam) {
          completed++;
        }
        total++;
      }
      if (l.isRequireAnalytic) {
        if (l.passedAnalyticsTask) {
          completed++;
        }
        total++;
      }
      total++;
    });
    return `${completed}/${total}`;
  };

  const calculateSectionDuration = (lessons: ILesson[]) => {
    const totalMinutes = lessons.reduce(
      (sum, lesson) => sum + (lesson.lessonDuration || 0),
      0
    );
    return `${totalMinutes} min`;
  };

  if (isLoading) {
    return (
      <CourseSidebarSkeleton className={className} collapsed={collapsed} />
    );
  }

  if (!course || !sections) {
    return null;
  }

  return (
    <aside
      className={cn(
        "py-4 pt-0 flex flex-col bg-clear-ground h-screen overflow-auto max-h-screen top-0 sticky transition-all duration-300",
        collapsed ? "w-16 px-2 pt-4" : "w-[28rem] px-3 sm:px-6",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header with Logo and Collapsible Button */}
        <div className="flex justify-between h-[76px] items-center flex-wrap mb-4 gap-4">
          <Logo size="sm" isIconic={collapsed} />

          {isCollapsable && (
            <button
              onClick={onToggle}
              className="w-12 h-12 p-0 flex items-center justify-center rounded-full"
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="43"
                  height="43"
                  rx="21.5"
                  stroke="currentColor"
                  className="stroke-primary"
                />
                <path
                  d="M13 22H31M13 16H31M19 28H31"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {!collapsed && (
          <>
            {/* Back to Learning Button */}
            <button
              onClick={() => router.push("/dashboard/learn")}
              className="flex items-center gap-3 px-4 py-3 mb-4 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <div className="flex items-center justify-center size-11 border-foreground rounded-full border">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium">{text("backToMyLearning")}</span>
            </button>

            {/* Course Sections */}
            <nav>
              <ul className="space-y-5">
                {sections.map((section, sectionIndex) => {
                  const isExpanded = expandedSections.includes(section.section);

                  return (
                    <li key={section.section} className="space-y-4">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.section)}
                        className={cn(
                          "w-full bg-primary/10 border border-primary/20 flex items-center justify-between p-4 rounded-lg transition-all"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FaBook className="w-10 h-10 text-primary flex-shrink-0" />
                          {
                            <div className="flex-1 min-w-0 text-left">
                              <div className="font-semibold text-lg truncate">
                                {section.section}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {calculateSectionProgress(section.lessons)} |{" "}
                                {calculateSectionDuration(section.lessons)}
                              </div>
                            </div>
                          }
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </button>

                      {/* Lessons List */}
                      {isExpanded && (
                        <ul className="space-y-1 mt-1">
                          {section.lessons.map((lesson, lessonIndex) => {
                            const isLastLesson =
                              sectionIndex === sections.length - 1 &&
                              lessonIndex === section.lessons.length - 1;

                            return (
                              <li key={lesson._id} className="space-y-4">
                                {/* Video Lesson */}
                                <SidebarItemButton
                                  title={getDynamicString(lesson.title)}
                                  Icon={PlayCircle}
                                  subtitle={`${text("video")} | ${
                                    lesson.lessonDuration
                                  } ${text("minuteAbbr")}`}
                                  isFocused={isLessonActive(
                                    lesson._id,
                                    "lesson"
                                  )}
                                  disabled={!lesson.videoUrl}
                                  onClick={() =>
                                    handleLessonChange(lesson._id, "lesson")
                                  }
                                  isDone={lesson.lessonWatched}
                                />

                                {/* Quiz */}
                                {lesson.hasQuiz && (
                                  <SidebarItemButton
                                    title={lesson.quizTitle || "FIXED"}
                                    subtitle={`${text("quiz")} | ${
                                      lesson.examQuestionsNumber
                                    } ${text("questions")}`}
                                    Icon={PiExam}
                                    isFocused={isLessonActive(
                                      lesson._id,
                                      "quiz"
                                    )}
                                    isDone={lesson.passedExam}
                                    disabled={!lesson.videoUrl}
                                    onClick={() =>
                                      handleLessonChange(
                                        lesson._id,
                                        "quiz",
                                        getDynamicString(lesson.title)
                                      )
                                    }
                                  />
                                )}

                                {/* Practice (if required) */}
                                {lesson.isRequireAnalytic && (
                                  <SidebarItemButton
                                    title={
                                      getDynamicString(
                                        lesson.assignmentTitle
                                      ) || "FIXED"
                                    }
                                    subtitle={`${text("assignment")}`}
                                    Icon={MdOutlineAssignment}
                                    isFocused={isLessonActive(
                                      lesson._id,
                                      "practice"
                                    )}
                                    isDone={lesson.passedAnalyticsTask}
                                    disabled={
                                      !lesson.videoUrl || !lesson.passedExam
                                    }
                                    onClick={() =>
                                      handleLessonChange(
                                        lesson._id,
                                        "practice",
                                        getDynamicString(lesson.title)
                                      )
                                    }
                                  />
                                )}

                                {/* Final Exam (only for last lesson) */}
                                {isLastLesson && (
                                  <SidebarItemButton
                                    title={text("final_exam")}
                                    subtitle={`${text("final_exam")} | ${
                                      course?.examQuestionsNumber
                                    } ${text("questions")}`}
                                    Icon={GiGraduateCap}
                                    isFocused={selectedDisplay === "final_exam"}
                                    disabled={
                                      // !lesson.videoUrl || !lesson.passedExam
                                      !lesson.videoUrl
                                    }
                                    onClick={() =>
                                      handleLessonChange("", "final_exam")
                                    }
                                  />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </>
        )}
      </div>
    </aside>
  );
};

export default CourseSidebar;
