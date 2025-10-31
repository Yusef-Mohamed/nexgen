import { useState, useCallback } from "react";

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  isValid?: boolean;
  isCompleted?: boolean;
}

export const useMultiStepForm = (
  steps: StepConfig[],
  initialStep: number = 0,
  isEditMode: boolean = false
) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < totalSteps) {
        // In edit mode, allow free navigation
        if (isEditMode) {
          setCurrentStep(stepIndex);
          return;
        }

        // In create mode, check if we can navigate
        if (stepIndex === 0 || completedSteps.has(0)) {
          setCurrentStep(stepIndex);
        }
      }
    },
    [totalSteps, isEditMode, completedSteps]
  );

  const nextStep = useCallback(() => {
    if (!isLastStep) {
      setCompletedSteps((prev) => new Set([...Array.from(prev), currentStep]));
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, isLastStep]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  const markStepAsCompleted = useCallback((stepIndex: number) => {
    setCompletedSteps((prev) => new Set([...Array.from(prev), stepIndex]));
  }, []);

  const isStepCompleted = useCallback(
    (stepIndex: number) => {
      return completedSteps.has(stepIndex);
    },
    [completedSteps]
  );

  const canGoToStep = useCallback(
    (stepIndex: number) => {
      // In edit mode, can navigate freely
      if (isEditMode) return true;

      // In create mode:
      // - Can go to step 0 always
      // - Can go to other steps only if step 0 is completed
      if (stepIndex === 0) return true;
      return completedSteps.has(0);
    },
    [completedSteps, isEditMode]
  );

  const getStepProgress = useCallback(() => {
    return {
      current: currentStep + 1,
      total: totalSteps,
      percentage: ((currentStep + 1) / totalSteps) * 100,
      completedCount: completedSteps.size,
    };
  }, [currentStep, totalSteps, completedSteps]);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    prevStep,
    markStepAsCompleted,
    isStepCompleted,
    canGoToStep,
    getStepProgress,
    completedSteps,
  };
};
