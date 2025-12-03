"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { DynamicString, ICourse } from "@/types";
import { getStringObject } from "@/lib/utils";
import handleBackendFormErrors from "@/lib/handleBackendFormErrors";

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

  // Schema for highlights - require at least 1 item
  const highlightsSchema = z
    .array(highlightItemSchema)
    .min(
      1,
      text("what_will_learn_min_required") || "At least 1 item is required"
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
  whatWillLearn?: DynamicString[];
  coursePrerequisites?: DynamicString[];
  whoThisCourseFor?: DynamicString[];
  price: number;
  priceAfterDiscount?: number;
  type: string;
  courses?: ICourse[];
  title?: DynamicString;
  description?: DynamicString;
  highlights?: DynamicString[];
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  slug?: string;
  image?: string;
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const text = useTranslations("learningPathForm");
  const { token } = useAuth();

  const learningPathId = searchParams.get("learningPathId");
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit" || !!learningPathId;
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
        const formattedTitle = getStringObject(learningPath.title || "");
        const descriptionObject = getStringObject(
          learningPath.description || ""
        );

        form.reset({
          title: formattedTitle,
          description: descriptionObject,
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

        // Set image preview if image exists
        if (learningPath.image) {
          setImagePreview(learningPath.image);
        } else {
          setImagePreview(null);
        }
        setImage(null);
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

  // Handle image file selection
  const handleImageFilesSelected = useCallback(
    (files: File[]) => {
      const file = files?.[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error(text("validation.image_invalid") || "Invalid image type");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          text("validation.image_size") || "Image size must be less than 5MB"
        );
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

  // Add learningPathId to search params
  const addLearningPathIdToParams = useCallback(
    (learningPathId: string) => {
      const currentParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      currentParams.set("learningPathId", learningPathId);
      currentParams.set("mode", "create");
      currentParams.set("step", "1");
      router.push(`${pathname}?${currentParams.toString()}`);
    },
    [router, pathname]
  );

  // Check if step data has changes compared to current learning path
  const hasStepChanges = useCallback(
    (stepData: Partial<LearningPathFormData>, stepNumber: number) => {
      if (!currentLearningPath) return true; // Always submit for new learning paths
      const currentTitle = getStringObject(currentLearningPath.title || "");
      const currentDescription = getStringObject(
        currentLearningPath.description || ""
      );

      switch (stepNumber) {
        case 0: // Basic Info
          return (
            stepData.title?.en !== currentTitle.en ||
            stepData.title?.ar !== currentTitle.ar ||
            stepData.description?.en !== currentDescription.en ||
            stepData.description?.ar !== currentDescription.ar ||
            stepData.type !== currentLearningPath.type ||
            imagePreview !== currentLearningPath.image
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
              currentLearningPath.priceAfterDiscount?.toString()
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
      const formData = new FormData();

      // Add image if selected
      if (image) {
        formData.append("image", image);
      }

      // Prepare step-specific data
      if (stepNumber === 0) {
        // Step 1: Basic Info
        if (currentLearningPath) {
          // Compare with current learning path and only send changed fields
          const currentTitle = getStringObject(currentLearningPath.title || "");
          const currentDescription = getStringObject(
            currentLearningPath.description || ""
          );

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

          // Only send type if it changed
          if (
            stepData.type !== undefined &&
            stepData.type !== currentLearningPath.type
          ) {
            formData.append("type", stepData.type);
          }
        } else {
          // New learning path - send all fields
          if (stepData.title) {
            formData.append("title.en", stepData.title.en);
            formData.append("title.ar", stepData.title.ar);
          }
          if (stepData.description) {
            formData.append("description.en", stepData.description.en);
            formData.append("description.ar", stepData.description.ar);
          }
          if (stepData.type) {
            formData.append("type", stepData.type);
          }
        }
      } else if (stepNumber === 1) {
        // Step 2: Content (Courses)
        if (currentLearningPath) {
          // Only send courses if they changed
          const currentCourseIds = (currentLearningPath.courses || [])
            .map((c) => c._id || c.id)
            .sort();
          const selectedCourseIds = selectedCourses
            .map((c) => c._id || c.id)
            .sort();
          if (
            JSON.stringify(currentCourseIds) !==
            JSON.stringify(selectedCourseIds)
          ) {
            selectedCourses.forEach((course) => {
              formData.append("courses", course._id || course.id);
            });
          }
        } else {
          // New learning path - send all courses
          selectedCourses.forEach((course) => {
            formData.append("courses", course._id || course.id);
          });
        }
      } else if (stepNumber === 2) {
        // Step 3: Highlights
        if (currentLearningPath) {
          // Compare with current learning path and only send changed arrays
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

          // Only send whatWillLearn if it changed
          if (
            stepData.whatWillLearn &&
            Array.isArray(stepData.whatWillLearn) &&
            JSON.stringify(stepData.whatWillLearn) !==
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
            JSON.stringify(stepData.coursePrerequisites) !==
              JSON.stringify(currentPrerequisites)
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
            JSON.stringify(stepData.whoThisCourseFor) !==
              JSON.stringify(currentWhoFor)
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
          // New learning path - send all highlights
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
      } else if (stepNumber === 3) {
        // Step 4: Pricing
        if (currentLearningPath) {
          // Only send price if it changed
          if (
            stepData.price !== undefined &&
            stepData.price !== currentLearningPath.price?.toString()
          ) {
            formData.append("price", stepData.price);
          }

          // Only send priceAfterDiscount if it changed
          if (
            stepData.priceAfterDiscount !== undefined &&
            stepData.priceAfterDiscount !==
              currentLearningPath.priceAfterDiscount?.toString()
          ) {
            formData.append("priceAfterDiscount", stepData.priceAfterDiscount);
          }
        } else {
          // New learning path - send all pricing fields
          if (stepData.price) {
            formData.append("price", stepData.price);
          }
          if (stepData.priceAfterDiscount) {
            formData.append("priceAfterDiscount", stepData.priceAfterDiscount);
          }
        }
      }

      let response;
      if (currentLearningPath) {
        // Update existing learning path
        response = await axiosInstance.put(
          `/coursePackages/${currentLearningPath._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new learning path (only on first step)
        if (stepNumber === 0) {
          response = await axiosInstance.post("/coursePackages", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          const createdLearningPath = response.data.data as ILearningPath;
          setCurrentLearningPath(createdLearningPath);
          addLearningPathIdToParams(createdLearningPath._id);
          // Clear image after successful creation
          setImage(null);
          setImagePreview(null);
          toast.success(text("learning_path_created_successfully"));
          return { success: false };
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
        // Clear image after successful update
        if (image) {
          setImage(null);
          setImagePreview(learningPath.image || null);
        }
        toast.success(text("learning_path_updated_successfully"));
        return { success: true, learningPath };
      }

      return { success: false };
    } catch (error) {
      console.error("Error saving learning path step:", error);
      if (error instanceof AxiosError) {
        const fieldErrorsHandled = handleBackendFormErrors(form, error);
        if (fieldErrorsHandled) {
          toast.error(
            text("pleaseFillRequiredFields") ||
              "Please fill in all required fields"
          );
        } else {
          const errorMessage =
            error.response?.data?.message ||
            text("error_creating_learning_path");
          toast.error(errorMessage);
        }
      } else {
        toast.error(text("error_creating_learning_path"));
      }
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
    imagePreview,
    handleImageFilesSelected,
  };
};
