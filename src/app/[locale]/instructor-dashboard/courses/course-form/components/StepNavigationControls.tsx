import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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
    <div className="flex flex-col mt-6 sm:flex-row justify-between items-stretch sm:items-center border-t bg-card rounded-b-2xl sticky bottom-0 z-10 px-4 py-3 sm:px-6 sm:py-4 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 gap-3 sm:gap-0">
      {/* Mobile step indicator */}
      <div className="flex md:hidden items-center justify-center gap-2 text-xs text-text-2 order-1 sm:order-none">
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
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 rotateInRTL" />
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
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 rotateInRTL" />
            <span className="hidden xs:inline">{text("previous")}</span>
            <span className="xs:hidden">{text("back")}</span>
          </Button>
        )}
      </div>

      {/* Center - Desktop step indicator */}
      <div className="hidden md:flex items-center gap-2 text-sm text-text-2">
        <span>
          {text("step")} {currentStep + 1} {text("of")} {totalSteps}
        </span>
      </div>

      {/* Right side - Next/Submit button */}
      <div className="flex items-center gap-2 sm:gap-4 order-3 sm:order-none">
        {/* Next/Submit button */}
        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={loading || !canProceed}
            className="flex items-center gap-1 sm:gap-2 bg-green hover:bg-green/90 text-white text-sm sm:text-base px-3 sm:px-4 flex-1 sm:flex-none justify-center"
          >
            {loading && (
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            )}
            <span className="hidden xs:inline">{text("save")}</span>
            <span className="xs:hidden">{text("save")}</span>
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
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotateInRTL" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNavigationControls;
