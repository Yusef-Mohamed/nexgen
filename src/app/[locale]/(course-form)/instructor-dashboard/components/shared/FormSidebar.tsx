"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ArrowLeft, Check } from "lucide-react";
import Logo from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Link } from "@/i18n/navigation";

export interface StepConfig {
  id: string;
  title: string;
  index: number;
}

export interface StepCategory {
  title: string;
  steps: StepConfig[];
}

export interface FormSidebarConfig {
  // Back button configuration
  backButton: {
    text: string;
    href: (isEditMode: boolean, itemId: string | null) => string;
  };

  // Step categories
  categories: StepCategory[];

  // Skeleton configuration
  skeleton: {
    categoryCount: number;
    stepsPerCategory: number[];
  };

  // Optional additional content to render after categories
  additionalContent?: (itemId: string | null) => React.ReactNode;
}

interface FormSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  isCollapsable?: boolean;
  config: FormSidebarConfig;
  // Context values
  isEditMode: boolean;
  itemId: string | null;
  stepCompletion: Record<string, boolean>;
  isFetching: boolean;
  // Function to map step index to completion status key
  getStepCompletionKey: (stepIndex: number) => string;
}

const FormSidebar: React.FC<FormSidebarProps> = ({
  className,
  collapsed = false,
  onToggle,
  isCollapsable = false,
  config,
  isEditMode,
  itemId,
  stepCompletion,
  isFetching,
  getStepCompletionKey,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Get current step from URL
  const currentStepParam = searchParams?.get("step");
  const currentStep = currentStepParam ? parseInt(currentStepParam) : 0;

  const handleStepClick = (stepIndex: number, canNavigate: boolean) => {
    if (!canNavigate) return;

    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("step", stepIndex.toString());
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const getStepCompletionStatus = (stepIndex: number): boolean => {
    const key = getStepCompletionKey(stepIndex);
    return stepCompletion[key] || false;
  };

  const canNavigateToStep = (stepIndex: number): boolean => {
    // In edit mode, can navigate freely
    if (isEditMode) return true;

    // In create mode, can only navigate if step 0 is completed
    if (stepIndex === 0) return true;
    return false;
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

        {/* Back Button */}
        <Link
          href={config.backButton.href(isEditMode, itemId)}
          className="flex items-center gap-3 px-4 py-3 mb-4 text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <div className="flex items-center justify-center size-11 border-foreground rounded-full border">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">{config.backButton.text}</span>
        </Link>

        {/* Step Categories */}
        <nav className="flex-1 overflow-auto">
          {isFetching ? (
            <div className="space-y-6">
              {/* Skeleton for categories */}
              {Array.from({ length: config.skeleton.categoryCount }).map(
                (_, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-3">
                    <Skeleton className="h-4 w-32 px-2" />
                    <ul className="space-y-1">
                      {Array.from({
                        length:
                          config.skeleton.stepsPerCategory[categoryIndex] || 2,
                      }).map((_, stepIndex) => (
                        <li key={stepIndex}>
                          <div className="w-full px-4 py-3 rounded-lg flex items-center gap-3">
                            <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
                            <Skeleton className="h-5 flex-1" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {config.categories.map((category, categoryIndex) => (
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

              {/* Additional Content */}
              {config.additionalContent && config.additionalContent(itemId)}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default FormSidebar;
