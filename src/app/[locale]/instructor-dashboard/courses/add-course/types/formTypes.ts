export interface CourseFormData {
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  highlights: {
    en: string[];
    ar: string[];
  };
  certificateDescription: {
    en: string;
    ar: string;
  };
  courseWelcomeMessage: {
    en?: string;
    ar?: string;
  };
  courseGoodByeMessage: {
    en?: string;
    ar?: string;
  };
  category: string;
  price: string;
  priceAfterDiscount?: string;
  courseDuration: string;
  needAccessibleCourse: boolean;
  bgColor: string;
  bgDarkMode: string;
  fontColor: string;
  fontDarkMode: string;
  type: "beginner" | "intermediate" | "advanced";
  rating: string;
}
