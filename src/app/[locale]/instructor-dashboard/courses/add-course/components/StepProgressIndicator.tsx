import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProgressIndicatorProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  currentStep: number;
  completedSteps: Set<number>;
  canGoToStep: (stepIndex: number) => boolean;
  onStepClick: (stepIndex: number) => void;
}

const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
  canGoToStep,
  onStepClick,
}) => {
  return (
    <div className="w-full py-4 sm:py-6">
      <div className="flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = currentStep === index;
          const isClickable = canGoToStep(index);

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center min-w-0 flex-1">
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 flex-shrink-0",
                    {
                      // Completed step
                      "bg-green-500 text-white hover:bg-green-600": isCompleted,
                      // Current step
                      "bg-blue-500 text-white ring-2 ring-blue-200":
                        isCurrent && !isCompleted,
                      // Future step (not accessible)
                      "bg-gray-200 text-gray-400 cursor-not-allowed":
                        !isClickable && !isCurrent && !isCompleted,
                      // Future step (accessible)
                      "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer":
                        isClickable && !isCurrent && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Step Label */}
                <div className="mt-1 sm:mt-2 text-center px-1">
                  <div
                    className={cn(
                      "text-xs sm:text-sm font-medium leading-tight",
                      {
                        "text-green-600": isCompleted,
                        "text-blue-600": isCurrent,
                        "text-gray-900":
                          !isCurrent && !isCompleted && isClickable,
                        "text-gray-400":
                          !isClickable && !isCurrent && !isCompleted,
                      }
                    )}
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">
                      {step.title.split(" ")[0]}
                    </span>
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1 hidden md:block max-w-20 text-center leading-tight">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-200",
                    {
                      "bg-green-500": completedSteps.has(index),
                      "bg-blue-200": currentStep > index,
                      "bg-gray-200": currentStep <= index,
                    }
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepProgressIndicator;
