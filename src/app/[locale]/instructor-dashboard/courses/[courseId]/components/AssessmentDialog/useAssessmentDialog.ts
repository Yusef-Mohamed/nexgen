import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ILesson } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";
import { getStringObject } from "@/lib/utils";

interface UseAssessmentDialogProps {
  lesson?: ILesson | null;
  courseId: string;
  onAssessmentUpdated: (lessonData?: unknown) => void;
  open?: boolean;
}

export const useAssessmentDialog = ({
  lesson,
  onAssessmentUpdated,
  open,
}: UseAssessmentDialogProps) => {
  const text = useTranslations("courses");
  const [loading, setLoading] = useState(false);
  const [fetchedLesson, setFetchedLesson] = useState<ILesson | null>(null);
  const [fetchingLesson, setFetchingLesson] = useState(false);
  const [fetchError, setFetchError] = useState(false);
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
    if (open && lesson?._id) {
      console.log("Assessment dialog opened, fetching lesson:", lesson._id);
      fetchLesson(lesson._id);
    } else if (!open) {
      // Clear form and state when dialog closes
      setFetchedLesson(null);
      setFetchError(false);
      form.reset({
        assignmentTitle: { en: "", ar: "" },
        assignmentDescription: { en: "", ar: "" },
      });
      setAssignmentFile(null);
    }
  }, [open, lesson?._id, form]);

  // Update form with fetched lesson data when it's available
  useEffect(() => {
    if (fetchedLesson) {
      // Use localized assignment data if available, fallback to regular fields
      const title = getStringObject(fetchedLesson.assignmentTitle);
      const description = getStringObject(fetchedLesson.assignmentDescription);

      form.reset({
        assignmentTitle: {
          en: title.en,
          ar: title.ar,
        },
        assignmentDescription: {
          en: description.en,
          ar: description.ar,
        },
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
    setFetchError(false);
    try {
      const response = await axiosInstance.get(`/lessons/${lessonId}/manage`);
      const lessonData = response?.data?.data.lesson;

      if (!lessonData) throw new Error("Lesson response is missing");
      if (lessonData) {
        setFetchedLesson(lessonData);
      }
    } catch (error) {
      setFetchError(true);
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
    if (fetchError || fetchingLesson) return false;
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
      // Clear form after successful submission
      form.reset({
        assignmentTitle: { en: "", ar: "" },
        assignmentDescription: { en: "", ar: "" },
      });
      setAssignmentFile(null);
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
    fetchError,
    assignmentFile,

    // Form
    form,

    // Actions
    onSubmit,
    fetchLesson,
    handleAssignmentFileSelected,
    removeAssignmentFile,

    // Text
    text,
  };
};
