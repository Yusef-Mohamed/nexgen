import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ILesson } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";

interface UseAssessmentDialogProps {
  lesson?: ILesson | null;
  courseId: string;
  onAssessmentUpdated: (lessonData?: unknown) => void;
}

export const useAssessmentDialog = ({
  lesson,
  onAssessmentUpdated,
}: UseAssessmentDialogProps) => {
  const text = useTranslations("courses");
  const [loading, setLoading] = useState(false);
  const [fetchedLesson, setFetchedLesson] = useState<ILesson | null>(null);
  const [fetchingLesson, setFetchingLesson] = useState(false);
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);

  const createValidationSchema = () =>
    z.object({
      assignmentTitle: z.object({
        en: z.string().min(3, { message: text("validation.title_required") }),
        ar: z.string().min(3, { message: text("validation.title_required") }),
      }),
      assignmentDescription: z.object({
        en: z
          .string()
          .min(10, { message: text("validation.description_required") }),
        ar: z
          .string()
          .min(10, { message: text("validation.description_required") }),
      }),
    });

  const form = useForm<z.infer<ReturnType<typeof createValidationSchema>>>({
    resolver: zodResolver(createValidationSchema()),
    defaultValues: {
      assignmentTitle: { en: "", ar: "" },
      assignmentDescription: { en: "", ar: "" },
    },
  });

  // Fetch lesson data when dialog opens
  useEffect(() => {
    if (lesson?._id) {
      console.log("Assessment dialog opened, fetching lesson:", lesson._id);
      fetchLesson(lesson._id);
    } else {
      setFetchedLesson(null);
    }
  }, [lesson?._id]);

  // Update form with fetched lesson data when it's available
  useEffect(() => {
    if (fetchedLesson) {
      // Use localized assignment data if available, fallback to regular fields
      const titleEn =
        fetchedLesson.translationAssignmentTitle?.en ||
        fetchedLesson.assignmentTitle ||
        "";
      const titleAr =
        fetchedLesson.translationAssignmentTitle?.ar ||
        fetchedLesson.assignmentTitle ||
        "";
      const descriptionEn =
        fetchedLesson.translationAssignmentDescription?.en ||
        fetchedLesson.assignmentDescription ||
        "";
      const descriptionAr =
        fetchedLesson.translationAssignmentDescription?.ar ||
        fetchedLesson.assignmentDescription ||
        "";

      form.reset({
        assignmentTitle: {
          en: titleEn,
          ar: titleAr,
        },
        assignmentDescription: {
          en: descriptionEn,
          ar: descriptionAr,
        },
      });

      console.log("Assessment form updated with localized data:", {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        assignmentFile: fetchedLesson.assignmentFile,
      });
    } else {
      form.reset({
        assignmentTitle: { en: "", ar: "" },
        assignmentDescription: { en: "", ar: "" },
      });
      setAssignmentFile(null);
    }
  }, [fetchedLesson, form]);

  // Fetch single lesson data
  const fetchLesson = async (lessonId: string) => {
    if (!lessonId) return;

    setFetchingLesson(true);
    try {
      const response = await axiosInstance.get(`/lessons/${lessonId}`);
      const lessonData = response?.data?.data.lesson;

      if (lessonData) {
        setFetchedLesson(lessonData);
        console.log("Fetched lesson data for assessment:", lessonData);
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message || typedError?.message;
      console.error("Fetch error:", errorMessage);
    } finally {
      setFetchingLesson(false);
    }
  };

  const handleAssignmentFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setAssignmentFile(files[0]);
    }
  };

  const removeAssignmentFile = () => {
    setAssignmentFile(null);
  };

  const onSubmit = async (
    data: z.infer<ReturnType<typeof createValidationSchema>>
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Add multilingual assignment fields
      formData.append("assignmentTitle[en]", data.assignmentTitle.en);
      formData.append("assignmentTitle[ar]", data.assignmentTitle.ar);
      formData.append(
        "assignmentDescription[en]",
        data.assignmentDescription.en
      );
      formData.append(
        "assignmentDescription[ar]",
        data.assignmentDescription.ar
      );

      // Add assignment file if selected
      if (assignmentFile) {
        formData.append("assignmentFile", assignmentFile);
      }

      const response = await axiosInstance.put(
        `/lessons/${lesson!._id}`,
        formData
      );

      onAssessmentUpdated(response?.data?.data);
      return true; // Success
    } catch (error) {
      console.error("Error saving assessment:", error);
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
    fetchedLesson,
    fetchingLesson,
    assignmentFile,

    // Form
    form,

    // Actions
    onSubmit,
    handleAssignmentFileSelected,
    removeAssignmentFile,

    // Text
    text,
  };
};
