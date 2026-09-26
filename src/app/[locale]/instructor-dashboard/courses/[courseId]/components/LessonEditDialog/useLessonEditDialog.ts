import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ILesson } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";
import { getStringObject } from "@/lib/utils";

interface UseLessonEditDialogProps {
  lesson?: ILesson | null;
  courseId: string;
  sectionId: string;
  onLessonUpdated: (lessonData?: unknown, isEdit?: boolean) => void;
  isEdit: boolean;
  lessonsLength: number;
  open?: boolean;
}

export const useLessonEditDialog = ({
  lesson,
  courseId,
  sectionId,
  onLessonUpdated,
  isEdit,
  lessonsLength,
  open,
}: UseLessonEditDialogProps) => {
  const text = useTranslations("courses");
  const locale = useLocale() as "en" | "ar";
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [fetchedLesson, setFetchedLesson] = useState<ILesson | null>(null);
  const [fetchingLesson, setFetchingLesson] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const createValidationSchema = () =>
    z.object({
      title: z.object({
        en: z.string().min(3, { message: text("validation.title_required") }),
        ar: z.string().min(3, { message: text("validation.title_required") }),
      }),
      description: z.object({
        en: z
          .string()
          .min(10, { message: text("validation.description_required") }),
        ar: z
          .string()
          .min(10, { message: text("validation.description_required") }),
      }),
      lessonDuration: z
        .string()
        .min(1, { message: text("validation.duration_required") }),
      videoUrl: z
        .string()
        .min(1, { message: text("validation.video_url_required") }),
    });

  const form = useForm<z.infer<ReturnType<typeof createValidationSchema>>>({
    resolver: zodResolver(createValidationSchema()),
    defaultValues: {
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      lessonDuration: "",
      videoUrl: "",
    },
  });

  // Fetch lesson data when dialog opens in edit mode
  useEffect(() => {
    if (open && isEdit && lesson?._id) {
      console.log("Dialog opened in edit mode, fetching lesson:", lesson._id);
      fetchLesson(lesson._id);
    } else if (!open) {
      // Clear form and state when dialog closes
      setFetchedLesson(null);
      setFetchError(false);
      form.reset({
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
        lessonDuration: "",
        videoUrl: "",
      });
      setAttachments([]);
    } else if (!isEdit) {
      // Reset fetched lesson when not in edit mode
      setFetchedLesson(null);
      setFetchError(false);
    }
  }, [open, isEdit, lesson?._id, form]);

  // Update form with fetched lesson data when it's available
  useEffect(() => {
    if (isEdit && fetchedLesson) {
      const title = getStringObject(fetchedLesson.title);
      const description = getStringObject(fetchedLesson.description);
      // Use localized data if available, fallback to regular fields

      form.reset({
        title: {
          en: title.en,
          ar: title.ar,
        },
        description: {
          en: description.en,
          ar: description.ar,
        },
        lessonDuration: fetchedLesson.lessonDuration?.toString() || "",
        videoUrl: fetchedLesson.videoUrl || "",
      });
    } else {
      form.reset({
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
        lessonDuration: "",
        videoUrl: "",
      });
    }
    setAttachments([]);
  }, [isEdit, fetchedLesson, form]);

  const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      const filtered = Array.from(files).filter((f) =>
        allowedTypes.includes(f.type)
      );
      setAttachments((prev) => [...prev, ...filtered]);
    }
    // Clear input value so the filename doesn't persist in the UI
    if (e.target) {
      try {
        e.target.value = "";
      } catch {}
    }
  };

  const handleAttachmentFilesSelected = (files: File[]) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    const filtered = Array.from(files).filter((f) =>
      allowedTypes.includes(f.type)
    );
    if (filtered.length) setAttachments((prev) => [...prev, ...filtered]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

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

  const onSubmit = async (
    data: z.infer<ReturnType<typeof createValidationSchema>>
  ) => {
    if (fetchError || fetchingLesson) return false;
    setLoading(true);
    try {
      const formData = new FormData();

      // Add multilingual fields
      formData.append("title[en]", data.title.en);
      formData.append("title[ar]", data.title.ar);
      formData.append("description[en]", data.description.en);
      formData.append("description[ar]", data.description.ar);

      // Add other fields
      formData.append("lessonDuration", data.lessonDuration);

      formData.append("videoUrl", data.videoUrl);
      // Reordering owns placement updates. Editing text must not persist a
      // pending drag or reset the global lesson order to its section index.
      if (!isEdit) {
        formData.append("order", Math.max(1, lessonsLength + 1).toString());
        formData.append("section", sectionId);
        formData.append("course", courseId);
      }

      // Add files
      attachments.forEach((attachment) => {
        formData.append("attachments", attachment);
      });

      let response;
      if (isEdit && lesson) {
        // Edit existing lesson
        response = await axiosInstance.put(`/lessons/${lesson._id}`, formData);
      } else {
        // Create new lesson
        response = await axiosInstance.post("/lessons", formData);
      }

      await onLessonUpdated({ ...response?.data?.data, title: { ...data.title, localized: data.title[locale] }, description: { ...data.description, localized: data.description[locale] } }, isEdit);
      // Clear form after successful submission
      form.reset({
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
        lessonDuration: "",
        videoUrl: "",
      });
      setAttachments([]);
      return true; // Success
    } catch (error) {
      console.error("Error saving lesson:", error);
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
    attachments,
    fetchedLesson,
    fetchingLesson,
    fetchError,

    // Form
    form,

    // Actions
    onSubmit,
    handleAttachmentsChange,
    handleAttachmentFilesSelected,
    removeAttachment,
    fetchLesson,

    // Text
    text,
  };
};
