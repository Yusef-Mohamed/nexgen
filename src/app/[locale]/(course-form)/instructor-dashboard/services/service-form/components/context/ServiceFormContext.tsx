"use client";

import React, { createContext, useContext, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "../../hooks/useServiceForm";
import { IPackage } from "@/types";

interface ServiceFormContextType {
  form: UseFormReturn<ServiceFormData>;
  service: IPackage | null;
  isEditMode: boolean;
  serviceId: string | null;
  isFetchingService: boolean;
  stepCompletion: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
  };
}

const ServiceFormContext = createContext<ServiceFormContextType | undefined>(
  undefined
);

export const useServiceFormContext = () => {
  const context = useContext(ServiceFormContext);
  if (!context) {
    throw new Error(
      "useServiceFormContext must be used within ServiceFormProvider"
    );
  }
  return context;
};

interface ServiceFormProviderProps {
  children: React.ReactNode;
  form: UseFormReturn<ServiceFormData>;
  service: IPackage | null;
  isEditMode: boolean;
  serviceId: string | null;
  isFetchingService: boolean;
}

export const ServiceFormProvider: React.FC<ServiceFormProviderProps> = ({
  children,
  form,
  service,
  isEditMode,
  serviceId,
  isFetchingService,
}) => {
  // Watch form values to detect changes
  const watchedValues = form.watch();

  // Check step completion based on form data
  const stepCompletion = useMemo(() => {
    const formValues = watchedValues;

    // Step 1: Basic Info + Course
    const step1 =
      !!formValues.title?.en &&
      !!formValues.title?.ar &&
      !!formValues.description?.en &&
      !!formValues.description?.ar;

    // Step 2: Highlights (whatWillLearn, coursePrerequisites, whoThisCourseFor)
    const step2 =
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

    // Step 3: Pricing
    const step3 = !!formValues.price && !!formValues.subscriptionDurationDays;

    return {
      step1,
      step2,
      step3,
    };
  }, [watchedValues]);

  const value: ServiceFormContextType = {
    form,
    service,
    isEditMode,
    serviceId,
    isFetchingService,
    stepCompletion,
  };

  return (
    <ServiceFormContext.Provider value={value}>
      {children}
    </ServiceFormContext.Provider>
  );
};
