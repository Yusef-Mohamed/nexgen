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
  highlights: {
    en: string[];
    ar: string[];
  };
  price: string;
  priceAfterDiscount?: string;
  subscriptionDurationDays: string;
}

// Define the course interface
export interface ICourse {
  _id: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  category: {
    _id: string;
    title: string;
  };
  instructor: {
    _id: string;
    name: string;
    email: string;
    profileImg: string;
  };
  courseDuration: number;
  type: string;
  highlights: string[];
  image?: string;
  status?: string;
}

// Define the service interface
export interface IService {
  _id: string;
  id?: string;
  title: string;
  description: string;
  highlights: string[];
  price: number;
  priceAfterDiscount?: number;
  type: string;
  subscriptionDurationDays: number;
  course?: ICourse;
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
  image?: string;
}

export const useServiceForm = () => {
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const searchParams = useSearchParams();
  const text = useTranslations("serviceForm");
  const { token } = useAuth();
  const router = useRouter();

  // Get service ID and mode from URL params
  const serviceId = searchParams.get("serviceId");
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit" && serviceId;

  // Fetch courses for selection
  const fetchCourses = useCallback(async () => {
    try {
      const coursesResponse = await axiosInstance.get("/courses?limit=1000");
      setCourses(coursesResponse.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  // Create validation schema
  const createValidationSchema = () => {
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
      type: z.string().min(1, text("type_required")),
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
      highlights: { en: [""], ar: [""] },
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
        setLoading(true);
        const response = await axiosInstance.get(`/packages/${serviceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const service = response.data.data;
        console.log("Service Data:", service);
        console.log("Service Type:", typeof service);

        // Initialize form with service data
        form.reset({
          title: {
            en: service.translationTitle?.en || service.title || "",
            ar: service.translationTitle?.ar || service.title || "",
          },
          description: {
            en: service.translationDescription?.en || service.description || "",
            ar: service.translationDescription?.ar || service.description || "",
          },
          highlights: {
            en:
              service.translationHighlights?.map(
                (h: { en: string; ar: string }) => h.en
              ) ||
              service.highlights ||
              [],
            ar:
              service.translationHighlights?.map(
                (h: { en: string; ar: string }) => h.ar
              ) ||
              service.highlights ||
              [],
          },
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

  const onSubmit = async (data: ServiceFormData) => {
    setLoading(true);

    try {
      // Validate price logic
      if (
        data.priceAfterDiscount &&
        parseFloat(data.priceAfterDiscount) >= parseFloat(data.price)
      ) {
        form.setError("priceAfterDiscount", {
          type: "manual",
          message: text("price_discount_validation"),
        });
        return;
      }

      // Prepare service data
      const serviceData = {
        title: data.title,
        description: data.description,
        highlights: data.highlights,
        price: parseFloat(data.price),
        priceAfterDiscount: data.priceAfterDiscount
          ? parseFloat(data.priceAfterDiscount)
          : undefined,
        subscriptionDurationDays: parseInt(data.subscriptionDurationDays),
        course: selectedCourse?._id || selectedCourse?.id,
      };

      if (isEditMode && serviceId) {
        // Update existing service
        await axiosInstance.put(`/packages/${serviceId}`, serviceData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(text("service_updated_successfully"));
      } else {
        // Create new service
        await axiosInstance.post("/packages", serviceData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(text("service_created_successfully"));
      }

      // Redirect to packages page
      router.push("/instructor-dashboard/courses?type=service");
    } catch (error) {
      console.error("Error saving service:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || text("error_creating_service");
      toast.error(errorMessage);
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
    serviceId,
    courses,
    selectedCourse,
    setSelectedCourse,
    fetchCourses,
  };
};
