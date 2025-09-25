"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { AxiosError } from "axios";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";
import { ICourse } from "@/types";

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

// Form schema - will be created dynamically with localized messages
const createLearningPathFormSchema = (text: (key: string) => string) =>
  z.object({
    title: z.object({
      en: z.string().min(1, text("title_en_required")),
      ar: z.string().min(1, text("title_ar_required")),
    }),
    description: z.object({
      en: z.string().min(20, text("description_en_min_length")),
      ar: z.string().min(20, text("description_ar_min_length")),
    }),
    highlights: z.object({
      en: z
        .array(z.string())
        .min(1, text("highlights_en_required"))
        .refine(
          (highlights) =>
            highlights.every((highlight) => highlight.trim().length > 0),
          {
            message: text("highlight_cannot_be_empty"),
          }
        ),
      ar: z
        .array(z.string())
        .min(1, text("highlights_ar_required"))
        .refine(
          (highlights) =>
            highlights.every((highlight) => highlight.trim().length > 0),
          {
            message: text("highlight_cannot_be_empty"),
          }
        ),
    }),
    price: z.string().min(1, text("validation.price_required")),
    priceAfterDiscount: z.string().optional(),
    type: z.enum(
      [
        "beginnerToIntermediate",
        "intermediateToAdvanced",
        "beginnerToAdvanced",
      ],
      {
        errorMap: () => ({ message: text("type_required") }),
      }
    ),
  });

export const useLearningPathForm = () => {
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<ICourse[]>([]);
  const searchParams = useSearchParams();
  const text = useTranslations("learningPathForm");
  const { token } = useAuth();
  const router = useRouter();

  const learningPathId = searchParams.get("learningPathId");
  const mode = searchParams.get("mode");
  const isEditMode = learningPathId && mode !== "create";

  // Handle backend validation errors
  const handleBackendErrors = (error: AxiosError<BackendErrorResponse>) => {
    const backendErrors = error.response?.data?.errors;
    if (!backendErrors || !Array.isArray(backendErrors)) {
      return false;
    }

    let hasFieldErrors = false;
    backendErrors.forEach((backendError) => {
      const fieldPath = backendError.path;
      if (fieldPath && typeof fieldPath === "string") {
        form.setError(fieldPath as keyof LearningPathFormData, {
          type: "manual",
          message: backendError.msg,
        });
        hasFieldErrors = true;
      }
    });

    return hasFieldErrors;
  };

  // Create schema with localized messages
  const baseSchema = createLearningPathFormSchema(text);
  const learningPathFormSchema = baseSchema.superRefine((data, ctx) => {
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
  type LearningPathFormData = z.infer<typeof learningPathFormSchema>;

  const form = useForm<LearningPathFormData>({
    resolver: zodResolver(learningPathFormSchema),
    mode: "onSubmit", // Only validate on submit
    defaultValues: {
      title: {
        en: "",
        ar: "",
      },
      description: {
        en: "",
        ar: "",
      },
      highlights: {
        en: [],
        ar: [],
      },
      price: "",
      priceAfterDiscount: "",
      type: "beginnerToIntermediate",
    },
  });

  // Fetch courses for selection
  const fetchCourses = useCallback(async () => {
    try {
      const coursesResponse = await axiosInstance.get("/courses?limit=1000");
      setCourses(coursesResponse.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  // Fetch learning path data for edit mode
  const fetchLearningPath = useCallback(
    async (learningPathId: string) => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/coursePackages/${learningPathId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const learningPath = response.data.data;
        console.log("Learning Path Data:", learningPath);
        console.log("Learning Path Type:", typeof learningPath);

        // Initialize form with learning path data
        form.reset({
          title: {
            en: learningPath.translationTitle?.en || learningPath.title || "",
            ar: learningPath.translationTitle?.ar || learningPath.title || "",
          },
          description: {
            en:
              learningPath.translationDescription?.en ||
              learningPath.description ||
              "",
            ar:
              learningPath.translationDescription?.ar ||
              learningPath.description ||
              "",
          },
          highlights: {
            en:
              learningPath.translationHighlights?.map(
                (h: { en: string; ar: string }) => h.en
              ) ||
              learningPath.highlights ||
              [],
            ar:
              learningPath.translationHighlights?.map(
                (h: { en: string; ar: string }) => h.ar
              ) ||
              learningPath.highlights ||
              [],
          },
          price: learningPath.price?.toString() || "",
          priceAfterDiscount: learningPath.priceAfterDiscount?.toString() || "",
          type: learningPath.type || "",
        });

        // Set selected courses if they exist
        if (learningPath.courses && Array.isArray(learningPath.courses)) {
          // The courses are already full objects, not just IDs
          setSelectedCourses(learningPath.courses);
        }
      } catch (error) {
        console.error("Error fetching learning path:", error);
        toast.error(text("failed_to_load_learning_path"));
      } finally {
        setLoading(false);
      }
    },
    [token, text, form]
  );

  // Initialize form
  useEffect(() => {
    setIsInitialized(true);

    if (isEditMode && learningPathId) {
      fetchLearningPath(learningPathId);
    }

    // Fetch courses on component mount
  }, [isEditMode, learningPathId, form, fetchLearningPath]);
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  const onSubmit = async (data: LearningPathFormData) => {
    setLoading(true);

    try {
      // Validate price logic
      if (data.priceAfterDiscount && data.priceAfterDiscount.trim() !== "") {
        const price = parseFloat(data.price);
        const priceAfterDiscount = parseFloat(data.priceAfterDiscount);

        if (
          !isNaN(price) &&
          !isNaN(priceAfterDiscount) &&
          priceAfterDiscount >= price
        ) {
          form.setError("priceAfterDiscount", {
            type: "manual",
            message: text("validation.price_after_discount_invalid"),
          });
          setLoading(false);
          return;
        }
      }

      // Prepare learning path data
      const learningPathData = {
        title: data.title,
        description: data.description,
        highlights: data.highlights,
        price: parseFloat(data.price),
        priceAfterDiscount: data.priceAfterDiscount
          ? parseFloat(data.priceAfterDiscount)
          : undefined,
        type: data.type,
        courses: selectedCourses.map((course) => course._id || course.id),
      };

      let response;
      if (isEditMode && learningPathId) {
        // Update existing learning path
        response = await axiosInstance.put(
          `/coursePackages/${learningPathId}`,
          learningPathData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(text("learning_path_updated_successfully"));
      } else {
        // Create new learning path
        response = await axiosInstance.post(
          "/coursePackages",
          learningPathData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(text("learning_path_created_successfully"));
      }

      // Redirect to learning paths list or the created/updated learning path
      if (response?.data?.data) {
        router.push(`/instructor-dashboard/courses?type=learning-path`);
      } else {
        router.push("/instructor-dashboard/courses?type=learning-path");
      }
    } catch (error) {
      console.error("Error submitting learning path:", error);

      if (error instanceof AxiosError) {
        // Try to handle backend validation errors first
        const fieldErrorsHandled = handleBackendErrors(error);

        if (!fieldErrorsHandled) {
          // If no field errors were handled, show general error message
          const errorMessage =
            error.response?.data?.message ||
            text("error_creating_learning_path");
          toast.error(errorMessage);
        }
      } else {
        toast.error(text("error_creating_learning_path"));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    onSubmit,
    text,
    isEditMode,
    isInitialized,
    learningPathId,
    courses,
    selectedCourses,
    setSelectedCourses,
    fetchCourses,
    fetchLearningPath,
  };
};
