import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ILesson } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";

interface UseLessonEditDialogProps {
  lesson?: ILesson | null;
  courseId: string;
  sectionId: string;
  onLessonUpdated: (lessonData?: unknown, isEdit?: boolean) => void;
  isEdit: boolean;
  lessonIndex?: number;
  lessonsLength: number;
}

export const useLessonEditDialog = ({
  lesson,
  courseId,
  sectionId,
  onLessonUpdated,
  isEdit,
  lessonIndex,
  lessonsLength,
}: UseLessonEditDialogProps) => {
  const text = useTranslations("courses");
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

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
      isRequireAnalytic: z.boolean(),
    });

  const form = useForm<z.infer<ReturnType<typeof createValidationSchema>>>({
    resolver: zodResolver(createValidationSchema()),
    defaultValues: {
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      lessonDuration: "",
      videoUrl: "",
      isRequireAnalytic: false,
    },
  });

  // Reset form when dialog opens/closes or lesson changes
  useEffect(() => {
    if (isEdit && lesson) {
      // Edit mode - populate form with existing lesson data
      form.reset({
        title: {
          en: lesson.title,
          ar: lesson.title,
        },
        description: {
          en: lesson.description,
          ar: lesson.description,
        },
        lessonDuration: lesson.lessonDuration?.toString() || "",
        videoUrl: lesson.videoUrl || "",
        isRequireAnalytic: lesson.isRequireAnalytic || false,
      });
    } else {
      // Add mode - reset form to defaults
      form.reset({
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
        lessonDuration: "",
        videoUrl: "",
        isRequireAnalytic: false,
      });
    }
    // Reset file states
    setAttachments([]);
  }, [isEdit, lesson, form]);

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

  const onSubmit = async (
    data: z.infer<ReturnType<typeof createValidationSchema>>
  ) => {
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

      // Compute order based on lesson index within the section
      const computedOrder: number =
        isEdit && lesson
          ? Math.max(1, typeof lessonIndex === "number" ? lessonIndex + 1 : 1)
          : Math.max(1, lessonsLength + 1);
      formData.append("order", computedOrder.toString());

      formData.append("videoUrl", data.videoUrl);
      formData.append("isRequireAnalytic", data.isRequireAnalytic.toString());
      formData.append("section", sectionId);
      formData.append("course", courseId);

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

      onLessonUpdated(response?.data?.data, isEdit);
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

    // Form
    form,

    // Actions
    onSubmit,
    handleAttachmentsChange,
    handleAttachmentFilesSelected,
    removeAttachment,

    // Text
    text,
  };
};
