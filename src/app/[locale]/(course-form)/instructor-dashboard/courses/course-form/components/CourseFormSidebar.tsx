"use client";

import { useTranslations } from "next-intl";
import { useCourseFormContext } from "./context/CourseFormContext";
import FormSidebar, {
  FormSidebarConfig,
} from "../../../components/shared/FormSidebar";
import { Link } from "@/i18n/navigation";

interface CourseFormSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  isCollapsable?: boolean;
}

const CourseFormSidebar: React.FC<CourseFormSidebarProps> = ({
  className,
  collapsed = false,
  onToggle,
  isCollapsable = false,
}) => {
  const text = useTranslations("courses");
  const { isEditMode, courseId, stepCompletion, isFetchingCourse } =
    useCourseFormContext();

  const config: FormSidebarConfig = {
    backButton: {
      text: text("back_to_courses"),
      href: (isEditMode, itemId) =>
        isEditMode && itemId
          ? `/instructor-dashboard/courses/${itemId}`
          : "/instructor-dashboard/courses",
    },
    categories: [
      {
        title: text("course_information"),
        steps: [
          {
            id: "basic-info",
            title: text("basic_info"),
            index: 0,
          },
          {
            id: "target-student",
            title: text("target_your_student"),
            index: 3,
          },
          {
            id: "messages",
            title: text("course_messages"),
            index: 5,
          },
        ],
      },
      {
        title: text("pricing_access"),
        steps: [
          { id: "pricing", title: text("pricing"), index: 1 },
          {
            id: "certificate",
            title: text("certificate"),
            index: 2,
          },
        ],
      },
      {
        title: text("appearance_details"),
        steps: [
          {
            id: "appearance",
            title: text("appearance"),
            index: 4,
          },
        ],
      },
    ],
    skeleton: {
      categoryCount: 3,
      stepsPerCategory: [2, 2, 1],
    },
    additionalContent: (itemId) =>
      itemId ? (
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-medium tracking-wide px-2">
            {text("course_content")}
          </h3>
          <Link
            href={`/instructor-dashboard/courses/${itemId}`}
            className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 hover:bg-muted"
          >
            <div className="flex items-center justify-center w-5 h-5 border rounded-full flex-shrink-0"></div>
            <span className="font-medium text-foreground">
              {text("lesson_list")}
            </span>
          </Link>
        </div>
      ) : null,
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
      case 4:
        return "step5";
      case 5:
        return "step6";
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
      itemId={courseId}
      stepCompletion={stepCompletion}
      isFetching={isFetchingCourse}
      getStepCompletionKey={getStepCompletionKey}
    />
  );
};

export default CourseFormSidebar;
