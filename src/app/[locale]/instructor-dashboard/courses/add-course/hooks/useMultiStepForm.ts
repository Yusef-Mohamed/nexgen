import { useState, useCallback } from "react";

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  isValid?: boolean;
  isCompleted?: boolean;
}

export const useMultiStepForm = (steps: StepConfig[]) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < totalSteps) {
        setCurrentStep(stepIndex);
      }
    },
    [totalSteps]
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
      // Can go to current step, previous steps, or next step if current is completed
      return (
        stepIndex <= currentStep ||
        (stepIndex === currentStep + 1 && completedSteps.has(currentStep))
      );
    },
    [currentStep, completedSteps]
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
