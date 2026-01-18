"use client";

import { cn, getDynamicString } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Logo from "@/components/logo";
// Button import removed; replaced lesson items with SidebarItemButton
import SidebarItemButton from "./SidebarItemButton";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { useCourseContext } from "../context/CourseContext";
import CourseSidebarSkeleton from "./CourseSidebarSkeleton";
import { ILesson } from "@/types";
import Image from "next/image";

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
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

  // Auto-expand based on active lesson/display
  useEffect(() => {
    if (!sections || sections.length === 0) return;

    if (selectedLesson) {
      sections.forEach((section) => {
        const hasLesson = section.lessons.some((l) => l._id === selectedLesson);
        if (hasLesson) {
          // Open the section
          setExpandedSections((prev) =>
            prev.includes(section.section) ? prev : [...prev, section.section]
          );

          // Open the lesson if it has sub-items (quiz/practice)
          if (selectedDisplay === "quiz" || selectedDisplay === "practice") {
            setExpandedLessons((prev) =>
              prev.includes(selectedLesson) ? prev : [...prev, selectedLesson]
            );
          }
        }
      });
    } else if (selectedDisplay === "final_exam") {
      // Open the last section
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        setExpandedSections((prev) =>
          prev.includes(lastSection.section) ? prev : [...prev, lastSection.section]
        );
      }
    }
  }, [sections, selectedLesson, selectedDisplay]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const openSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName) ? prev : [...prev, sectionName]
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
  console.log(sections);
  return (
    <aside
      className={cn(
        "py-4 pt-0 flex flex-col bg-background-2 h-screen overflow-auto max-h-screen top-0 sticky transition-all duration-300",
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
              className="flex items-center gap-3 px-4 py-3 mb-6 text-foreground hover:bg-white hover:shadow-sm rounded-2xl transition-all cursor-pointer"
            >
              <div className="flex items-center justify-center size-10 border-gray-200 rounded-full border bg-white shadow-sm">
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </div>
              <span className="font-bold text-gray-700">{text("backToMyLearning")}</span>
            </button>

            {/* Course Sections */}
            <nav className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <ul className="space-y-6">
                {sections.map((section, sectionIndex) => {
                  const isExpanded = expandedSections.includes(section.section);

                  return (
                    <li
                      key={section.section}
                      onClick={() => openSection(section.section)}
                      className={
                        cn("space-y-4 p-4 border bg-primary/5 border-primary/30 rounded-2xl", {
                          "cursor-pointer": !isExpanded,
                        })
                      }
                    >
                      {/* Section Header */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(section.section);
                        }}
                        className={cn(
                          "flex cursor-pointer items-center justify-between w-full "
                        )}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div>
                            <Image width={48} height={48} alt="section" src={"/images/section.png"} />
                          </div>
                          <div className="flex-1 min-w-0 text-start">
                            <div className="font-bold text-lg truncate">
                              {section.section}
                            </div>
                            <div className="text-sm font-medium text-text-3">
                              {calculateSectionProgress(section.lessons)} |{" "}
                              {calculateSectionDuration(section.lessons)}
                            </div>
                          </div>
                        </div>
                        <div >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      {/* Lessons List */}
                      {isExpanded && (
                        <ul className="space-y-4 px-1">
                          {section.lessons.map((lesson, lessonIndex) => {
                            const isLastLesson =
                              sectionIndex === sections.length - 1 &&
                              lessonIndex === section.lessons.length - 1;

                            const isLessonExpanded = expandedLessons.includes(lesson._id);
                            let subItemCounter = 1;
                            const sectionNumber = sectionIndex + 1;

                            const hasSubItems =
                              lesson.hasQuiz ||
                              lesson.isRequireAnalytic ||
                              isLastLesson;
                            const isAnyActive =
                              selectedLesson === lesson._id ||
                              (isLastLesson &&
                                selectedDisplay === "final_exam");

                            return (
                              <li
                                key={lesson._id}
                                className="space-y-5 bg-background p-3 rounded-2xl"
                              >
                                {/* Video Lesson (Main Header) */}
                                <SidebarItemButton
                                  variant={isAnyActive || isLessonExpanded ? "primary" : "none"}
                                  badge={`${sectionNumber}.${subItemCounter++}`}
                                  title={getDynamicString(lesson.title)}
                                  icon={"/images/video.png"}
                                  subtitle={`${text("video")} | ${lesson.lessonDuration
                                    } ${text("minuteAbbr")}`}
                                  isFocused={isLessonActive(
                                    lesson._id,
                                    "lesson"
                                  )}
                                  disabled={!lesson.videoUrl}
                                  onClick={() => {
                                    handleLessonChange(lesson._id, "lesson");
                                    toggleLesson(lesson._id);
                                  }}
                                  isDone={lesson.lessonWatched}
                                  onToggle={
                                    hasSubItems
                                      ? () => toggleLesson(lesson._id)
                                      : undefined
                                  }
                                  isExpanded={isLessonExpanded}
                                />

                                {/* Sub Items Container */}
                                {hasSubItems && isLessonExpanded && (
                                  <div className="space-y-2 pt-1 px-1">
                                    {/* Quiz */}
                                    {lesson.hasQuiz && (
                                      <SidebarItemButton
                                        badge={`${sectionNumber}.${subItemCounter++}`}
                                        variant={isLessonActive(lesson._id, "quiz") ? "primary-outline" : "none"}
                                        title={lesson.quizTitle || text("quiz")}
                                        subtitle={`${text("quiz")} | ${lesson.examQuestionsNumber
                                          } ${text("questions")}`}
                                        icon={"/images/exam.png"}
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
                                        badge={`${sectionNumber}.${subItemCounter++}`}
                                        variant={isLessonActive(lesson._id, "practice") ? "primary-outline" : "none"}
                                        title={
                                          getDynamicString(
                                            lesson.assignmentTitle
                                          ) || text("assignment")
                                        }
                                        subtitle={`${text("assignment")}`}
                                        icon={"/images/practice.png"}
                                        isFocused={isLessonActive(
                                          lesson._id,
                                          "practice"
                                        )}
                                        isDone={lesson.passedAnalyticsTask}
                                        disabled={
                                          !lesson.videoUrl ||
                                          (!lesson.passedExam && lesson.hasQuiz)
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

                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {/* Final Exam (Only in last section expanded content) */}
                      {isExpanded && sectionIndex === sections.length - 1 && (
                        <div className="space-y-5 bg-background p-3 rounded-2xl"
                        >
                          <SidebarItemButton
                            variant={selectedDisplay === "final_exam" ? "primary" : "none"}
                            title={
                              getDynamicString(course?.examTitle) ?? text("final_exam")
                            }
                            subtitle={`${text("final_exam")} | ${course?.examQuestionsNumber
                              } ${text("questions")}`}
                            icon={"/images/exam.png"}
                            isFocused={selectedDisplay === "final_exam"}
                            onClick={() => handleLessonChange("", "final_exam")}
                          />
                        </div>
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
