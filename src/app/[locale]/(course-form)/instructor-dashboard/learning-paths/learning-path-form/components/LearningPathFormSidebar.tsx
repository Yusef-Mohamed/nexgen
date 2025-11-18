"use client";

import { useTranslations } from "next-intl";
import { useLearningPathFormContext } from "./context/LearningPathFormContext";
import FormSidebar, {
  FormSidebarConfig,
} from "../../../components/shared/FormSidebar";

interface LearningPathFormSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  isCollapsable?: boolean;
}

const LearningPathFormSidebar: React.FC<LearningPathFormSidebarProps> = ({
  className,
  collapsed = false,
  onToggle,
  isCollapsable = false,
}) => {
  const text = useTranslations("learningPathForm");
  const { isEditMode, learningPathId, stepCompletion, isFetchingLearningPath } =
    useLearningPathFormContext();

  const config: FormSidebarConfig = {
    backButton: {
      text: text("back") || "Back",
      href: (isEditMode, itemId) =>
        isEditMode && itemId
          ? `/instructor-dashboard/courses/${itemId}?type=learning-path`
          : "/instructor-dashboard/courses?type=learning-path",
    },
    categories: [
      {
        title: text("learning_path_information") || "Learning Path Information",
        steps: [
          {
            id: "basic-info",
            title: text("basic_info") || "Basic Info",
            index: 0,
          },
          {
            id: "content",
            title: text("learning_path_content") || "Learning Path Content",
            index: 1,
          },
          {
            id: "highlights",
            title: text("target_your_student") || "Target Your Student",
            index: 2,
          },
        ],
      },
      {
        title: text("pricing_access") || "Pricing & Access",
        steps: [
          { id: "pricing", title: text("pricing") || "Pricing", index: 3 },
        ],
      },
    ],
    skeleton: {
      categoryCount: 2,
      stepsPerCategory: [3, 1],
    },
  };

  const getStepCompletionKey = (stepIndex: number): string => {
    switch (stepIndex) {
      case 0:
        return "step1";
      case 1:
        return "step2";
      case 2:
        return "step3";
      case 3:
        return "step4";
      default:
        return "step1";
    }
  };

  return (
    <FormSidebar
      className={className}
      collapsed={collapsed}
      onToggle={onToggle}
      isCollapsable={isCollapsable}
      config={config}
      isEditMode={isEditMode}
      itemId={learningPathId}
      stepCompletion={stepCompletion}
      isFetching={isFetchingLearningPath}
      getStepCompletionKey={getStepCompletionKey}
    />
  );
};

export default LearningPathFormSidebar;
