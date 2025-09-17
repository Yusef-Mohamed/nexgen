import { useState, useEffect, useCallback } from "react";
import { ICourse } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";

interface UseCourseEditDialogProps {
  course: ICourse | null;
  onCourseUpdated: (updatedCourse?: ICourse) => void;
}

export const useCourseEditDialog = ({
  course,
  onCourseUpdated,
}: UseCourseEditDialogProps) => {
  const text = useTranslations("courses");
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ _id: string; title: string }>
  >([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [accessibleCourses, setAccessibleCourses] = useState<ICourse[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const locale = useLocale();

  // Helper function to safely get certificate description
  const getCertificateDescription = (course: ICourse) => {
    const courseAny = course as ICourse & {
      certificateDescription?: { ar: string; en: string };
      translationCertificateDescription?: { ar: string; en: string };
    };
    return {
      ar:
        courseAny.translationCertificateDescription?.ar ||
        courseAny.certificateDescription?.ar ||
        "",
      en:
        courseAny.translationCertificateDescription?.en ||
        courseAny.certificateDescription?.en ||
        "",
    };
  };
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
          .string()
          .max(500, text("validation.highlights_max_length"))
          .optional(),
        ar: z
          .string()
          .max(500, text("validation.highlights_max_length"))
          .optional(),
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
    defaultValues: {
      title: { ar: "", en: "" },
      description: { ar: "", en: "" },
      highlights: { ar: "", en: "" },
      certificateDescription: { ar: "", en: "" },
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

  // Fetch all courses for accessible courses selection
  const fetchCourses = useCallback(async () => {
    try {
      const coursesResponse = await axiosInstance.get("/courses?limit=1000");
      setCourses(coursesResponse.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  // Initialize form data when course changes
  useEffect(() => {
    if (course) {
      form.reset({
        title: {
          ar: course.translationTitle?.ar || course.title,
          en: course.translationTitle?.en || course.title,
        },
        description: {
          ar: course.translationDescription?.ar || course.description,
          en: course.translationDescription?.en || course.description,
        },
        highlights: {
          ar:
            course.translationHighlights?.map((h) => h.ar).join("\n") ||
            (Array.isArray(course.highlights)
              ? course.highlights.join("\n")
              : ""),
          en:
            course.translationHighlights?.map((h) => h.en).join("\n") ||
            (Array.isArray(course.highlights)
              ? course.highlights.join("\n")
              : ""),
        },
        certificateDescription: getCertificateDescription(course),
        category: course.category?._id || "",
        price: course.price?.toString() || "",
        priceAfterDiscount: course.priceAfterDiscount?.toString() || "",
        courseDuration: course.courseDuration?.toString(),
        needAccessibleCourse: course.needAccessibleCourse || false,
        bgColor: course.colors?.bgColor || "#ffffff",
        bgDarkMode: course.colors?.bgDarkMode || "#000000",
        fontColor: course.colors?.fontColor || "#000000",
        fontDarkMode: course.colors?.fontDarkMode || "#ffffff",
        type:
          (course.type as "beginner" | "intermediate" | "advanced") ??
          "beginner",
        rating: course.rating?.toString() || "1",
      });

      // Set accessible courses if they exist
      if (course.accessibleCourses) {
        setAccessibleCourses(course.accessibleCourses);
      }

      // Reset image preview when course changes
      setImagePreview(null);
      setImage(null);
    }
  }, [course, form]);

  const onSubmit = async (
    data: z.infer<ReturnType<typeof createValidationSchema>>
  ) => {
    if (!course || !token) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      // Add multilingual fields
      formDataToSend.append("title.ar", data.title.ar);
      formDataToSend.append("title.en", data.title.en);
      formDataToSend.append("description.ar", data.description.ar);
      formDataToSend.append("description.en", data.description.en);

      // Handle highlights
      const highlightsAr = (data.highlights.ar || "")
        .split("\n")
        .filter((h: string) => h.trim());
      const highlightsEn = (data.highlights.en || "")
        .split("\n")
        .filter((h: string) => h.trim());

      // Ensure both arrays have the same length by padding with empty strings
      const maxLength = Math.max(highlightsAr.length, highlightsEn.length);
      const paddedHighlightsAr = [
        ...highlightsAr,
        ...Array(maxLength - highlightsAr.length).fill(""),
      ];
      const paddedHighlightsEn = [
        ...highlightsEn,
        ...Array(maxLength - highlightsEn.length).fill(""),
      ];

      paddedHighlightsAr.forEach((highlight: string, index: number) => {
        formDataToSend.append(`translationHighlights[${index}][ar]`, highlight);
      });
      paddedHighlightsEn.forEach((highlight: string, index: number) => {
        formDataToSend.append(`translationHighlights[${index}][en]`, highlight);
      });

      // Add certificate description
      formDataToSend.append(
        "translationCertificateDescription.ar",
        data.certificateDescription.ar
      );
      formDataToSend.append(
        "translationCertificateDescription.en",
        data.certificateDescription.en
      );

      // Add other fields
      formDataToSend.append("category", data.category);
      formDataToSend.append("price", data.price);
      if (data.priceAfterDiscount) {
        formDataToSend.append("priceAfterDiscount", data.priceAfterDiscount);
      }
      formDataToSend.append("courseDuration", data.courseDuration);
      formDataToSend.append(
        "needAccessibleCourse",
        data.needAccessibleCourse.toString()
      );
      formDataToSend.append("colors.bgColor", data.bgColor);
      formDataToSend.append("colors.bgDarkMode", data.bgDarkMode);
      formDataToSend.append("colors.fontColor", data.fontColor);
      formDataToSend.append("colors.fontDarkMode", data.fontDarkMode);
      formDataToSend.append("type", data.type);
      formDataToSend.append("rating", data.rating);

      // Add accessible courses if needAccessibleCourse is true
      if (data.needAccessibleCourse && accessibleCourses.length > 0) {
        accessibleCourses.forEach((course) => {
          formDataToSend.append("accessibleCourses", course._id);
        });
      }

      // Add image if selected
      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await axiosInstance.put(
        `/courses/${course._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the course state with the response data
      if (response.data && response.data.data) {
        const updatedCourse = response.data.data as {
          colors: {
            bgColor: string;
            bgDarkMode: string;
            fontColor: string;
            fontDarkMode: string;
          };
          title: {
            en: string;
            ar: string;
          };
          description: {
            ar: string;
            en: string;
          };
          certificateDescription?: {
            ar: string;
            en: string;
          };
          translationCertificateDescription?: {
            ar: string;
            en: string;
          };
          _id: string;
          category: {
            title: string;
            _id: string;
          };
          instructor: string;
          slug: string;
          rating: number;
          type: string;
          highlights: { ar: string; en: string }[];
          image: string;
        };
        if (typeof onCourseUpdated === "function") {
          onCourseUpdated({
            ...updatedCourse,
            translationTitle: {
              ar: updatedCourse.title.ar,
              en: updatedCourse.title.en,
            },
            translationDescription: {
              ar: updatedCourse.description.ar,
              en: updatedCourse.description.en,
            },
            translationHighlights: updatedCourse.highlights,
            translationCertificateDescription: {
              ar:
                updatedCourse.translationCertificateDescription?.ar ||
                updatedCourse.certificateDescription?.ar ||
                "",
              en:
                updatedCourse.translationCertificateDescription?.en ||
                updatedCourse.certificateDescription?.en ||
                "",
            },
            colors: updatedCourse.colors,
            title:
              locale === "ar" ? updatedCourse.title.ar : updatedCourse.title.en,
            description:
              locale === "ar"
                ? updatedCourse.description.ar
                : updatedCourse.description.en,
            highlights:
              locale === "ar"
                ? updatedCourse.highlights.map((h) => h.ar)
                : updatedCourse.highlights.map((h) => h.en),
            certificateDescription:
              locale === "ar"
                ? updatedCourse.translationCertificateDescription?.ar ||
                  updatedCourse.certificateDescription?.ar ||
                  ""
                : updatedCourse.translationCertificateDescription?.en ||
                  updatedCourse.certificateDescription?.en ||
                  "",
          } as unknown as ICourse);
        }
      }

      // Reset form and close dialog
      setImagePreview(null);
      setImage(null);
      return true; // Success
    } catch (error: unknown) {
      console.error("Error updating course:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message || typedError?.message;
      console.error("Server error:", errorMessage);
      return false; // Error
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert(text("validation.image_invalid"));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(text("validation.image_size"));
        return;
      }

      setImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImagePreview(null);
    setImage(null);
  };

  const handleImageFilesSelected = (files: File[]) => {
    const file = files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert(text("validation.image_invalid"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(text("validation.image_size"));
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return {
    loading,
    categories,
    courses,
    accessibleCourses,
    setAccessibleCourses,
    image,
    imagePreview,
    form,
    onSubmit,
    handleImageChange,
    handleImageFilesSelected,
    resetImage,
    fetchCategories,
    fetchCourses,
    text,
  };
};
