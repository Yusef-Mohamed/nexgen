"use client";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Plus } from "lucide-react";
import { useAddCourse } from "../hooks/useAddCourse";
import { useMultiStepForm } from "../hooks/useMultiStepForm";
import { Link } from "@/i18n/routing";
import StepProgressIndicator from "./StepProgressIndicator";
import StepNavigationControls from "./StepNavigationControls";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2ContentDetails from "./steps/Step2ContentDetails";
import Step3PricingAccess from "./steps/Step3PricingAccess";
import Step4AppearanceFinalization from "./steps/Step4AppearanceFinalization";
import { CourseFormData } from "../types/formTypes";

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
    onSubmit,
    handleImageFilesSelected,
    fetchCategories,
    fetchCourses,
    text,
  } = useAddCourse();

  // Define steps configuration
  const steps = [
    {
      id: "basic-info",
      title: text("step1_title"),
      description: text("step1_description"),
    },
    {
      id: "content-details",
      title: text("step2_title"),
      description: text("step2_description"),
    },
    {
      id: "pricing-access",
      title: text("step3_title"),
      description: text("step3_description"),
    },
    {
      id: "appearance-finalization",
      title: text("step4_title"),
      description: text("step4_description"),
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
  } = useMultiStepForm(steps);

  // Fetch categories and courses when component mounts
  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, [fetchCategories, fetchCourses]);

  // Validate current step before proceeding
  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 0: // Basic Info
        return await form.trigger([
          "title.en",
          "title.ar",
          "description.en",
          "description.ar",
          "category",
          "type",
        ]);
      case 1: // Content Details
        return await form.trigger([
          "certificateDescription.en",
          "certificateDescription.ar",
          "courseDuration",
        ]);
      case 2: // Pricing Access
        return await form.trigger(["price", "rating"]);
      case 3: // Appearance
        return await form.trigger([
          "bgColor",
          "bgDarkMode",
          "fontColor",
          "fontDarkMode",
        ]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      // Clear any existing errors for the current step
      form.clearErrors();
      markStepAsCompleted(currentStep);
      nextStep();
    } else {
      // Ensure errors are displayed for invalid fields
      const fieldsToValidate = getCurrentStepFields();
      for (const field of fieldsToValidate) {
        await form.trigger(field as keyof CourseFormData);
      }
    }
  };

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

  const handleSubmit = async () => {
    const isValid = await form.trigger(); // Validate all fields
    if (isValid) {
      const formData = form.getValues();
      await onSubmit(formData);
    }
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
          />
        );
      case 1:
        return (
          <Step2ContentDetails
            form={form}
            commonFormStyles={commonFormStyles}
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
          />
        );
      case 3:
        return (
          <Step4AppearanceFinalization
            form={form}
            commonFormStyles={commonFormStyles}
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
          href="/instructor-dashboard/courses"
          className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden xs:inline">{text("back_to_courses")}</span>
          <span className="xs:hidden">{text("back")}</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
          {text("add_new_course")}
        </h1>
      </div>

      <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6">
        {/* Step Progress Indicator */}
        <StepProgressIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          canGoToStep={canGoToStep}
          onStepClick={goToStep}
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
          onPrevious={prevStep}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canProceed={canProceed()}
        />
      </div>
    </div>
  );
};

export default AddCourseClient;
