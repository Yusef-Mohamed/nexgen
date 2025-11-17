"use client";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { useCourseForm } from "../hooks/useCourseForm";
import CourseFormLayoutClient from "./CourseFormLayoutClient";
import { CourseFormProvider } from "./context/CourseFormContext";
import Step1BasicInfoAccessible from "./steps/Step1BasicInfoAccessible";
import Step2Pricing from "./steps/Step2Pricing";
import Step3Certificate from "./steps/Step3Certificate";
import Step4Highlights from "./steps/Step4Highlights";
import Step5Appearance from "./steps/Step5Appearance";
import Step6Messages from "./steps/Step6Messages";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

const commonFormStyles =
  "!px-4 !py-3 !h-auto !rounded-md min-h-12 items-center";

const AddCourseClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    loading,
    isFetchingCourse,
    categories,
    courses,
    accessibleCourses,
    setAccessibleCourses,
    imagePreview,
    form,
    submitStepData,
    handleImageFilesSelected,
    fetchCategories,
    fetchCourses,
    text,
    isEditMode,
    isInitialized,
    courseId,
    currentCourse,
    initialStep,
  } = useCourseForm();

  // Use URL-based current step from hook to persist state across refreshes
  const currentStep = initialStep;

  // Get the next step based on sidebar order: 0 -> 3 -> 5 -> 1 -> 2 -> 4
  const getNextStepInSidebarOrder = (currentStep: number): number | null => {
    const sidebarStepOrder = [0, 3, 5, 1, 2, 4];
    const currentIndex = sidebarStepOrder.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === sidebarStepOrder.length - 1) {
      return null; // Last step or invalid step
    }
    return sidebarStepOrder[currentIndex + 1];
  };

  // Fetch categories and courses once when component is initialized
  useEffect(() => {
    if (isInitialized) {
      fetchCategories();
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);
  // Note: fetchCategories and fetchCourses are stable callbacks (empty deps), excluded to prevent unnecessary refetches

  // Get current step fields for validation
  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 0: // Basic Info + Accessible Courses
        return [
          "title.en",
          "title.ar",
          "description.en",
          "description.ar",
          "category",
          "type",
          "courseDuration",
        ];
      case 1: // Pricing
        return ["price"];
      case 2: // Certificate
        return [
          "certificateDescription.en",
          "certificateDescription.ar",
          "rating",
        ];
      case 3: // Highlights
        return ["whatWillLearn", "coursePrerequisites", "whoThisCourseFor"];
      case 4: // Appearance
        return ["bgColor", "bgDarkMode", "fontColor", "fontDarkMode"];
      case 5: // Messages
        return [
          "courseWelcomeMessage.en",
          "courseWelcomeMessage.ar",
          "goodByeMessage.en",
          "goodByeMessage.ar",
        ];
      default:
        return [];
    }
  };

  // Validate current step before proceeding
  const validateCurrentStep = async () => {
    const fieldsToValidate = getCurrentStepFields();
    return await form.trigger(fieldsToValidate as never[]);
  };

  // Get step-specific data from form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStepData = (formData: Record<string, any>, stepNumber: number) => {
    switch (stepNumber) {
      case 0: // Basic Info + Accessible Courses
        return {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          type: formData.type,
          courseDuration: formData.courseDuration,
          needAccessibleCourse: formData.needAccessibleCourse,
          promotionVideo: formData.promotionVideo,
        };
      case 1: // Pricing
        return {
          price: formData.price,
          priceAfterDiscount: formData.priceAfterDiscount,
          freePackageSubscriptionInDays: formData.freePackageSubscriptionInDays,
        };
      case 2: // Certificate
        return {
          certificateDescription: formData.certificateDescription,
          rating: formData.rating,
        };
      case 3: // Highlights
        return {
          whatWillLearn: formData.whatWillLearn,
          coursePrerequisites: formData.coursePrerequisites,
          whoThisCourseFor: formData.whoThisCourseFor,
        };
      case 4: // Appearance
        return {
          bgColor: formData.bgColor,
          bgDarkMode: formData.bgDarkMode,
          fontColor: formData.fontColor,
          fontDarkMode: formData.fontDarkMode,
        };
      case 5: // Messages
        return {
          courseWelcomeMessage: formData.courseWelcomeMessage,
          goodByeMessage: formData.goodByeMessage,
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

        // Check if this is the last step (step 4 - Appearance)
        const nextStepNumber = getNextStepInSidebarOrder(currentStep);
        if (nextStepNumber === null && currentCourse) {
          // Last step saved successfully, navigate to course page
          router.push(`/instructor-dashboard/courses/${currentCourse._id}`);
        } else if (nextStepNumber !== null) {
          // Auto-advance to next step after successful save
          const params = new URLSearchParams(searchParams?.toString() || "");
          params.set("step", nextStepNumber.toString());
          router.push(`${pathname}?${params.toString()}`);
        }
      }
    } else {
      // Ensure errors are displayed for invalid fields
      const fieldsToValidate = getCurrentStepFields();
      for (const field of fieldsToValidate) {
        await form.trigger(field as never);
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1BasicInfoAccessible
            form={form}
            categories={categories}
            courses={courses}
            accessibleCourses={accessibleCourses}
            setAccessibleCourses={setAccessibleCourses}
            imagePreview={imagePreview}
            onImageFilesSelected={handleImageFilesSelected}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 1:
        return (
          <Step2Pricing
            form={form}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 2:
        return (
          <Step3Certificate
            form={form}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 3:
        return (
          <Step4Highlights
            form={form}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 4:
        return (
          <Step5Appearance
            form={form}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 5:
        return (
          <Step6Messages
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
    <CourseFormProvider
      form={form}
      course={currentCourse}
      isEditMode={isEditMode}
      courseId={courseId}
      isFetchingCourse={isFetchingCourse}
    >
      <CourseFormLayoutClient>
        <div className="cardShadow container bg-clear-ground rounded-xl lg:p-12 md:p-8 p-6">
          {isFetchingCourse ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <div className="min-h-96">{renderCurrentStep()}</div>
            </Form>
          )}

          {/* Save Button */}
          {!isFetchingCourse && (
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
      </CourseFormLayoutClient>
    </CourseFormProvider>
  );
};

export default AddCourseClient;
