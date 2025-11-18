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
import { getStringObject } from "@/lib/utils";
import { DynamicString, ICourse, IPackage } from "@/types";

// Define the service form data interface
export interface ServiceFormData {
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
  subscriptionDurationDays: string;
}

// Define the course interface

// Define the service interface

export const useServiceForm = () => {
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFetchingService, setIsFetchingService] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [currentService, setCurrentService] = useState<IPackage | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const text = useTranslations("serviceForm");
  const { token } = useAuth();

  // Get service ID and mode from URL params
  const serviceId = searchParams.get("serviceId");
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit" || !!serviceId;
  const stepParam = searchParams?.get("step") || "0";
  const initialStep = stepParam ? parseInt(stepParam) : 0;

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

  // Create validation schema
  const createValidationSchema = () => {
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
      .max(
        50,
        text("highlights_array_max_length") || "Maximum 50 items allowed"
      )
      .default([]);

    return z.object({
      title: z.object({
        en: z
          .string()
          .min(1, text("title_en_required"))
          .min(3, text("title_en_min_length"))
          .max(100, text("title_en_max_length")),
        ar: z
          .string()
          .min(1, text("title_ar_required"))
          .min(3, text("title_ar_min_length"))
          .max(100, text("title_ar_max_length")),
      }),
      description: z.object({
        en: z
          .string()
          .min(1, text("description_en_required"))
          .min(10, text("description_en_min_length"))
          .max(1000, text("description_en_max_length")),
        ar: z
          .string()
          .min(1, text("description_ar_required"))
          .min(10, text("description_ar_min_length"))
          .max(1000, text("description_ar_max_length")),
      }),
      whatWillLearn: highlightsSchema,
      coursePrerequisites: highlightsSchema,
      whoThisCourseFor: highlightsSchema,
      price: z
        .string()
        .min(1, text("price_required"))
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
          message: text("price_positive_required"),
        }),
      priceAfterDiscount: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val) return true;
            return !isNaN(parseFloat(val)) && parseFloat(val) > 0;
          },
          {
            message: text("price_positive_required"),
          }
        ),
      subscriptionDurationDays: z
        .string()
        .min(1, text("subscription_duration_required"))
        .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
          message: text("subscription_duration_positive_required"),
        }),
    });
  };

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(createValidationSchema()),
    mode: "onSubmit", // Only validate on submit
    defaultValues: {
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      whatWillLearn: [],
      coursePrerequisites: [],
      whoThisCourseFor: [],
      price: "",
      priceAfterDiscount: "",
      subscriptionDurationDays: "",
    },
  });

  // Fetch service data for edit mode
  const fetchService = useCallback(
    async (serviceId: string) => {
      if (!token) return;

      try {
        setIsFetchingService(true);
        setLoading(true);
        const response = await axiosInstance.get(`/packages/${serviceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const service = response.data.data;

        setCurrentService(service);

        // Initialize form with service data
        const formattedTitle = getStringObject(
          service.translationTitle || service.title || ""
        );
        const formattedDescription = getStringObject(
          service.translationDescription || service.description || ""
        );

        form.reset({
          title: formattedTitle,
          description: formattedDescription,
          whatWillLearn:
            service.whatWillLearn?.map((h: DynamicString) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) ||
            service.translationHighlights?.map(
              (h: { en: string; ar: string }) => ({
                en: h.en || "",
                ar: h.ar || "",
              })
            ) ||
            [],
          coursePrerequisites:
            service.coursePrerequisites?.map((h: DynamicString) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [],
          whoThisCourseFor:
            service.whoThisCourseFor?.map((h: DynamicString) => {
              if (!h) return { en: "", ar: "" };
              const formatted = getStringObject(h);
              return {
                en: formatted.en || "",
                ar: formatted.ar || "",
              };
            }) || [],
          price: service.price?.toString() || "",
          priceAfterDiscount: service.priceAfterDiscount?.toString() || "",
          subscriptionDurationDays:
            service.subscriptionDurationDays?.toString() || "",
        });

        // Set selected course if it exists
        if (service.course) {
          setSelectedCourse(service.course);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error(text("failed_to_load_service"));
      } finally {
        setIsFetchingService(false);
        setLoading(false);
      }
    },
    [token, text, form]
  );

  // Initialize form
  useEffect(() => {
    setIsInitialized(true);

    if (isEditMode && serviceId) {
      fetchService(serviceId);
    }
  }, [isEditMode, serviceId, fetchService]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Add serviceId to search params
  const addServiceIdToParams = useCallback(
    (serviceId: string) => {
      const currentParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      currentParams.set("serviceId", serviceId);
      currentParams.set("mode", "create");
      currentParams.set("step", "1");
      router.push(`${pathname}?${currentParams.toString()}`);
    },
    [router, pathname]
  );

  // Check if step data has changes compared to current service
  const hasStepChanges = useCallback(
    (stepData: Partial<ServiceFormData>, stepNumber: number) => {
      if (!currentService) return true; // Always submit for new services
      const currentTitle = getStringObject(currentService.title || "");
      const currentDescription = getStringObject(
        currentService.description || ""
      );

      switch (stepNumber) {
        case 0: // Basic Info + Course
          return (
            stepData.title?.en !== currentTitle.en ||
            stepData.title?.ar !== currentTitle.ar ||
            stepData.description?.en !== currentDescription.en ||
            stepData.description?.ar !== currentDescription.ar ||
            (selectedCourse?._id || selectedCourse?.id) !==
              (currentService.course?._id || currentService.course?.id)
          );
        case 1: // Highlights
          // Compare highlights arrays
          const currentWhatWillLearn =
            currentService.whatWillLearn?.map((h) => {
              const formatted = getStringObject(h);
              return { en: formatted.en || "", ar: formatted.ar || "" };
            }) || [];
          const currentPrerequisites =
            currentService.coursePrerequisites?.map((h) => {
              const formatted = getStringObject(h);
              return { en: formatted.en || "", ar: formatted.ar || "" };
            }) || [];
          const currentWhoFor =
            currentService.whoThisCourseFor?.map((h) => {
              const formatted = getStringObject(h);
              return { en: formatted.en || "", ar: formatted.ar || "" };
            }) || [];

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
        case 2: // Pricing
          return (
            stepData.price !== currentService.price?.toString() ||
            stepData.priceAfterDiscount !==
              currentService.priceAfterDiscount?.toString() ||
            stepData.subscriptionDurationDays !==
              currentService.subscriptionDurationDays?.toString()
          );
        default:
          return true;
      }
    },
    [currentService, selectedCourse]
  );

  // Submit step data to server
  const submitStepData = async (
    stepData: Partial<ServiceFormData>,
    stepNumber: number
  ) => {
    if (!token) {
      toast.error(text("authentication_required") || "Authentication required");
      return { success: false };
    }

    // Check if there are changes before submitting
    if (!hasStepChanges(stepData, stepNumber)) {
      toast.success(text("no_changes_to_save") || "No changes to save");
      return { success: true, service: currentService };
    }

    setLoading(true);
    try {
      const serviceData: Record<string, unknown> = {};

      // Prepare step-specific data
      if (stepNumber === 0) {
        // Step 1: Basic Info + Course
        if (stepData.title) {
          serviceData.title = stepData.title;
        }
        if (stepData.description) {
          serviceData.description = stepData.description;
        }
        if (selectedCourse) {
          serviceData.course = selectedCourse._id || selectedCourse.id;
        }
      } else if (stepNumber === 1) {
        // Step 2: Highlights
        if (stepData.whatWillLearn) {
          serviceData.whatWillLearn = stepData.whatWillLearn;
        }
        if (stepData.coursePrerequisites) {
          serviceData.coursePrerequisites = stepData.coursePrerequisites;
        }
        if (stepData.whoThisCourseFor) {
          serviceData.whoThisCourseFor = stepData.whoThisCourseFor;
        }
      } else if (stepNumber === 2) {
        // Step 3: Pricing
        if (stepData.price) {
          serviceData.price = parseFloat(stepData.price);
        }
        if (stepData.priceAfterDiscount) {
          serviceData.priceAfterDiscount = parseFloat(
            stepData.priceAfterDiscount
          );
        }
        if (stepData.subscriptionDurationDays) {
          serviceData.subscriptionDurationDays = parseInt(
            stepData.subscriptionDurationDays
          );
        }
      }

      let response;
      if (currentService) {
        // Update existing service
        response = await axiosInstance.put(
          `/packages/${currentService._id}`,
          serviceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new service (only on first step)
        if (stepNumber === 0) {
          response = await axiosInstance.post("/packages", serviceData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const createdService = response.data.data as IPackage;
          setCurrentService(createdService);
          addServiceIdToParams(createdService._id);
          toast.success(text("service_created_successfully"));
          return { success: false };
        } else {
          toast.error(
            text("error_creating_service") ||
              "Error: Please complete step 1 first"
          );
          return { success: false };
        }
      }

      if (response?.data?.data) {
        const service = response.data.data as IPackage;
        setCurrentService(service);
        toast.success(text("service_updated_successfully"));
        return { success: true, service };
      }

      return { success: false };
    } catch (error) {
      console.error("Error saving service step:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || text("error_creating_service");
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
    isFetchingService,
    serviceId,
    currentService,
    initialStep,
    courses,
    selectedCourse,
    setSelectedCourse,
    fetchCourses,
    submitStepData,
  };
};
