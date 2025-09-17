import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";

interface StepNavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceed: boolean;
}

const StepNavigationControls: React.FC<StepNavigationControlsProps> = ({
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  loading,
  onPrevious,
  onNext,
  onSubmit,
  canProceed,
}) => {
  const text = useTranslations("courses");

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 sm:pt-6 border-t bg-white dark:bg-gray-900 sticky bottom-0 z-10 px-4 py-3 sm:px-6 sm:py-4 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 gap-3 sm:gap-0">
      {/* Mobile step indicator */}
      <div className="flex md:hidden items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400 order-1 sm:order-none">
        <span>
          {text("step")} {currentStep + 1} {text("of")} {totalSteps}
        </span>
      </div>

      {/* Left side - Previous button or Cancel */}
      <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-none">
        {isFirstStep ? (
          <Link href="/instructor-dashboard/courses">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{text("cancel")}</span>
              <span className="xs:hidden">{text("back")}</span>
            </Button>
          </Link>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={loading}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">{text("previous")}</span>
            <span className="xs:hidden">{text("back")}</span>
          </Button>
        )}
      </div>

      {/* Center - Desktop step indicator */}
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>
          {text("step")} {currentStep + 1} {text("of")} {totalSteps}
        </span>
      </div>

      {/* Right side - Next/Submit button */}
      <div className="flex items-center gap-2 sm:gap-4 order-3 sm:order-none">
        {/* Save as Draft button (optional for later implementation) */}
        <Button
          type="button"
          variant="ghost"
          disabled={loading}
          className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm px-3"
        >
          <Save className="w-3 h-3" />
          {text("save_draft")}
        </Button>

        {/* Next/Submit button */}
        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={loading || !canProceed}
            className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base px-3 sm:px-4 flex-1 sm:flex-none justify-center"
          >
            {loading && (
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            )}
            <span className="hidden xs:inline">{text("create_course")}</span>
            <span className="xs:hidden">{text("create")}</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={loading || !canProceed}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4 flex-1 sm:flex-none justify-center"
          >
            <span className="hidden xs:inline">{text("next")}</span>
            <span className="xs:hidden">{text("next")}</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNavigationControls;
