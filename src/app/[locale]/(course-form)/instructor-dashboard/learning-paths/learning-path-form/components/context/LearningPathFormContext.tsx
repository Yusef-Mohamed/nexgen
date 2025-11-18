"use client";

import React, { createContext, useContext, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { LearningPathFormData } from "../../hooks/useLearningPathForm";
import { ILearningPath } from "../../hooks/useLearningPathForm";

interface LearningPathFormContextType {
  form: UseFormReturn<LearningPathFormData>;
  learningPath: ILearningPath | null;
  isEditMode: boolean;
  learningPathId: string | null;
  isFetchingLearningPath: boolean;
  stepCompletion: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
  };
}

const LearningPathFormContext = createContext<
  LearningPathFormContextType | undefined
>(undefined);

export const useLearningPathFormContext = () => {
  const context = useContext(LearningPathFormContext);
  if (!context) {
    throw new Error(
      "useLearningPathFormContext must be used within LearningPathFormProvider"
    );
  }
  return context;
};

interface LearningPathFormProviderProps {
  children: React.ReactNode;
  form: UseFormReturn<LearningPathFormData>;
  learningPath: ILearningPath | null;
  isEditMode: boolean;
  learningPathId: string | null;
  isFetchingLearningPath: boolean;
  selectedCoursesCount: number;
}

export const LearningPathFormProvider: React.FC<
  LearningPathFormProviderProps
> = ({
  children,
  form,
  learningPath,
  isEditMode,
  learningPathId,
  isFetchingLearningPath,
  selectedCoursesCount,
}) => {
  // Watch form values to detect changes
  const watchedValues = form.watch();

  // Check step completion based on form data
  const stepCompletion = useMemo(() => {
    const formValues = watchedValues;

    // Step 1: Basic Info
    const step1 =
      !!formValues.title?.en &&
      !!formValues.title?.ar &&
      !!formValues.description?.en &&
      !!formValues.description?.ar;

    // Step 2: Content (Courses)
    const step2 = selectedCoursesCount > 0;

    // Step 3: Highlights (whatWillLearn, coursePrerequisites, whoThisCourseFor)
    const step3 =
      Array.isArray(formValues.whatWillLearn) &&
      formValues.whatWillLearn.length > 0 &&
      formValues.whatWillLearn.every((h) => h.en?.trim() && h.ar?.trim()) &&
      Array.isArray(formValues.coursePrerequisites) &&
      formValues.coursePrerequisites.length > 0 &&
      formValues.coursePrerequisites.every(
        (h) => h.en?.trim() && h.ar?.trim()
      ) &&
      Array.isArray(formValues.whoThisCourseFor) &&
      formValues.whoThisCourseFor.length > 0 &&
      formValues.whoThisCourseFor.every((h) => h.en?.trim() && h.ar?.trim());

    // Step 4: Pricing
    const step4 = !!formValues.price && !!formValues.type;

    return {
      step1,
      step2,
      step3,
      step4,
    };
  }, [watchedValues, selectedCoursesCount]);

  const value: LearningPathFormContextType = {
    form,
    learningPath,
    isEditMode,
    learningPathId,
    isFetchingLearningPath,
    stepCompletion,
  };

  return (
    <LearningPathFormContext.Provider value={value}>
      {children}
    </LearningPathFormContext.Provider>
  );
};
