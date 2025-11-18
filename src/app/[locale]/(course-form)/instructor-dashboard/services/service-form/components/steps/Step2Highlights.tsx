import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ServiceFormData } from "../../hooks/useServiceForm";
import HighlightsStep, {
  HighlightsStepConfig,
} from "../../../../components/shared/HighlightsStep";

interface Step2HighlightsProps {
  form: UseFormReturn<ServiceFormData>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step2Highlights: React.FC<Step2HighlightsProps> = ({
  form,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("serviceForm");

  const config: HighlightsStepConfig = {
    stepTitle: text("target_your_student"),
    stepDescription: text("target_student_description"),
    whatWillLearn: {
      title: text("what_will_students_learn"),
      description: text("what_will_students_learn_description"),
    },
    coursePrerequisites: {
      title: text("course_prerequisites"),
      description: text("course_prerequisites_description"),
    },
    whoThisCourseFor: {
      title: text("who_is_this_service_for"),
      description: text("who_is_this_service_for_description"),
    },
    placeholder: {
      en: text("enter_highlights_english"),
      ar: text("enter_highlights_arabic"),
    },
    emptyHighlightError: text("validation.highlight_cannot_be_empty"),
  };

  return (
    <HighlightsStep
      form={form}
      config={config}
      commonFormStyles={commonFormStyles}
      loading={loading}
    />
  );
};

export default Step2Highlights;
