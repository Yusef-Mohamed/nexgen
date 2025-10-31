"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { ArrowLeft, Check } from "lucide-react";
import Logo from "@/components/logo";
import { Link } from "@/i18n/routing";
import { useCourseFormContext } from "./context/CourseFormContext";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseFormSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  isCollapsable?: boolean;
}

interface StepConfig {
  id: string;
  title: string;
  index: number;
}

interface StepCategory {
  title: string;
  steps: StepConfig[];
}

const CourseFormSidebar: React.FC<CourseFormSidebarProps> = ({
  className,
  collapsed = false,
  onToggle,
  isCollapsable = false,
}) => {
  const text = useTranslations("courses");
  const router = useRouter();
  const { isEditMode, courseId, stepCompletion, isFetchingCourse } =
    useCourseFormContext();

  // Get current step from URL or form state
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const currentStepParam = searchParams.get("step");
  const currentStep = currentStepParam ? parseInt(currentStepParam) : 0;

  // Define step categories
  const categories: StepCategory[] = [
    {
      title: text("course_information"),
      steps: [
        {
          id: "basic-info",
          title: text("basic_info"),
          index: 0,
        },
        {
          id: "target-student",
          title: text("target_your_student"),
          index: 3,
        },
      ],
    },
    {
      title: text("pricing_access"),
      steps: [
        { id: "pricing", title: text("pricing"), index: 1 },
        {
          id: "certificate",
          title: text("certificate"),
          index: 2,
        },
      ],
    },
    {
      title: text("appearance_details"),
      steps: [
        {
          id: "appearance",
          title: text("appearance"),
          index: 4,
        },
      ],
    },
  ];
  const pathname = usePathname();
  const handleStepClick = (stepIndex: number, canNavigate: boolean) => {
    if (!canNavigate) return;

    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("step", stepIndex.toString());
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const getStepCompletionStatus = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return stepCompletion.step1;
      case 1:
        return stepCompletion.step2;
      case 2:
        return stepCompletion.step3;
      case 3:
        return stepCompletion.step4;
      case 4:
        return stepCompletion.step5;
      default:
        return false;
    }
  };

  const canNavigateToStep = (stepIndex: number): boolean => {
    // In edit mode, can navigate freely
    if (isEditMode) return true;

    // In create mode, can only navigate if step 0 is completed
    if (stepIndex === 0) return true;
    return stepCompletion.step1;
  };

  if (collapsed) {
    return (
      <aside
        className={cn(
          "py-4 flex flex-col bg-clear-ground h-screen overflow-auto max-h-screen top-0 sticky transition-all duration-300 w-16 px-2 pt-4",
          className
        )}
      >
        <Logo size="sm" isIconic={true} />
        {isCollapsable && onToggle && (
          <button
            onClick={onToggle}
            className="w-12 h-12 p-0 flex items-center justify-center rounded-full mt-4"
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
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "py-4 flex flex-col bg-clear-ground h-screen overflow-auto max-h-screen top-0 sticky transition-all duration-300 w-[28rem] px-3 sm:px-6",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header with Logo and Collapsible Button */}
        <div className="flex justify-between h-[76px] items-center flex-wrap mb-4 gap-4">
          <Logo size="sm" isIconic={collapsed} />

          {isCollapsable && onToggle && (
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

        {/* Back to Courses Button */}
        <Link
          href={
            isEditMode && courseId
              ? `/instructor-dashboard/courses/${courseId}`
              : "/instructor-dashboard/courses"
          }
          className="flex items-center gap-3 px-4 py-3 mb-4 text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <div className="flex items-center justify-center size-11 border-foreground rounded-full border">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">{text("back_to_courses")}</span>
        </Link>

        {/* Step Categories */}
        <nav className="flex-1 overflow-auto">
          {isFetchingCourse ? (
            <div className="space-y-6">
              {/* Skeleton for categories */}
              {[1, 2, 3].map((categoryIndex) => (
                <div key={categoryIndex} className="space-y-3">
                  <Skeleton className="h-4 w-32 px-2" />
                  <ul className="space-y-1">
                    {[1, 2].map((stepIndex) => (
                      <li key={stepIndex}>
                        <div className="w-full px-4 py-3 rounded-lg flex items-center gap-3">
                          <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
                          <Skeleton className="h-5 flex-1" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h3 className="text-lg font-medium tracking-wide px-2">
                    {category.title}
                  </h3>
                  <ul className="space-y-1">
                    {category.steps.map((step) => {
                      const isActive = currentStep === step.index;
                      const isCompleted = getStepCompletionStatus(step.index);
                      const canNavigate = canNavigateToStep(step.index);

                      return (
                        <li key={step.id}>
                          <button
                            onClick={() =>
                              handleStepClick(step.index, canNavigate)
                            }
                            disabled={!canNavigate}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-lg transition-all",
                              "flex items-center gap-3",
                              {
                                // Active step
                                "bg-primary/10 border border-primary": isActive,
                                "opacity-50 cursor-not-allowed": !canNavigate,
                              }
                            )}
                          >
                            {/* Checkbox/Radio indicator */}
                            <div
                              className={cn(
                                "flex items-center justify-center w-5 h-5 border rounded-full flex-shrink-0",
                                {
                                  "bg-primary/10 border-primary text-primary":
                                    isCompleted,
                                  "border-primary": isActive,
                                }
                              )}
                            >
                              {isCompleted ? (
                                <Check className="w-3 h-3 " />
                              ) : null}
                            </div>
                            <span
                              className={cn("font-medium", {
                                "text-primary": isActive,
                                "text-foreground": !isActive,
                              })}
                            >
                              {step.title}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Course Details Button (Step 6) - Only in edit mode */}
              {isEditMode && courseId && (
                <div className="space-y-3 mt-6">
                  <h3 className="text-lg font-medium tracking-wide px-2">
                    {text("course_management")}
                  </h3>
                  <Link
                    href={`/instructor-dashboard/courses/${courseId}`}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3"
                  >
                    <div className="flex items-center justify-center w-5 h-5 border rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-foreground">
                      {text("course_details") || "Course Details"}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default CourseFormSidebar;
