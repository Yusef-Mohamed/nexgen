"use client";

import React, { createContext, useContext, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { CourseFormSchema } from "../../hooks/useCourseForm";
import { ICourse } from "@/types";

interface CourseFormContextType {
  form: UseFormReturn<CourseFormSchema>;
  course: ICourse | null;
  isEditMode: boolean;
  courseId: string | null;
  isFetchingCourse: boolean;
  stepCompletion: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
    step5: boolean;
    step6: boolean;
  };
}

const CourseFormContext = createContext<CourseFormContextType | undefined>(
  undefined
);

export const useCourseFormContext = () => {
  const context = useContext(CourseFormContext);
  if (!context) {
    throw new Error(
      "useCourseFormContext must be used within CourseFormProvider"
    );
  }
  return context;
};

interface CourseFormProviderProps {
  children: React.ReactNode;
  form: UseFormReturn<CourseFormSchema>;
  course: ICourse | null;
  isEditMode: boolean;
  courseId: string | null;
  isFetchingCourse: boolean;
}

export const CourseFormProvider: React.FC<CourseFormProviderProps> = ({
  children,
  form,
  course,
  isEditMode,
  courseId,
  isFetchingCourse,
}) => {
  // Watch form values to detect changes
  const watchedValues = form.watch();

  // Check step completion based on form data
  const stepCompletion = useMemo(() => {
    // Use watchedValues directly to avoid unnecessary dependencies
    const formValues = watchedValues;
    // Step 1: Basic Info + Accessible Courses
    const step1 =
      !!formValues.title?.en &&
      !!formValues.title?.ar &&
      !!formValues.description?.en &&
      !!formValues.description?.ar &&
      !!formValues.category &&
      !!formValues.type;

    // Step 2: Pricing
    const step2 = !!formValues.price;

    // Step 3: Certificate
    const step3 =
      !!formValues.certificateDescription?.en &&
      !!formValues.certificateDescription?.ar &&
      !!formValues.rating;

    // Step 4: Highlights (whatWillLearn, coursePrerequisites, whoThisCourseFor)
    const step4 =
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

    // Step 5: Appearance
    // Default values: bgColor="#ffffff", bgDarkMode="#000000", fontColor="#000000", fontDarkMode="#ffffff"
    // Only mark as complete if values differ from defaults OR if in edit mode with saved course
    const defaultBgColor = "#ffffff";
    const defaultBgDarkMode = "#000000";
    const defaultFontColor = "#000000";
    const defaultFontDarkMode = "#ffffff";

    const hasAppearanceChanged =
      formValues.bgColor !== defaultBgColor ||
      formValues.bgDarkMode !== defaultBgDarkMode ||
      formValues.fontColor !== defaultFontColor ||
      formValues.fontDarkMode !== defaultFontDarkMode;

    const step5 = Boolean(
      (hasAppearanceChanged ||
        (isEditMode &&
          course &&
          course.colors &&
          (course.colors.bgColor !== defaultBgColor ||
            course.colors.bgDarkMode !== defaultBgDarkMode ||
            course.colors.fontColor !== defaultFontColor ||
            course.colors.fontDarkMode !== defaultFontDarkMode))) &&
        !!formValues.bgColor &&
        !!formValues.bgDarkMode &&
        !!formValues.fontColor &&
        !!formValues.fontDarkMode
    );

    // Step 6: Messages (optional - mark as complete if messages exist OR if in edit mode with saved course)
    const hasMessages = Boolean(
      formValues.courseWelcomeMessage?.en?.trim() ||
        formValues.courseWelcomeMessage?.ar?.trim() ||
        formValues.goodByeMessage?.en?.trim() ||
        formValues.goodByeMessage?.ar?.trim()
    );

    const step6 = Boolean(
      hasMessages ||
        (isEditMode &&
          course &&
          (!!course.courseWelcomeMessage || !!course.goodByeMessage))
    );

    return {
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
    };
  }, [watchedValues, isEditMode, course]);

  const value: CourseFormContextType = {
    form,
    course,
    isEditMode,
    courseId,
    isFetchingCourse,
    stepCompletion,
  };

  return (
    <CourseFormContext.Provider value={value}>
      {children}
    </CourseFormContext.Provider>
  );
};
