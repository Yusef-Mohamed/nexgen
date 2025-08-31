"use client";
import { useTranslations } from "next-intl";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

interface DeleteConfirmationDialogsProps {
  deletingSectionId: string | null;
  deletingLessonId: string | null;
  isDeleting: boolean;
  isDeletingLesson: boolean;
  onCancelSection: () => void;
  onCancelLesson: () => void;
  onConfirmSection: () => void;
  onConfirmLesson: () => void;
}

const DeleteConfirmationDialogs = ({
  deletingSectionId,
  deletingLessonId,
  isDeleting,
  isDeletingLesson,
  onCancelSection,
  onCancelLesson,
  onConfirmSection,
  onConfirmLesson,
}: DeleteConfirmationDialogsProps) => {
  const text = useTranslations("courses");
  const postActionText = useTranslations("postAction");

  return (
    <>
      <ConfirmationDialog
        open={!!deletingSectionId}
        title={postActionText("areYouSure")}
        description={postActionText("delete_confirmation")}
        isLoading={isDeleting}
        onCancel={onCancelSection}
        onConfirm={onConfirmSection}
      />

      <ConfirmationDialog
        open={!!deletingLessonId}
        title={postActionText("areYouSure")}
        description={text("delete_lesson_confirmation")}
        isLoading={isDeletingLesson}
        onCancel={onCancelLesson}
        onConfirm={onConfirmLesson}
      />
    </>
  );
};

export default DeleteConfirmationDialogs;
