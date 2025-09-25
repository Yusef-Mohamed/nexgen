"use client";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Plus } from "lucide-react";
import { useCourseForm } from "../hooks/useCourseForm";
import { useMultiStepForm } from "../hooks/useMultiStepForm";
import { Link } from "@/i18n/routing";
import StepProgressIndicator from "./StepProgressIndicator";
import StepNavigationControls from "./StepNavigationControls";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2ContentDetails from "./steps/Step2ContentDetails";
import Step3PricingAccess from "./steps/Step3PricingAccess";
import Step4AppearanceFinalization from "./steps/Step4AppearanceFinalization";
// Remove import since we'll use the form schema type directly

const commonFormStyles =
  "!px-4 !py-3 !h-auto !rounded-md min-h-12 items-center";

const AddCourseClient = () => {
  const {
    loading,
    categories,
    courses,
    accessibleCourses,
    setAccessibleCourses,
    imagePreview,
    form,
    submitStepData,
    onFinalSubmit,
    handleImageFilesSelected,
    fetchCategories,
    fetchCourses,
    text,
    isEditMode,
    isInitialized,
    initialStep,
    courseId,
  } = useCourseForm();

  // Define steps configuration
  const steps = [
    {
      id: "basic-info",
      title: text("step1_title"),
    },
    {
      id: "content-details",
      title: text("step2_title"),
    },
    {
      id: "pricing-access",
      title: text("step3_title"),
    },
    {
      id: "appearance-finalization",
      title: text("step4_title"),
    },
  ];

  // Initialize multi-step form
  const {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    canGoToStep,
    completedSteps,
    markStepAsCompleted,
  } = useMultiStepForm(steps, initialStep);

  // Fetch categories and courses when component mounts
  useEffect(() => {
    if (isInitialized) {
      fetchCategories();
      fetchCourses();
    }
  }, [fetchCategories, fetchCourses, isInitialized]);

  // Get current step fields for validation
  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return [
          "title.en",
          "title.ar",
          "description.en",
          "description.ar",
          "category",
          "type",
        ];
      case 1: // Content Details
        return [
          "highlights.en",
          "highlights.ar",
          "certificateDescription.en",
          "certificateDescription.ar",
          "courseDuration",
        ];
      case 2: // Pricing Access
        return ["price", "rating"];
      case 3: // Appearance
        return ["bgColor", "bgDarkMode", "fontColor", "fontDarkMode"];
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
      case 0: // Basic Info
        return {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          type: formData.type,
        };
      case 1: // Content Details
        return {
          highlights: formData.highlights,
          certificateDescription: formData.certificateDescription,
          courseDuration: formData.courseDuration,
          courseWelcomeMessage: formData.courseWelcomeMessage,
          courseGoodByeMessage: formData.courseGoodByeMessage,
        };
      case 2: // Pricing Access
        return {
          price: formData.price,
          priceAfterDiscount: formData.priceAfterDiscount,
          rating: formData.rating,
          needAccessibleCourse: formData.needAccessibleCourse,
        };
      case 3: // Appearance
        return {
          bgColor: formData.bgColor,
          bgDarkMode: formData.bgDarkMode,
          fontColor: formData.fontColor,
          fontDarkMode: formData.fontDarkMode,
        };
      default:
        return {};
    }
  };

  const handleNext = async () => {
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
        markStepAsCompleted(currentStep);
        nextStep();
      }
    } else {
      // Ensure errors are displayed for invalid fields
      const fieldsToValidate = getCurrentStepFields();
      for (const field of fieldsToValidate) {
        await form.trigger(field as never);
      }
    }
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger(); // Validate all fields
    if (isValid) {
      await onFinalSubmit();
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  const canProceed = () => {
    const fieldsToCheck = getCurrentStepFields();
    const formState = form.formState;

    // Check if there are any errors for the current step fields
    const hasErrors = fieldsToCheck.some((field) => {
      return formState.errors[field as keyof typeof formState.errors];
    });

    return !hasErrors;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1BasicInfo
            form={form}
            categories={categories}
            imagePreview={imagePreview}
            onImageFilesSelected={handleImageFilesSelected}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 1:
        return (
          <Step2ContentDetails
            form={form}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 2:
        return (
          <Step3PricingAccess
            form={form}
            courses={courses}
            accessibleCourses={accessibleCourses}
            setAccessibleCourses={setAccessibleCourses}
            commonFormStyles={commonFormStyles}
            loading={loading}
          />
        );
      case 3:
        return (
          <Step4AppearanceFinalization
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
    <div className="container max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        <Link
          href={
            isEditMode
              ? `/instructor-dashboard/courses/${courseId}`
              : "/instructor-dashboard/courses"
          }
          className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="xs:hidden">{text("back")}</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
          {isEditMode ? text("edit_course") : text("add_new_course")}
        </h1>
      </div>

      <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6">
        {/* Step Progress Indicator */}
        <StepProgressIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          canGoToStep={canGoToStep}
          onStepClick={loading ? () => {} : goToStep}
        />

        <Form {...form}>
          <div className="min-h-96">{renderCurrentStep()}</div>
        </Form>

        {/* Navigation Controls */}
        <StepNavigationControls
          currentStep={currentStep}
          totalSteps={totalSteps}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          loading={loading}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canProceed={canProceed()}
        />
      </div>
    </div>
  );
};

export default AddCourseClient;
