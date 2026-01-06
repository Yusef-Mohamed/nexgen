import { useState, useEffect } from "react";
import { ISection } from "@/types";
import { useTranslations } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { getStringObject } from "@/lib/utils";

interface UseSectionEditDialogProps {
  section?: ISection | null;
  onSectionUpdated: (sectionData?: ISection, isEdit?: boolean) => void;
  isEdit?: boolean;
  courseId: string;
  sectionIndex?: number;
  sectionsLength: number;
}

export const useSectionEditDialog = ({
  section,
  onSectionUpdated,
  isEdit = false,
  courseId,
  sectionIndex,
  sectionsLength,
}: UseSectionEditDialogProps) => {
  const text = useTranslations("courses");
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

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
    });
  };

  const schema = createValidationSchema();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: { ar: "", en: "" },
    },
  });

  // Initialize form data when section changes
  useEffect(() => {
    if (section && isEdit) {
      const title = getStringObject(section.title);
      form.reset({
        title: {
          ar: title.ar,
          en: title.en,
        },
      });
    } else {
      form.reset({
        title: { ar: "", en: "" },
      });
    }
  }, [section, form, isEdit]);

  const onSubmit = async (
    data: z.infer<ReturnType<typeof createValidationSchema>>
  ) => {
    if (!token) return;

    setLoading(true);
    try {
      const computedOrder: number =
        isEdit && section
          ? Math.max(1, typeof sectionIndex === "number" ? sectionIndex + 1 : 1)
          : Math.max(1, sectionsLength + 1);
      let response;
      if (isEdit && section) {
        response = await axiosInstance.put(`/sections/${section._id}`, {
          title: {
            ar: data.title.ar,
            en: data.title.en,
          },
          order: computedOrder,
          course: courseId,
        });
      } else {
        response = await axiosInstance.post(`/sections`, {
          title: {
            ar: data.title.ar,
            en: data.title.en,
          },
          order: computedOrder,
          course: courseId,
        });
      }

      // Update the section state with the response data
      if (response.data && response.data.data) {
        const updatedSection = response.data.data;
        onSectionUpdated(
          { ...updatedSection, sectionId: updatedSection._id },
          isEdit
        );
      }

      return true; // Success
    } catch (error: unknown) {
      console.error("Error saving section:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message || typedError?.message;
      console.error("Server error:", errorMessage);
      return false; // Error
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    loading,

    // Form
    form,

    // Actions
    onSubmit,

    // Text
    text,
  };
};
