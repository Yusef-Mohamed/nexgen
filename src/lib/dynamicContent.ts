export type ContentType = "courses" | "learning-paths" | "services";

export interface DynamicContent {
  header: string;
  addButton: string;
  noContentFound: string;
  detailsButton: string;
  addButtonLink: string;
}

export const getDynamicContent = (
  type: ContentType,
  text: (key: string) => string
): DynamicContent => {
  const contentMap: Record<ContentType, DynamicContent> = {
    courses: {
      header: text("my_courses"),
      addButton: text("add_new_course"),
      noContentFound: text("no_courses_found"),
      detailsButton: text("course_details"),
      addButtonLink: "/instructor-dashboard/courses/course-form",
    },
    "learning-paths": {
      header: text("my_learning_paths"),
      addButton: text("add_new_learning_path"),
      noContentFound: text("no_learning_paths_found"),
      detailsButton: text("learning_path_details"),
      addButtonLink: "/instructor-dashboard/learning-paths/learning-path-form",
    },
    services: {
      header: text("my_services"),
      addButton: text("add_new_service"),
      noContentFound: text("no_services_found"),
      detailsButton: text("service_details"),
      addButtonLink: "/instructor-dashboard/services/service-form",
    },
  };

  return contentMap[type] || contentMap.courses;
};
