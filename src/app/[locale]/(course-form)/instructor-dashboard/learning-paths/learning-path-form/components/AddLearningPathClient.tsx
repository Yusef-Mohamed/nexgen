"use client";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { useLearningPathForm } from "../hooks/useLearningPathForm";
import LearningPathFormLayoutClient from "./LearningPathFormLayoutClient";
import { LearningPathFormProvider } from "./context/LearningPathFormContext";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2Content from "./steps/Step2Content";
import Step3Highlights from "./steps/Step3Highlights";
import Step4Pricing from "./steps/Step4Pricing";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

const commonFormStyles =
  "!px-4 !py-3 !h-auto !rounded-md min-h-12 items-center";

const AddLearningPathClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    loading,
    isFetchingLearningPath,
    courses,
    selectedCourses,
    setSelectedCourses,
    form,
    submitStepData,
    fetchCourses,
    text,
    isEditMode,
    isInitialized,
    learningPathId,
    currentLearningPath,
    initialStep,
    imagePreview,
    handleImageFilesSelected,
  } = useLearningPathForm();

  // Use URL-based current step from hook to persist state across refreshes
  const currentStep = initialStep;

  // Get the next step in order: 0 -> 1 -> 2 -> 3
  const getNextStep = (currentStep: number): number | null => {
    if (currentStep < 3) {
      return currentStep + 1;
    }
    return null; // Last step
  };

  // Fetch courses once when component is initialized
  useEffect(() => {
    if (isInitialized) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  // Get current step fields for validation
  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return [
          "title.en",
          "title.ar",
          "description.en",
          "description.ar",
          "type",
        ];
      case 1: // Content (Courses)
        return []; // No form fields to validate, just selectedCourses state
      case 2: // Highlights
        return ["whatWillLearn", "coursePrerequisites", "whoThisCourseFor"];
      case 3: // Pricing
        return ["price"];
      default:
        return [];
    }
  };

  // Validate current step before proceeding
  const validateCurrentStep = async () => {
    // For step 1 (courses), validate manually
    if (currentStep === 1) {
      return selectedCourses.length > 0;
    }

    const fieldsToValidate = getCurrentStepFields();
    if (fieldsToValidate.length === 0) return true;
    return await form.trigger(fieldsToValidate as never[]);
  };

  // Get step-specific data from form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStepData = (formData: Record<string, any>, stepNumber: number) => {
    switch (stepNumber) {
      case 0: // Basic Info
        return {
          title: formData.title,
          description: formData.description,
          type: formData.type,
        };
      case 1: // Content (Courses)
        return {}; // Courses are handled via selectedCourses state
      case 2: // Highlights
        return {
          whatWillLearn: formData.whatWillLearn,
          coursePrerequisites: formData.coursePrerequisites,
          whoThisCourseFor: formData.whoThisCourseFor,
        };
      case 3: // Pricing
        return {
          price: formData.price,
          priceAfterDiscount: formData.priceAfterDiscount,
        };
      default:
        return {};
    }
  };

  const handleSave = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      // Get current form data for this step
      const formData = form.getValues();
      const stepData = getStepData(formData, currentStep);

      // Submit step data to server
      const result = await submitStepData(stepData, currentStep);

      if (result.success) {
        // Clear any existing errors for the current step
        form.clearErrors();

        // Check if this is the last step (step 3 - Pricing)
        const nextStepNumber = getNextStep(currentStep);
        if (nextStepNumber === null && currentLearningPath) {
          // Last step saved successfully, navigate to learning paths page
          router.push("/instructor-dashboard/courses?type=learning-path");
        } else if (nextStepNumber !== null) {
          // Auto-advance to next step after successful save
          const params = new URLSearchParams(searchParams?.toString() || "");
          params.set("step", nextStepNumber.toString());
          if (learningPathId) {
            params.set("learningPathId", learningPathId);
            params.set("mode", "edit");
          }
          router.push(`${pathname}?${params.toString()}`);
        }
      }
    } else {
      // Ensure errors are displayed for invalid fields
      if (currentStep === 1) {
        // Show error for course selection
        // You could add a toast or error state here
      } else {
        const fieldsToValidate = getCurrentStepFields();
        for (const field of fieldsToValidate) {
          await form.trigger(field as never).catch(() => false);
        }
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1BasicInfo
            form={form}
            imagePreview={imagePreview}
            onImageFilesSelected={handleImageFilesSelected}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 1:
        return (
          <Step2Content
            courses={courses}
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 2:
        return (
          <Step3Highlights
            form={form}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 3:
        return (
          <Step4Pricing
            form={form}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LearningPathFormProvider
      form={form}
      learningPath={currentLearningPath}
      isEditMode={isEditMode}
      learningPathId={learningPathId}
      isFetchingLearningPath={isFetchingLearningPath}
      selectedCoursesCount={selectedCourses.length}
    >
      <LearningPathFormLayoutClient>
        <div className="cardShadow container bg-clear-ground rounded-xl lg:p-12 md:p-8 p-6">
          {isFetchingLearningPath ? (
            <div className="space-y-6">
              {/* Step Header Skeleton */}
              <div className="text-center mb-6 sm:mb-8 space-y-2">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
              </div>
              {/* Form Fields Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <div className="min-h-96">{renderCurrentStep()}</div>
            </Form>
          )}

          {/* Save Button */}
          {!isFetchingLearningPath && (
            <div className="flex justify-center mt-6 pt-4">
              <Button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="min-w-[160px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {text("saving") || "Saving..."}
                  </>
                ) : (
                  text("save") || "Save"
                )}
              </Button>
            </div>
          )}
        </div>
      </LearningPathFormLayoutClient>
    </LearningPathFormProvider>
  );
};

export default AddLearningPathClient;
