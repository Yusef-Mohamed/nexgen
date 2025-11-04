import { useState, useEffect, useCallback } from "react";
import { ICourse } from "@/types";
import { useTranslations } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { useRouter, usePathname } from "@/i18n/routing";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

// Backend error response type
interface BackendError {
  type: string;
  value: unknown;
  msg: string;
  path: string;
  location: string;
}

interface BackendErrorResponse {
  errors?: BackendError[];
  message?: string;
}

interface UseCourseFormProps {
  onCourseUpdated?: (updatedCourse?: ICourse) => void;
}

// Type that mirrors the form shape used across steps
export interface CourseFormSchema {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  whatWillLearn: Array<{ en: string; ar: string }>;
  coursePrerequisites: Array<{ en: string; ar: string }>;
  whoThisCourseFor: Array<{ en: string; ar: string }>;
  certificateDescription: { en: string; ar: string };
  courseWelcomeMessage?: { en?: string; ar?: string };
  courseGoodByeMessage?: { en?: string; ar?: string };
  category: string;
  price: string;
  priceAfterDiscount?: string;
  courseDuration: string;
  needAccessibleCourse: boolean;
  freePackageSubscriptionInDays?: number;
  bgColor: string;
  bgDarkMode: string;
  fontColor: string;
  fontDarkMode: string;
  type: "beginner" | "intermediate" | "advanced";
  rating: string;
  promotionVideo?: string;
}

export const useCourseForm = ({ onCourseUpdated }: UseCourseFormProps = {}) => {
  const text = useTranslations("courses");
  const { token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [isFetchingCourse, setIsFetchingCourse] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ _id: string; title: string }>
  >([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [accessibleCourses, setAccessibleCourses] = useState<ICourse[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentCourse, setCurrentCourse] = useState<ICourse | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get courseId and currentStep from search params
  const courseId = searchParams?.get("courseId");
  const isEditMode = !!courseId && searchParams?.get("mode") !== "create";
  const stepParam = searchParams?.get("step");
  const initialStep = stepParam ? parseInt(stepParam) : 0;

  // Helper function to safely get certificate description
  const getCertificateDescription = useCallback((course: ICourse) => {
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
  }, []);

  // Create validation schema with localized error messages
  const createValidationSchema = () => {
    // Base schema for highlight item validation
    // Each item must have at least 3 characters in both languages
    const highlightItemSchema = z.object({
      en: z
        .string()
        .min(3, text("validation.highlight_min_length"))
        .refine((val) => val.trim().length >= 3, {
          message: text("validation.highlight_min_length"),
        }),
      ar: z
        .string()
        .min(3, text("validation.highlight_min_length"))
        .refine((val) => val.trim().length >= 3, {
          message: text("validation.highlight_min_length"),
        }),
    });

    // Schema for whatWillLearn - no minimum required, can be empty or any number up to 50
    const whatWillLearnSchema = z
      .array(highlightItemSchema)
      .max(50, text("validation.highlights_array_max_length"))
      .default([]);

    // Schema for prerequisites and whoThisCourseFor - no minimum required, can be empty or any number up to 50
    const otherHighlightsSchema = z
      .array(highlightItemSchema)
      .max(50, text("validation.highlights_array_max_length"))
      .default([]);

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
      whatWillLearn: whatWillLearnSchema,
      coursePrerequisites: otherHighlightsSchema,
      whoThisCourseFor: otherHighlightsSchema,
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
      courseWelcomeMessage: z
        .object({
          en: z
            .string()
            .max(1000, text("validation.welcome_message_max_length"))
            .optional(),
          ar: z
            .string()
            .max(1000, text("validation.welcome_message_max_length"))
            .optional(),
        })
        .optional(),
      courseGoodByeMessage: z
        .object({
          en: z
            .string()
            .max(1000, text("validation.goodbye_message_max_length"))
            .optional(),
          ar: z
            .string()
            .max(1000, text("validation.goodbye_message_max_length"))
            .optional(),
        })
        .optional(),
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
      freePackageSubscriptionInDays: z
        .number()
        .min(1, text("validation.free_package_days_min"))
        .max(365, text("validation.free_package_days_max"))
        .optional(),
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
      promotionVideo: z.string().optional(),
    });
  };

  const baseSchema = createValidationSchema();
  const schema = baseSchema.superRefine((data, ctx) => {
    // Validate price after discount is less than original price
    if (data.priceAfterDiscount && data.priceAfterDiscount.trim() !== "") {
      const price = parseFloat(data.price);
      const priceAfterDiscount = parseFloat(data.priceAfterDiscount);

      if (
        !isNaN(price) &&
        !isNaN(priceAfterDiscount) &&
        priceAfterDiscount >= price
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: text("validation.price_after_discount_invalid"),
          path: ["priceAfterDiscount"],
        });
      }
    }
  });
  const form = useForm<CourseFormSchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit", // Only validate on submit
    reValidateMode: "onChange",
    defaultValues: {
      title: { ar: "", en: "" },
      description: { ar: "", en: "" },
      whatWillLearn: [],
      coursePrerequisites: [],
      whoThisCourseFor: [],
      certificateDescription: { ar: "", en: "" },
      courseWelcomeMessage: { ar: "", en: "" },
      courseGoodByeMessage: { ar: "", en: "" },
      category: "",
      price: "",
      priceAfterDiscount: "",
      courseDuration: "",
      needAccessibleCourse: false,
      freePackageSubscriptionInDays: undefined,
      bgColor: "#ffffff",
      bgDarkMode: "#000000",
      fontColor: "#000000",
      fontDarkMode: "#ffffff",
      type: "beginner",
      rating: "1",
    },
  });

  // Fetch course data for edit mode
  const fetchCourse = useCallback(
    async (courseId: string) => {
      if (!token) return;

      try {
        setIsFetchingCourse(true);
        setLoading(true);
        const response = await axiosInstance.get(`/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const course = response.data.data as ICourse;
        setCurrentCourse(course);

        // Initialize form with course data
        form.reset({
          title: {
            ar: course.translationTitle?.ar || course.title,
            en: course.translationTitle?.en || course.title,
          },
          description: {
            ar: course.translationDescription?.ar || course.description,
            en: course.translationDescription?.en || course.description,
          },
          whatWillLearn:
            (
              course as ICourse & {
                whatWillLearn?: Array<{ en: string; ar: string }>;
                translationWhatWillLearn?: Array<{ en: string; ar: string }>;
              }
            ).translationWhatWillLearn
              ?.map((h) => ({
                en: h.en || "",
                ar: h.ar || "",
              }))
              .filter((h) => h.en || h.ar) ||
            (
              course as ICourse & {
                whatWillLearn?: Array<{ en: string; ar: string }>;
              }
            ).whatWillLearn ||
            [],
          coursePrerequisites:
            (
              course as ICourse & {
                coursePrerequisites?: Array<{ en: string; ar: string }>;
                translationCoursePrerequisites?: Array<{
                  en: string;
                  ar: string;
                }>;
              }
            ).translationCoursePrerequisites
              ?.map((h) => ({
                en: h.en || "",
                ar: h.ar || "",
              }))
              .filter((h) => h.en || h.ar) ||
            (
              course as ICourse & {
                coursePrerequisites?: Array<{ en: string; ar: string }>;
              }
            ).coursePrerequisites ||
            [],
          whoThisCourseFor:
            (
              course as ICourse & {
                whoThisCourseFor?: Array<{ en: string; ar: string }>;
                translationWhoThisCourseFor?: Array<{ en: string; ar: string }>;
              }
            ).translationWhoThisCourseFor
              ?.map((h) => ({
                en: h.en || "",
                ar: h.ar || "",
              }))
              .filter((h) => h.en || h.ar) ||
            (
              course as ICourse & {
                whoThisCourseFor?: Array<{ en: string; ar: string }>;
              }
            ).whoThisCourseFor ||
            [],
          certificateDescription: getCertificateDescription(course),
          category: course.category?._id || "",
          price: course.price?.toString() || "",
          priceAfterDiscount: course.priceAfterDiscount?.toString() || "",
          courseDuration: course.courseDuration?.toString() || "",
          needAccessibleCourse: course.needAccessibleCourse || false,
          freePackageSubscriptionInDays:
            course.freePackageSubscriptionInDays || undefined,
          bgColor: course.colors?.bgColor || "#ffffff",
          bgDarkMode: course.colors?.bgDarkMode || "#000000",
          fontColor: course.colors?.fontColor || "#000000",
          fontDarkMode: course.colors?.fontDarkMode || "#ffffff",
          type:
            (course.type as "beginner" | "intermediate" | "advanced") ??
            "beginner",
          rating: course.rating?.toString() || "1",
          promotionVideo:
            (course as ICourse & { promotionVideo?: string }).promotionVideo ||
            undefined,
          courseWelcomeMessage: {
            en:
              (
                course as ICourse & {
                  translationCourseWelcomeMessage?: { en: string; ar: string };
                  courseWelcomeMessage?: { en: string; ar: string };
                }
              ).translationCourseWelcomeMessage?.en ||
              (
                course as ICourse & {
                  courseWelcomeMessage?: { en: string; ar: string };
                }
              ).courseWelcomeMessage?.en ||
              "",
            ar:
              (
                course as ICourse & {
                  translationCourseWelcomeMessage?: { en: string; ar: string };
                  courseWelcomeMessage?: { en: string; ar: string };
                }
              ).translationCourseWelcomeMessage?.ar ||
              (
                course as ICourse & {
                  courseWelcomeMessage?: { en: string; ar: string };
                }
              ).courseWelcomeMessage?.ar ||
              "",
          },
          courseGoodByeMessage: {
            en:
              (
                course as ICourse & {
                  translationCourseGoodByeMessage?: { en: string; ar: string };
                  courseGoodByeMessage?: { en: string; ar: string };
                }
              ).translationCourseGoodByeMessage?.en ||
              (
                course as ICourse & {
                  courseGoodByeMessage?: { en: string; ar: string };
                }
              ).courseGoodByeMessage?.en ||
              "",
            ar:
              (
                course as ICourse & {
                  translationCourseGoodByeMessage?: { en: string; ar: string };
                  courseGoodByeMessage?: { en: string; ar: string };
                }
              ).translationCourseGoodByeMessage?.ar ||
              (
                course as ICourse & {
                  courseGoodByeMessage?: { en: string; ar: string };
                }
              ).courseGoodByeMessage?.ar ||
              "",
          },
        });

        // Set accessible courses if they exist
        if (course.accessibleCourses) {
          setAccessibleCourses(course.accessibleCourses);
        }

        // Reset image preview when course changes
        setImagePreview(null);
        setImage(null);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error(text("failed_to_load_course"));
      } finally {
        setLoading(false);
        setIsFetchingCourse(false);
      }
    },
    [token, form, text, getCertificateDescription]
  );

  // Initialize step in URL if not present
  useEffect(() => {
    if (!stepParam) {
      const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      params.set("step", "0");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [stepParam, router, pathname]);

  // Initialize component based on courseId in search params
  // Only fetch once when courseId is available and component hasn't been initialized
  useEffect(() => {
    if (courseId && !isInitialized) {
      fetchCourse(courseId);
      setIsInitialized(true);
    } else if (!courseId && !isInitialized) {
      setCurrentCourse(null);
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, isInitialized]);
  // Note: fetchCourse is intentionally excluded from dependencies to prevent refetching on form updates

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
      const coursesResponse = await axiosInstance.get(
        "/courses/getAll?limit=1000"
      );
      setCourses(coursesResponse.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  // Handle image file selection
  const handleImageFilesSelected = useCallback(
    (files: File[]) => {
      const file = files?.[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error(text("validation.image_invalid"));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(text("validation.image_size"));
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [text]
  );

  // Add courseId to search params
  const addCourseIdToParams = useCallback(
    (courseId: string) => {
      const currentParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      currentParams.set("courseId", courseId);
      currentParams.set("mode", "create");
      currentParams.set("step", "3");
      router.push(`${pathname}?${currentParams.toString()}`);
    },
    [router, pathname]
  );

  // Handle backend validation errors
  const handleBackendErrors = useCallback(
    (error: AxiosError<BackendErrorResponse>) => {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        // Clear existing form errors first
        form.clearErrors();

        // Map backend errors to form field errors
        backendErrors.forEach((backendError) => {
          if (backendError.type === "field" && backendError.path) {
            // Convert backend field path to form field path
            let fieldPath: keyof CourseFormSchema | string = backendError.path;

            // Handle nested fields (e.g., title.en, title.ar)
            if (backendError.path === "title") {
              // If it's a title error, we might need to set it on both languages
              // For now, let's set it on the English version
              fieldPath = "title.en";
            } else if (backendError.path === "description") {
              fieldPath = "description.en";
            } else if (backendError.path === "certificateDescription") {
              fieldPath = "certificateDescription.en";
            }

            // Set the error on the form field
            (
              form.setError as (
                name: string,
                error: { type: string; message: string }
              ) => void
            )(fieldPath, {
              type: "server",
              message: backendError.msg,
            });
          }
        });

        // Show a general error message if there are field errors
        toast.error(text("validation_errors_found"));
        return true; // Indicates that field errors were handled
      }

      return false; // No field errors to handle
    },
    [form, text]
  );

  // Check if step data has changes compared to current course
  const hasStepChanges = useCallback(
    (stepData: Partial<CourseFormSchema>, stepNumber: number) => {
      if (!currentCourse) return true; // Always submit for new courses
      switch (stepNumber) {
        case 0: // Basic Info + Accessible Courses
          const currentPromotionVideo =
            (currentCourse as ICourse & { promotionVideo?: string })
              .promotionVideo || "";
          return (
            stepData.title?.en !== currentCourse.translationTitle?.en ||
            stepData.title?.ar !== currentCourse.translationTitle?.ar ||
            stepData.description?.en !==
              currentCourse.translationDescription?.en ||
            stepData.description?.ar !==
              currentCourse.translationDescription?.ar ||
            stepData.category !== currentCourse.category?._id ||
            stepData.type !== currentCourse.type ||
            stepData.needAccessibleCourse !==
              currentCourse.needAccessibleCourse ||
            (stepData.promotionVideo || "") !== currentPromotionVideo
          );
        case 1: // Pricing
          return (
            stepData.price !== currentCourse.price?.toString() ||
            stepData.priceAfterDiscount !==
              currentCourse.priceAfterDiscount?.toString() ||
            stepData.freePackageSubscriptionInDays !==
              currentCourse.freePackageSubscriptionInDays
          );
        case 2: // Certificate
          const currentCertDesc = getCertificateDescription(currentCourse);
          return (
            stepData.certificateDescription?.ar !== currentCertDesc.ar ||
            stepData.certificateDescription?.en !== currentCertDesc.en ||
            stepData.rating !== currentCourse.rating?.toString()
          );
        case 3: // Highlights (whatWillLearn, coursePrerequisites, whoThisCourseFor)
          const currentWhatWillLearn =
            (
              currentCourse as ICourse & {
                translationWhatWillLearn?: Array<{ en: string; ar: string }>;
              }
            ).translationWhatWillLearn?.map((h) => ({
              en: h.en || "",
              ar: h.ar || "",
            })) ||
            (
              currentCourse as ICourse & {
                whatWillLearn?: Array<{ en: string; ar: string }>;
              }
            ).whatWillLearn ||
            [];
          const currentCoursePrerequisites =
            (
              currentCourse as ICourse & {
                translationCoursePrerequisites?: Array<{
                  en: string;
                  ar: string;
                }>;
              }
            ).translationCoursePrerequisites?.map((h) => ({
              en: h.en || "",
              ar: h.ar || "",
            })) ||
            (
              currentCourse as ICourse & {
                coursePrerequisites?: Array<{ en: string; ar: string }>;
              }
            ).coursePrerequisites ||
            [];
          const currentWhoThisCourseFor =
            (
              currentCourse as ICourse & {
                translationWhoThisCourseFor?: Array<{ en: string; ar: string }>;
              }
            ).translationWhoThisCourseFor?.map((h) => ({
              en: h.en || "",
              ar: h.ar || "",
            })) ||
            (
              currentCourse as ICourse & {
                whoThisCourseFor?: Array<{ en: string; ar: string }>;
              }
            ).whoThisCourseFor ||
            [];
          return (
            JSON.stringify(stepData.whatWillLearn || []) !==
              JSON.stringify(currentWhatWillLearn) ||
            JSON.stringify(stepData.coursePrerequisites || []) !==
              JSON.stringify(currentCoursePrerequisites) ||
            JSON.stringify(stepData.whoThisCourseFor || []) !==
              JSON.stringify(currentWhoThisCourseFor)
          );
        case 4: // Appearance
          return (
            (stepData.bgColor || "#ffffff") !==
              (currentCourse.colors?.bgColor || "#ffffff") ||
            (stepData.bgDarkMode || "#000000") !==
              (currentCourse.colors?.bgDarkMode || "#000000") ||
            (stepData.fontColor || "#000000") !==
              (currentCourse.colors?.fontColor || "#000000") ||
            (stepData.fontDarkMode || "#ffffff") !==
              (currentCourse.colors?.fontDarkMode || "#ffffff")
          );
        case 5: // Messages
          const currentWelcomeMessage = (
            currentCourse as ICourse & {
              translationCourseWelcomeMessage?: { en: string; ar: string };
              courseWelcomeMessage?: { en: string; ar: string };
            }
          ).translationCourseWelcomeMessage ||
            (
              currentCourse as ICourse & {
                courseWelcomeMessage?: { en: string; ar: string };
              }
            ).courseWelcomeMessage || { en: "", ar: "" };
          const currentGoodbyeMessage = (
            currentCourse as ICourse & {
              translationCourseGoodByeMessage?: { en: string; ar: string };
              courseGoodByeMessage?: { en: string; ar: string };
            }
          ).translationCourseGoodByeMessage ||
            (
              currentCourse as ICourse & {
                courseGoodByeMessage?: { en: string; ar: string };
              }
            ).courseGoodByeMessage || { en: "", ar: "" };
          return (
            (stepData.courseWelcomeMessage?.en || "") !==
              (currentWelcomeMessage.en || "") ||
            (stepData.courseWelcomeMessage?.ar || "") !==
              (currentWelcomeMessage.ar || "") ||
            (stepData.courseGoodByeMessage?.en || "") !==
              (currentGoodbyeMessage.en || "") ||
            (stepData.courseGoodByeMessage?.ar || "") !==
              (currentGoodbyeMessage.ar || "")
          );
        default:
          return true;
      }
    },
    [currentCourse, getCertificateDescription]
  );

  // Submit step data to server
  const submitStepData = async (
    stepData: Partial<CourseFormSchema>,
    stepNumber: number
  ) => {
    if (!token) {
      toast.error(text("authentication_required"));
      return { success: false };
    }

    // Check if there are changes before submitting
    if (!hasStepChanges(stepData, stepNumber)) {
      toast.success(text("no_changes_to_save"));
      return { success: true, course: currentCourse };
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Add image if selected
      if (image) {
        formData.append("image", image);
      }

      // Prepare step-specific data (NEW STEP STRUCTURE)
      if (stepNumber === 0) {
        // Step 1: Basic Info + Accessible Courses
        if (stepData.title) {
          formData.append("title.ar", stepData.title.ar);
          formData.append("title.en", stepData.title.en);
        }
        if (stepData.description) {
          formData.append("description.ar", stepData.description.ar);
          formData.append("description.en", stepData.description.en);
        }
        if (stepData.category) {
          formData.append("category", stepData.category);
        }
        if (stepData.type) {
          formData.append("type", stepData.type);
        }
        if (stepData.needAccessibleCourse !== undefined) {
          formData.append(
            "needAccessibleCourse",
            stepData.needAccessibleCourse.toString()
          );
        }
        if (stepData.needAccessibleCourse && accessibleCourses.length > 0) {
          accessibleCourses.forEach((course) => {
            formData.append("accessibleCourses", course._id);
          });
        }
        if (stepData.promotionVideo) {
          formData.append("promotionVideo", stepData.promotionVideo);
        }
      } else if (stepNumber === 1) {
        // Step 2: Pricing
        if (stepData.price) {
          formData.append("price", stepData.price);
        }
        if (stepData.priceAfterDiscount) {
          formData.append("priceAfterDiscount", stepData.priceAfterDiscount);
        }
        if (stepData.freePackageSubscriptionInDays !== undefined) {
          formData.append(
            "freePackageSubscriptionInDays",
            stepData.freePackageSubscriptionInDays.toString()
          );
        }
      } else if (stepNumber === 2) {
        // Step 3: Certificate
        if (stepData.certificateDescription) {
          formData.append(
            "certificateDescription.ar",
            stepData.certificateDescription.ar
          );
          formData.append(
            "certificateDescription.en",
            stepData.certificateDescription.en
          );
        }
        if (stepData.rating) {
          formData.append("rating", stepData.rating);
        }
      } else if (stepNumber === 3) {
        // Step 4: Highlights (whatWillLearn, coursePrerequisites, whoThisCourseFor)
        if (stepData.whatWillLearn && Array.isArray(stepData.whatWillLearn)) {
          stepData.whatWillLearn.forEach(
            (highlight: { en: string; ar: string }, index: number) => {
              formData.append(
                `whatWillLearn[${index}][en]`,
                highlight.en?.trim() || ""
              );
              formData.append(
                `whatWillLearn[${index}][ar]`,
                highlight.ar?.trim() || ""
              );
            }
          );
        }
        if (
          stepData.coursePrerequisites &&
          Array.isArray(stepData.coursePrerequisites)
        ) {
          stepData.coursePrerequisites.forEach(
            (highlight: { en: string; ar: string }, index: number) => {
              formData.append(
                `coursePrerequisites[${index}][en]`,
                highlight.en?.trim() || ""
              );
              formData.append(
                `coursePrerequisites[${index}][ar]`,
                highlight.ar?.trim() || ""
              );
            }
          );
        }
        if (
          stepData.whoThisCourseFor &&
          Array.isArray(stepData.whoThisCourseFor)
        ) {
          stepData.whoThisCourseFor.forEach(
            (highlight: { en: string; ar: string }, index: number) => {
              formData.append(
                `whoThisCourseFor[${index}][en]`,
                highlight.en?.trim() || ""
              );
              formData.append(
                `whoThisCourseFor[${index}][ar]`,
                highlight.ar?.trim() || ""
              );
            }
          );
        }
      } else if (stepNumber === 4) {
        // Step 5: Appearance
        if (stepData.bgColor)
          formData.append("colors.bgColor", stepData.bgColor);
        if (stepData.bgDarkMode)
          formData.append("colors.bgDarkMode", stepData.bgDarkMode);
        if (stepData.fontColor)
          formData.append("colors.fontColor", stepData.fontColor);
        if (stepData.fontDarkMode)
          formData.append("colors.fontDarkMode", stepData.fontDarkMode);
      } else if (stepNumber === 5) {
        // Step 6: Messages
        if (stepData.courseWelcomeMessage) {
          formData.append(
            "courseWelcomeMessage.en",
            stepData.courseWelcomeMessage.en || ""
          );
          formData.append(
            "courseWelcomeMessage.ar",
            stepData.courseWelcomeMessage.ar || ""
          );
        }
        if (stepData.courseGoodByeMessage) {
          formData.append(
            "courseGoodByeMessage.en",
            stepData.courseGoodByeMessage.en || ""
          );
          formData.append(
            "courseGoodByeMessage.ar",
            stepData.courseGoodByeMessage.ar || ""
          );
        }
      }

      let response;
      let isNewCourse = false;
      if (currentCourse) {
        // Update existing course
        response = await axiosInstance.put(
          `/courses/${currentCourse._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new course (only on first step)
        if (stepNumber === 0) {
          isNewCourse = true;
          response = await axiosInstance.post("/courses", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          const createdCourse = response.data.data as ICourse;
          setCurrentCourse(createdCourse);
          addCourseIdToParams(createdCourse._id);

          toast.success(text("course_created_successfully"));
        } else {
          throw new Error("Cannot update course that doesn't exist");
        }
      }

      if (response?.data?.data && onCourseUpdated) {
        const updatedCourse = response.data.data as ICourse;
        onCourseUpdated(updatedCourse);
      }

      // Only show "step saved" toast for updates, not for course creation
      if (!isNewCourse) {
        toast.success(text("step_saved_successfully"));
      }

      // Auto-advance to next step after successful save

      return { success: true, course: response?.data?.data };
    } catch (error) {
      console.error("Error submitting step data:", error);

      if (error instanceof AxiosError) {
        // Try to handle backend validation errors first
        const fieldErrorsHandled = handleBackendErrors(error);

        if (!fieldErrorsHandled) {
          // If no field errors were handled, show general error message
          const errorMessage =
            error.response?.data?.message || text("save_step_failed");
          toast.error(errorMessage);
        }
      } else {
        toast.error(text("save_step_failed"));
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Final submit (submit final step and redirect to course page)
  const onFinalSubmit = async () => {
    if (!currentCourse) {
      toast.error(text("no_course_to_save"));
      return { success: false };
    }

    // Submit the final step (appearance) data
    const formData = form.getValues();
    const finalStepData = {
      bgColor: formData.bgColor,
      bgDarkMode: formData.bgDarkMode,
      fontColor: formData.fontColor,
      fontDarkMode: formData.fontDarkMode,
    };

    const result = await submitStepData(finalStepData, 4);

    if (result.success) {
      toast.success(text("course_completed_successfully"));
      router.push(`/instructor-dashboard/courses/${currentCourse._id}`);
      return { success: true, course: currentCourse };
    }

    return { success: false };
  };

  return {
    loading,
    isFetchingCourse,
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
    currentCourse,
    isInitialized,
    initialStep,
    courseId,
  };
};
