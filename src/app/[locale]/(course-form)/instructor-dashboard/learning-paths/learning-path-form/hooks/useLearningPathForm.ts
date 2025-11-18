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
import { toast } from "react-toastify";
import { ICourse } from "@/types";
import { getStringObject } from "@/lib/utils";

// Form schema - will be created dynamically with localized messages
const createLearningPathFormSchema = (text: (key: string) => string) => {
  // Base schema for highlight item validation
  const highlightItemSchema = z.object({
    en: z
      .string()
      .min(
        3,
        text("highlight_min_length") ||
          "Highlight must be at least 3 characters"
      )
      .refine((val) => val.trim().length >= 3, {
        message:
          text("highlight_min_length") ||
          "Highlight must be at least 3 characters",
      }),
    ar: z
      .string()
      .min(
        3,
        text("highlight_min_length") ||
          "Highlight must be at least 3 characters"
      )
      .refine((val) => val.trim().length >= 3, {
        message:
          text("highlight_min_length") ||
          "Highlight must be at least 3 characters",
      }),
  });

  // Schema for highlights - require at least 4 items
  const highlightsSchema = z
    .array(highlightItemSchema)
    .min(
      4,
      text("what_will_learn_min_required") || "At least 4 items are required"
    )
    .max(50, text("highlights_array_max_length") || "Maximum 50 items allowed")
    .default([]);

  return z.object({
    title: z.object({
      en: z.string().min(1, text("title_en_required")),
      ar: z.string().min(1, text("title_ar_required")),
    }),
    description: z.object({
      en: z.string().min(20, text("description_en_min_length")),
      ar: z.string().min(20, text("description_ar_min_length")),
    }),
    whatWillLearn: highlightsSchema,
    coursePrerequisites: highlightsSchema,
    whoThisCourseFor: highlightsSchema,
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
};

// Define the learning path interface
export interface ILearningPath {
  _id: string;
  id?: string;
  title: string;
  description: string;
  highlights?: string[];
  whatWillLearn?: Array<{ en: string; ar: string } | string>;
  coursePrerequisites?: Array<{ en: string; ar: string } | string>;
  whoThisCourseFor?: Array<{ en: string; ar: string } | string>;
  price: number;
  priceAfterDiscount?: number;
  type: string;
  courses?: ICourse[];
  translationTitle?: {
    en: string;
    ar: string;
  };
  translationDescription?: {
    en: string;
    ar: string;
  };
  translationHighlights?: Array<{
    en: string;
    ar: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  slug?: string;
}

// Export the form data type
export type LearningPathFormData = {
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  whatWillLearn: Array<{ en: string; ar: string }>;
  coursePrerequisites: Array<{ en: string; ar: string }>;
  whoThisCourseFor: Array<{ en: string; ar: string }>;
  price: string;
  priceAfterDiscount?: string;
  type:
    | "beginnerToIntermediate"
    | "intermediateToAdvanced"
    | "beginnerToAdvanced";
};

export const useLearningPathForm = () => {
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFetchingLearningPath, setIsFetchingLearningPath] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<ICourse[]>([]);
  const [currentLearningPath, setCurrentLearningPath] =
    useState<ILearningPath | null>(null);
  const searchParams = useSearchParams();
  const text = useTranslations("learningPathForm");
  const { token } = useAuth();

  const learningPathId = searchParams.get("learningPathId");
  const mode = searchParams.get("mode");
  const isEditMode = !!(learningPathId && mode !== "create");
  const stepParam = searchParams?.get("step") || "0";
  const initialStep = stepParam ? parseInt(stepParam) : 0;

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
      whatWillLearn: [],
      coursePrerequisites: [],
      whoThisCourseFor: [],
      price: "",
      priceAfterDiscount: "",
      type: "beginnerToIntermediate",
    },
  });

  // Fetch courses for selection
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

  // Fetch learning path data for edit mode
  const fetchLearningPath = useCallback(
    async (learningPathId: string) => {
      if (!token) return;

      try {
        setIsFetchingLearningPath(true);
        setLoading(true);
        const response = await axiosInstance.get(
          `/coursePackages/${learningPathId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const learningPath = response.data.data;
        setCurrentLearningPath(learningPath);

        // Initialize form with learning path data
        const formattedTitle = getStringObject(
          learningPath.translationTitle || learningPath.title || ""
        );
        const formattedDescription = getStringObject(
          learningPath.translationDescription || learningPath.description || ""
        );

        form.reset({
          title: formattedTitle,
          description: formattedDescription,
          whatWillLearn:
            learningPath.whatWillLearn?.map(
              (h: { en: string; ar: string } | string) => {
                if (!h) return { en: "", ar: "" };
                if (typeof h === "string") {
                  const formatted = getStringObject(h);
                  return {
                    en: formatted.en || "",
                    ar: formatted.ar || "",
                  };
                }
                return {
                  en: h.en || "",
                  ar: h.ar || "",
                };
              }
            ) ||
            learningPath.translationHighlights?.map(
              (h: { en: string; ar: string }) => ({
                en: h.en || "",
                ar: h.ar || "",
              })
            ) ||
            [],
          coursePrerequisites:
            learningPath.coursePrerequisites?.map(
              (h: { en: string; ar: string } | string) => {
                if (!h) return { en: "", ar: "" };
                if (typeof h === "string") {
                  const formatted = getStringObject(h);
                  return {
                    en: formatted.en || "",
                    ar: formatted.ar || "",
                  };
                }
                return {
                  en: h.en || "",
                  ar: h.ar || "",
                };
              }
            ) || [],
          whoThisCourseFor:
            learningPath.whoThisCourseFor?.map(
              (h: { en: string; ar: string } | string) => {
                if (!h) return { en: "", ar: "" };
                if (typeof h === "string") {
                  const formatted = getStringObject(h);
                  return {
                    en: formatted.en || "",
                    ar: formatted.ar || "",
                  };
                }
                return {
                  en: h.en || "",
                  ar: h.ar || "",
                };
              }
            ) || [],
          price: learningPath.price?.toString() || "",
          priceAfterDiscount: learningPath.priceAfterDiscount?.toString() || "",
          type: learningPath.type || "beginnerToIntermediate",
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
        setIsFetchingLearningPath(false);
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

  // Check if step data has changes compared to current learning path
  const hasStepChanges = useCallback(
    (stepData: Partial<LearningPathFormData>, stepNumber: number) => {
      if (!currentLearningPath) return true; // Always submit for new learning paths
      const currentTitle =
        currentLearningPath.translationTitle ||
        getStringObject(currentLearningPath.title || "");
      const currentDescription =
        currentLearningPath.translationDescription ||
        getStringObject(currentLearningPath.description || "");

      switch (stepNumber) {
        case 0: // Basic Info
          return (
            stepData.title?.en !== currentTitle.en ||
            stepData.title?.ar !== currentTitle.ar ||
            stepData.description?.en !== currentDescription.en ||
            stepData.description?.ar !== currentDescription.ar
          );
        case 1: // Content (Courses)
          const currentCourseIds = (currentLearningPath.courses || [])
            .map((c) => c._id || c.id)
            .sort();
          const selectedCourseIds = selectedCourses
            .map((c) => c._id || c.id)
            .sort();
          return (
            JSON.stringify(currentCourseIds) !==
            JSON.stringify(selectedCourseIds)
          );
        case 2: // Highlights
          // Compare highlights arrays
          const currentWhatWillLearn =
            currentLearningPath.whatWillLearn?.map(
              (h: { en: string; ar: string } | string) => {
                if (typeof h === "string") {
                  const formatted = getStringObject(h);
                  return { en: formatted.en || "", ar: formatted.ar || "" };
                }
                return { en: h.en || "", ar: h.ar || "" };
              }
            ) || [];
          const currentPrerequisites =
            currentLearningPath.coursePrerequisites?.map(
              (h: { en: string; ar: string } | string) => {
                if (typeof h === "string") {
                  const formatted = getStringObject(h);
                  return { en: formatted.en || "", ar: formatted.ar || "" };
                }
                return { en: h.en || "", ar: h.ar || "" };
              }
            ) || [];
          const currentWhoFor =
            currentLearningPath.whoThisCourseFor?.map(
              (h: { en: string; ar: string } | string) => {
                if (typeof h === "string") {
                  const formatted = getStringObject(h);
                  return { en: formatted.en || "", ar: formatted.ar || "" };
                }
                return { en: h.en || "", ar: h.ar || "" };
              }
            ) || [];

          const whatWillLearnChanged =
            JSON.stringify(stepData.whatWillLearn) !==
            JSON.stringify(currentWhatWillLearn);
          const prerequisitesChanged =
            JSON.stringify(stepData.coursePrerequisites) !==
            JSON.stringify(currentPrerequisites);
          const whoForChanged =
            JSON.stringify(stepData.whoThisCourseFor) !==
            JSON.stringify(currentWhoFor);

          return whatWillLearnChanged || prerequisitesChanged || whoForChanged;
        case 3: // Pricing
          return (
            stepData.price !== currentLearningPath.price?.toString() ||
            stepData.priceAfterDiscount !==
              currentLearningPath.priceAfterDiscount?.toString() ||
            stepData.type !== currentLearningPath.type
          );
        default:
          return true;
      }
    },
    [currentLearningPath, selectedCourses]
  );

  // Submit step data to server
  const submitStepData = async (
    stepData: Partial<LearningPathFormData>,
    stepNumber: number
  ) => {
    if (!token) {
      toast.error(text("authentication_required") || "Authentication required");
      return { success: false };
    }

    // Check if there are changes before submitting
    if (!hasStepChanges(stepData, stepNumber)) {
      toast.success(text("no_changes_to_save") || "No changes to save");
      return { success: true, learningPath: currentLearningPath };
    }

    setLoading(true);
    try {
      const learningPathData: Record<string, unknown> = {};

      // Prepare step-specific data
      if (stepNumber === 0) {
        // Step 1: Basic Info
        if (stepData.title) {
          learningPathData.title = stepData.title;
        }
        if (stepData.description) {
          learningPathData.description = stepData.description;
        }
      } else if (stepNumber === 1) {
        // Step 2: Content (Courses)
        learningPathData.courses = selectedCourses.map(
          (course) => course._id || course.id
        );
      } else if (stepNumber === 2) {
        // Step 3: Highlights
        if (stepData.whatWillLearn) {
          learningPathData.whatWillLearn = stepData.whatWillLearn;
        }
        if (stepData.coursePrerequisites) {
          learningPathData.coursePrerequisites = stepData.coursePrerequisites;
        }
        if (stepData.whoThisCourseFor) {
          learningPathData.whoThisCourseFor = stepData.whoThisCourseFor;
        }
      } else if (stepNumber === 3) {
        // Step 4: Pricing
        if (stepData.price) {
          learningPathData.price = parseFloat(stepData.price);
        }
        if (stepData.priceAfterDiscount) {
          learningPathData.priceAfterDiscount = parseFloat(
            stepData.priceAfterDiscount
          );
        }
        if (stepData.type) {
          learningPathData.type = stepData.type;
        }
      }

      let response;
      let isNewLearningPath = false;
      if (currentLearningPath) {
        // Update existing learning path
        response = await axiosInstance.put(
          `/coursePackages/${currentLearningPath._id}`,
          learningPathData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new learning path (only on first step)
        if (stepNumber === 0) {
          isNewLearningPath = true;
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
        } else {
          toast.error(
            text("error_creating_learning_path") ||
              "Error: Please complete step 1 first"
          );
          return { success: false };
        }
      }

      if (response?.data?.data) {
        const learningPath = response.data.data as ILearningPath;
        setCurrentLearningPath(learningPath);
        toast.success(
          isNewLearningPath
            ? text("learning_path_created_successfully")
            : text("learning_path_updated_successfully")
        );
        return { success: true, learningPath };
      }

      return { success: false };
    } catch (error) {
      console.error("Error saving learning path step:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        text("error_creating_learning_path");
      toast.error(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    text,
    isEditMode,
    isInitialized,
    isFetchingLearningPath,
    learningPathId,
    currentLearningPath,
    initialStep,
    courses,
    selectedCourses,
    setSelectedCourses,
    fetchCourses,
    submitStepData,
  };
};
