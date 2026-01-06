import { useState, useEffect, useCallback } from "react";
import { ICategory, ICourse } from "@/types";
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
import { getStringObject } from "@/lib/utils";
import handleBackendFormErrors from "@/lib/handleBackendFormErrors";

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
  goodByeMessage?: { en?: string; ar?: string };
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
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [accessibleCourses, setAccessibleCourses] = useState<ICourse[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentCourse, setCurrentCourse] = useState<ICourse | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get courseId and currentStep from search params
  const courseId = searchParams?.get("courseId");
  const isEditMode = !!courseId && searchParams?.get("mode") !== "create";
  const stepParam = searchParams?.get("step") || "0";
  const initialStep = stepParam ? parseInt(stepParam) : 0;

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
      goodByeMessage: z
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
        .refine(
          (val) => Number(val) <= 100000,
          text("validation.duration_max")
        ),
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
      goodByeMessage: { ar: "", en: "" },
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
      console.log("courseId", courseId);
      try {
        setIsFetchingCourse(true);
        setLoading(true);
        const response = await axiosInstance.get(`/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const course = response.data.data as ICourse;
        setCurrentCourse(course);

        // Initialize form with course data
        const formattedTitle = getStringObject(course.title);
        const formattedDescription = getStringObject(course.description);
        const formattedCertificateDescription = getStringObject(
          course.certificateDescription
        );
        const formattedCourseWelcomeMessage = getStringObject(
          course.courseWelcomeMessage
        );
        const formattedGoodByeMessage = getStringObject(course.goodByeMessage);
        form.reset({
          title: formattedTitle,
          description: formattedDescription,
          whatWillLearn:
            course.whatWillLearn?.map((h) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [],
          coursePrerequisites:
            course.coursePrerequisites?.map((h) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [],
          whoThisCourseFor:
            course.whoThisCourseFor?.map((h) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [],
          certificateDescription: formattedCertificateDescription,
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
            en: formattedCourseWelcomeMessage.en || "",
            ar: formattedCourseWelcomeMessage.ar || "",
          },
          goodByeMessage: {
            en: formattedGoodByeMessage.en || "",
            ar: formattedGoodByeMessage.ar || "",
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
    [token, form, text]
  );

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

  // Check if step data has changes compared to current course
  const hasStepChanges = useCallback(
    (stepData: Partial<CourseFormSchema>, stepNumber: number) => {
      if (!currentCourse) return true; // Always submit for new courses
      const currentTitle = getStringObject(currentCourse.title || "");
      const currentDescription = getStringObject(
        currentCourse.description || ""
      );
      switch (stepNumber) {
        case 0: // Basic Info + Accessible Courses
          const currentPromotionVideo =
            (currentCourse as ICourse & { promotionVideo?: string })
              .promotionVideo || "";
          return (
            stepData.title?.en !== currentTitle.en ||
            stepData.title?.ar !== currentTitle.ar ||
            stepData.description?.en !== currentDescription.en ||
            stepData.description?.ar !== currentDescription.ar ||
            stepData.category !== currentCourse.category?._id ||
            stepData.type !== currentCourse.type ||
            stepData.needAccessibleCourse !==
              currentCourse.needAccessibleCourse ||
            (stepData.promotionVideo || "") !== currentPromotionVideo ||
            Number(stepData.courseDuration) !== currentCourse.courseDuration ||
            imagePreview !== currentCourse.image
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
          const currentCertDesc = getStringObject(
            currentCourse.certificateDescription || ""
          );
          return (
            stepData.certificateDescription?.ar !== currentCertDesc.ar ||
            stepData.certificateDescription?.en !== currentCertDesc.en ||
            stepData.rating !== currentCourse.rating?.toString()
          );
        case 3: // Highlights (whatWillLearn, coursePrerequisites, whoThisCourseFor)
          const currentWhatWillLearn =
            currentCourse.whatWillLearn?.map((h) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [];
          const currentCoursePrerequisites =
            currentCourse.coursePrerequisites?.map((h) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [];
          const currentWhoThisCourseFor =
            currentCourse.whoThisCourseFor?.map((h) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [];
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
          const currentWelcomeMessage = getStringObject(
            currentCourse.courseWelcomeMessage || ""
          );
          const currentGoodbyeMessage = getStringObject(
            currentCourse.goodByeMessage || ""
          );
          return (
            (stepData.courseWelcomeMessage?.en || "") !==
              (currentWelcomeMessage.en || "") ||
            (stepData.courseWelcomeMessage?.ar || "") !==
              (currentWelcomeMessage.ar || "") ||
            (stepData.goodByeMessage?.en || "") !==
              (currentGoodbyeMessage.en || "") ||
            (stepData.goodByeMessage?.ar || "") !==
              (currentGoodbyeMessage.ar || "")
          );
        default:
          return true;
      }
    },
    [currentCourse]
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
        if (currentCourse) {
          // Compare with current course and only send changed fields
          const currentTitle = getStringObject(currentCourse.title || "");
          const currentDescription = getStringObject(
            currentCourse.description || ""
          );
          const currentPromotionVideo =
            (currentCourse as ICourse & { promotionVideo?: string })
              .promotionVideo || "";

          // Only send title.en if it changed
          if (
            stepData.title?.en !== undefined &&
            stepData.title.en !== currentTitle.en
          ) {
            formData.append("title.en", stepData.title.en);
          }

          // Only send title.ar if it changed
          if (
            stepData.title?.ar !== undefined &&
            stepData.title.ar !== currentTitle.ar
          ) {
            formData.append("title.ar", stepData.title.ar);
          }

          // Only send description.en if it changed
          if (
            stepData.description?.en !== undefined &&
            stepData.description.en !== currentDescription.en
          ) {
            formData.append("description.en", stepData.description.en);
          }

          // Only send description.ar if it changed
          if (
            stepData.description?.ar !== undefined &&
            stepData.description.ar !== currentDescription.ar
          ) {
            formData.append("description.ar", stepData.description.ar);
          }

          // Only send category if it changed
          if (
            stepData.category !== undefined &&
            stepData.category !== currentCourse.category?._id
          ) {
            formData.append("category", stepData.category);
          }

          // Only send type if it changed
          if (
            stepData.type !== undefined &&
            stepData.type !== currentCourse.type
          ) {
            formData.append("type", stepData.type);
          }

          // Only send courseDuration if it changed
          if (
            stepData.courseDuration !== undefined &&
            Number(stepData.courseDuration) !== currentCourse.courseDuration
          ) {
            formData.append("courseDuration", stepData.courseDuration);
          }

          // Only send needAccessibleCourse if it changed
          if (
            stepData.needAccessibleCourse !== undefined &&
            stepData.needAccessibleCourse !== currentCourse.needAccessibleCourse
          ) {
            formData.append(
              "needAccessibleCourse",
              stepData.needAccessibleCourse.toString()
            );
          }

          // Only send accessibleCourses if they changed
          if (stepData.needAccessibleCourse && accessibleCourses.length > 0) {
            const currentAccessibleCourseIds = (
              currentCourse.accessibleCourses || []
            )
              .map((c) => c._id)
              .sort();
            const newAccessibleCourseIds = accessibleCourses
              .map((c) => c._id)
              .sort();
            if (
              JSON.stringify(currentAccessibleCourseIds) !==
              JSON.stringify(newAccessibleCourseIds)
            ) {
              accessibleCourses.forEach((course) => {
                formData.append("accessibleCourses", course._id);
              });
            }
          }

          // Only send promotionVideo if it changed
          if (
            stepData.promotionVideo !== undefined &&
            (stepData.promotionVideo || "") !== currentPromotionVideo
          ) {
            formData.append("promotionVideo", stepData.promotionVideo || "");
          }
        } else {
          // New course - send all fields
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
          if (stepData.courseDuration) {
            formData.append("courseDuration", stepData.courseDuration);
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
        }
      } else if (stepNumber === 1) {
        // Step 2: Pricing
        if (currentCourse) {
          // Only send price if it changed
          if (
            stepData.price !== undefined &&
            stepData.price !== currentCourse.price?.toString()
          ) {
            formData.append("price", stepData.price);
          }

          // Only send priceAfterDiscount if it changed
          if (
            stepData.priceAfterDiscount !== undefined &&
            stepData.priceAfterDiscount !==
              currentCourse.priceAfterDiscount?.toString()
          ) {
            formData.append("priceAfterDiscount", stepData.priceAfterDiscount);
          }

          // Only send freePackageSubscriptionInDays if it changed
          if (
            stepData.freePackageSubscriptionInDays !== undefined &&
            stepData.freePackageSubscriptionInDays !==
              currentCourse.freePackageSubscriptionInDays
          ) {
            formData.append(
              "freePackageSubscriptionInDays",
              stepData.freePackageSubscriptionInDays.toString()
            );
          }
        } else {
          // New course - send all pricing fields
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
        }
      } else if (stepNumber === 2) {
        // Step 3: Certificate
        if (currentCourse) {
          const currentCertDesc = getStringObject(
            currentCourse.certificateDescription || ""
          );

          // Only send certificateDescription.en if it changed
          if (
            stepData.certificateDescription?.en !== undefined &&
            stepData.certificateDescription.en !== currentCertDesc.en
          ) {
            formData.append(
              "certificateDescription.en",
              stepData.certificateDescription.en
            );
          }

          // Only send certificateDescription.ar if it changed
          if (
            stepData.certificateDescription?.ar !== undefined &&
            stepData.certificateDescription.ar !== currentCertDesc.ar
          ) {
            formData.append(
              "certificateDescription.ar",
              stepData.certificateDescription.ar
            );
          }

          // Only send rating if it changed
          if (
            stepData.rating !== undefined &&
            stepData.rating !== currentCourse.rating?.toString()
          ) {
            formData.append("rating", stepData.rating);
          }
        } else {
          // New course - send all certificate fields
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
        }
      } else if (stepNumber === 3) {
        // Step 4: Highlights (whatWillLearn, coursePrerequisites, whoThisCourseFor)
        if (currentCourse) {
          // Compare with current course and only send changed arrays
          const currentWhatWillLearn =
            currentCourse.whatWillLearn?.map((h) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [];
          const currentCoursePrerequisites =
            currentCourse.coursePrerequisites?.map((h) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [];
          const currentWhoThisCourseFor =
            currentCourse.whoThisCourseFor?.map((h) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [];

          // Only send whatWillLearn if it changed
          if (
            stepData.whatWillLearn &&
            Array.isArray(stepData.whatWillLearn) &&
            JSON.stringify(stepData.whatWillLearn || []) !==
              JSON.stringify(currentWhatWillLearn)
          ) {
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

          // Only send coursePrerequisites if it changed
          if (
            stepData.coursePrerequisites &&
            Array.isArray(stepData.coursePrerequisites) &&
            JSON.stringify(stepData.coursePrerequisites || []) !==
              JSON.stringify(currentCoursePrerequisites)
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

          // Only send whoThisCourseFor if it changed
          if (
            stepData.whoThisCourseFor &&
            Array.isArray(stepData.whoThisCourseFor) &&
            JSON.stringify(stepData.whoThisCourseFor || []) !==
              JSON.stringify(currentWhoThisCourseFor)
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
        } else {
          // New course - send all highlights
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
        }
      } else if (stepNumber === 4) {
        // Step 5: Appearance
        if (currentCourse) {
          // Only send bgColor if it changed
          if (
            stepData.bgColor !== undefined &&
            (stepData.bgColor || "#ffffff") !==
              (currentCourse.colors?.bgColor || "#ffffff")
          ) {
            formData.append("colors.bgColor", stepData.bgColor);
          }

          // Only send bgDarkMode if it changed
          if (
            stepData.bgDarkMode !== undefined &&
            (stepData.bgDarkMode || "#000000") !==
              (currentCourse.colors?.bgDarkMode || "#000000")
          ) {
            formData.append("colors.bgDarkMode", stepData.bgDarkMode);
          }

          // Only send fontColor if it changed
          if (
            stepData.fontColor !== undefined &&
            (stepData.fontColor || "#000000") !==
              (currentCourse.colors?.fontColor || "#000000")
          ) {
            formData.append("colors.fontColor", stepData.fontColor);
          }

          // Only send fontDarkMode if it changed
          if (
            stepData.fontDarkMode !== undefined &&
            (stepData.fontDarkMode || "#ffffff") !==
              (currentCourse.colors?.fontDarkMode || "#ffffff")
          ) {
            formData.append("colors.fontDarkMode", stepData.fontDarkMode);
          }
        } else {
          // New course - send all appearance fields
          if (stepData.bgColor)
            formData.append("colors.bgColor", stepData.bgColor);
          if (stepData.bgDarkMode)
            formData.append("colors.bgDarkMode", stepData.bgDarkMode);
          if (stepData.fontColor)
            formData.append("colors.fontColor", stepData.fontColor);
          if (stepData.fontDarkMode)
            formData.append("colors.fontDarkMode", stepData.fontDarkMode);
        }
      } else if (stepNumber === 5) {
        // Step 6: Messages
        if (currentCourse) {
          const currentWelcomeMessage = getStringObject(
            currentCourse.courseWelcomeMessage || ""
          );
          const currentGoodbyeMessage = getStringObject(
            currentCourse.goodByeMessage || ""
          );

          // Only send courseWelcomeMessage.en if it changed
          if (
            stepData.courseWelcomeMessage?.en !== undefined &&
            (stepData.courseWelcomeMessage.en || "") !==
              (currentWelcomeMessage.en || "")
          ) {
            formData.append(
              "courseWelcomeMessage.en",
              stepData.courseWelcomeMessage.en || ""
            );
          }

          // Only send courseWelcomeMessage.ar if it changed
          if (
            stepData.courseWelcomeMessage?.ar !== undefined &&
            (stepData.courseWelcomeMessage.ar || "") !==
              (currentWelcomeMessage.ar || "")
          ) {
            formData.append(
              "courseWelcomeMessage.ar",
              stepData.courseWelcomeMessage.ar || ""
            );
          }

          // Only send goodByeMessage.en if it changed
          if (
            stepData.goodByeMessage?.en !== undefined &&
            (stepData.goodByeMessage.en || "") !==
              (currentGoodbyeMessage.en || "")
          ) {
            formData.append(
              "goodByeMessage.en",
              stepData.goodByeMessage.en || ""
            );
          }

          // Only send goodByeMessage.ar if it changed
          if (
            stepData.goodByeMessage?.ar !== undefined &&
            (stepData.goodByeMessage.ar || "") !==
              (currentGoodbyeMessage.ar || "")
          ) {
            formData.append(
              "goodByeMessage.ar",
              stepData.goodByeMessage.ar || ""
            );
          }
        } else {
          // New course - send all message fields
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
          if (stepData.goodByeMessage) {
            formData.append(
              "goodByeMessage.en",
              stepData.goodByeMessage.en || ""
            );
            formData.append(
              "goodByeMessage.ar",
              stepData.goodByeMessage.ar || ""
            );
          }
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
          return { success: false };
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
        const fieldErrorsHandled = handleBackendFormErrors(form, error);

        if (fieldErrorsHandled) {
          toast.error(text("validation_errors_found"));
        } else {
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
