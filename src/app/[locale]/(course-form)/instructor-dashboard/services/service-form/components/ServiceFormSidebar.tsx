"use client";

import { useTranslations } from "next-intl";
import { useServiceFormContext } from "./context/ServiceFormContext";
import FormSidebar, {
  FormSidebarConfig,
} from "../../../components/shared/FormSidebar";

interface ServiceFormSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  isCollapsable?: boolean;
}

const ServiceFormSidebar: React.FC<ServiceFormSidebarProps> = ({
  className,
  collapsed = false,
  onToggle,
  isCollapsable = false,
}) => {
  const text = useTranslations("serviceForm");
  const { isEditMode, serviceId, stepCompletion, isFetchingService } =
    useServiceFormContext();

  const config: FormSidebarConfig = {
    backButton: {
      text: text("back") || "Back",
      href: (isEditMode, itemId) =>
        isEditMode && itemId
          ? `/instructor-dashboard/courses/${itemId}?type=service`
          : "/instructor-dashboard/courses?type=service",
    },
    categories: [
      {
        title: text("service_information") || "Service Information",
        steps: [
          {
            id: "basic-info",
            title: text("basic_info") || "Basic Info",
            index: 0,
          },
          {
            id: "highlights",
            title: text("target_your_student") || "Target Your Student",
            index: 1,
          },
        ],
      },
      {
        title: text("pricing_access") || "Pricing & Access",
        steps: [
          { id: "pricing", title: text("pricing") || "Pricing", index: 2 },
        ],
      },
    ],
    skeleton: {
      categoryCount: 2,
      stepsPerCategory: [2, 1],
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
      itemId={serviceId}
      stepCompletion={stepCompletion}
      isFetching={isFetchingService}
      getStepCompletionKey={getStepCompletionKey}
    />
  );
};

export default ServiceFormSidebar;
