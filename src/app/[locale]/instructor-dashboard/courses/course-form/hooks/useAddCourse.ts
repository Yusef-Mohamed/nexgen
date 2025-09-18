import { useState, useCallback } from "react";
import { ICourse } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

interface UseAddCourseProps {
  onCourseCreated?: (createdCourse: ICourse) => void;
}

export const useAddCourse = ({ onCourseCreated }: UseAddCourseProps = {}) => {
  const text = useTranslations("courses");
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ _id: string; title: string }>
  >([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [accessibleCourses, setAccessibleCourses] = useState<ICourse[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const locale = useLocale();

  // Create validation schema with localized error messages
  const createValidationSchema = () => {
    return z.object({
      title: z.object({
        en: z
          .string()
          .min(3, text("validation.title_min_length"))
          .max(100, text("validation.title_max_length"))
          .refine(
            (val) => val.trim().length > 0,
            text("validation.title_required")
          ),
        ar: z
          .string()
          .min(3, text("validation.title_min_length"))
          .max(100, text("validation.title_max_length"))
          .refine(
            (val) => val.trim().length > 0,
            text("validation.title_required")
          ),
      }),
      description: z.object({
        en: z
          .string()
          .min(10, text("validation.description_min_length"))
          .max(1000, text("validation.description_max_length"))
          .refine(
            (val) => val.trim().length > 0,
            text("validation.description_required")
          ),
        ar: z
          .string()
          .min(10, text("validation.description_min_length"))
          .max(1000, text("validation.description_max_length"))
          .refine(
            (val) => val.trim().length > 0,
            text("validation.description_required")
          ),
      }),
      highlights: z.object({
        en: z
          .array(
            z
              .string()
              .min(1, text("validation.highlight_required"))
              .max(100, text("validation.highlight_max_length"))
          )
          .max(10, text("validation.highlights_array_max_length"))
          .default([]),
        ar: z
          .array(
            z
              .string()
              .min(1, text("validation.highlight_required"))
              .max(100, text("validation.highlight_max_length"))
          )
          .max(10, text("validation.highlights_array_max_length"))
          .default([]),
      }),
      certificateDescription: z.object({
        en: z
          .string()
          .min(10, text("validation.certificate_description_min_length"))
          .max(1000, text("validation.certificate_description_max_length"))
          .refine(
            (val) => val.trim().length > 0,
            text("validation.certificate_description_required")
          ),
        ar: z
          .string()
          .min(10, text("validation.certificate_description_min_length"))
          .max(1000, text("validation.certificate_description_max_length"))
          .refine(
            (val) => val.trim().length > 0,
            text("validation.certificate_description_required")
          ),
      }),
      courseWelcomeMessage: z.object({
        en: z
          .string()
          .max(1000, text("validation.welcome_message_max_length"))
          .optional(),
        ar: z
          .string()
          .max(1000, text("validation.welcome_message_max_length"))
          .optional(),
      }),
      courseGoodByeMessage: z.object({
        en: z
          .string()
          .max(1000, text("validation.goodbye_message_max_length"))
          .optional(),
        ar: z
          .string()
          .max(1000, text("validation.goodbye_message_max_length"))
          .optional(),
      }),
      category: z.string().min(1, text("validation.category_required")),
      price: z.string().min(1, text("validation.price_required")),
      priceAfterDiscount: z.string().optional(),
      courseDuration: z
        .string()
        .min(1, text("validation.duration_required"))
        .refine(
          (val) => !isNaN(Number(val)) && Number(val) > 0,
          text("validation.duration_invalid")
        )
        .refine((val) => Number(val) >= 1, text("validation.duration_min"))
        .refine((val) => Number(val) <= 1000, text("validation.duration_max")),
      needAccessibleCourse: z.boolean(),
      bgColor: z.string().default("#ffffff"),
      bgDarkMode: z.string().default("#000000"),
      fontColor: z.string().default("#000000"),
      fontDarkMode: z.string().default("#ffffff"),
      type: z
        .enum(["beginner", "intermediate", "advanced"])
        .default("beginner"),
      rating: z
        .string()
        .min(1, text("validation.rating_required"))
        .max(1, text("validation.rating_max"))
        .refine((val) => ["1", "2", "3", "4", "5"].includes(val), {
          message: text("validation.rating_range"),
        }),
    });
  };

  const schema = createValidationSchema();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: { ar: "", en: "" },
      description: { ar: "", en: "" },
      highlights: { ar: [], en: [] },
      certificateDescription: { ar: "", en: "" },
      courseWelcomeMessage: { ar: "", en: "" },
      courseGoodByeMessage: { ar: "", en: "" },
      category: "",
      price: "",
      priceAfterDiscount: "",
      courseDuration: "",
      needAccessibleCourse: false,
      bgColor: "#ffffff",
      bgDarkMode: "#000000",
      fontColor: "#000000",
      fontDarkMode: "#ffffff",
      type: "beginner",
      rating: "1",
    },
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesResponse = await axiosInstance.get(
        "/categories?limit=1000"
      );
      setCategories(categoriesResponse.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Fetch courses for accessible courses selection
  const fetchCourses = useCallback(async () => {
    try {
      const coursesResponse = await axiosInstance.get("/courses?limit=1000");
      setCourses(coursesResponse.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  // Handle image file selection
  const handleImageFilesSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onSubmit = async (
    data: z.infer<ReturnType<typeof createValidationSchema>>
  ) => {
    if (!token) {
      toast.error(text("authentication_required"));
      return { success: false };
    }

    setLoading(true);
    try {
      // Prepare form data
      const formData = new FormData();

      // Add image if selected
      if (image) {
        formData.append("image", image);
      }

      // Add course data
      const courseData = {
        title: data.title[locale as keyof typeof data.title] || data.title.en,
        description:
          data.description[locale as keyof typeof data.description] ||
          data.description.en,
        highlights:
          data.highlights[locale as keyof typeof data.highlights] || [],
        certificateDescription:
          data.certificateDescription[
            locale as keyof typeof data.certificateDescription
          ] || data.certificateDescription.en,
        courseWelcomeMessage:
          data.courseWelcomeMessage[
            locale as keyof typeof data.courseWelcomeMessage
          ] || data.courseWelcomeMessage.en,
        courseGoodByeMessage:
          data.courseGoodByeMessage[
            locale as keyof typeof data.courseGoodByeMessage
          ] || data.courseGoodByeMessage.en,
        translationTitle: data.title,
        translationDescription: data.description,
        translationHighlights: [
          {
            ar: data.highlights.ar.join("\n") || "",
            en: data.highlights.en.join("\n") || "",
          },
        ],
        translationCertificateDescription: data.certificateDescription,
        translationCourseWelcomeMessage: data.courseWelcomeMessage,
        translationCourseGoodByeMessage: data.courseGoodByeMessage,
        category: data.category,
        price: parseFloat(data.price),
        priceAfterDiscount: data.priceAfterDiscount
          ? parseFloat(data.priceAfterDiscount)
          : undefined,
        courseDuration: parseInt(data.courseDuration),
        needAccessibleCourse: data.needAccessibleCourse,
        accessibleCourses: data.needAccessibleCourse
          ? accessibleCourses.map((course) => course._id)
          : [],
        colors: {
          bgColor: data.bgColor,
          bgDarkMode: data.bgDarkMode,
          fontColor: data.fontColor,
          fontDarkMode: data.fontDarkMode,
        },
        type: data.type,
        rating: parseInt(data.rating),
      };

      formData.append("courseData", JSON.stringify(courseData));

      const response = await axiosInstance.post("/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const createdCourse = response.data.data as ICourse;

      toast.success(text("course_created_successfully"));
      onCourseCreated?.(createdCourse);

      // Redirect to the new course page
      router.push(`/instructor-dashboard/courses/${createdCourse._id}`);

      return { success: true, course: createdCourse };
    } catch (error) {
      console.error("Error creating course:", error);

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || text("create_course_failed");
        toast.error(errorMessage);
      } else {
        toast.error(text("create_course_failed"));
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
