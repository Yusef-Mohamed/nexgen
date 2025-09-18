"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileInput from "@/components/ui/file-input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { ILesson } from "@/types";
import { useLessonEditDialog } from "./useLessonEditDialog";
import LessonFormSkeleton from "./LessonFormSkeleton";

interface LessonEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: ILesson | null;
  courseId: string;
  sectionId: string;
  onLessonUpdated: (lessonData?: unknown, isEdit?: boolean) => void;
  isEdit: boolean;
  lessonIndex?: number;
  lessonsLength: number;
}

const LessonEditDialog = ({
  open,
  onOpenChange,
  lesson,
  courseId,
  sectionId,
  onLessonUpdated,
  isEdit,
  lessonIndex,
  lessonsLength,
}: LessonEditDialogProps) => {
  const {
    loading,
    attachments,
    fetchingLesson,
    form,
    onSubmit,
    handleAttachmentFilesSelected,
    removeAttachment,
    text,
  } = useLessonEditDialog({
    lesson,
    courseId,
    sectionId,
    onLessonUpdated,
    isEdit,
    lessonIndex,
    lessonsLength,
  });

  // Section is supplied by parent via sectionId; no fetching needed

  const handleSubmit = async (data: Parameters<typeof onSubmit>[0]) => {
    const success = await onSubmit(data);
    if (success) {
      onOpenChange(false);
    }
  };

  const commonFormStyles = "!px-4 !py-3 !h-auto !rounded-md";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl max-h-[90vh] overflow-y-auto"
        isOpen={open}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? text("validation.edit_lesson")
              : text("validation.create_lesson")}
          </DialogTitle>
        </DialogHeader>

        {isEdit && fetchingLesson ? (
          <LessonFormSkeleton />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("validation.title")} ({text("english")})
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={text("validation.enter_title")}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("validation.title")} ({text("arabic")})
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={text("validation.enter_title")}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="description.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("description")} ({text("english")})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={text("validation.enter_description")}
                          className={commonFormStyles}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("description")} ({text("arabic")})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={text("validation.enter_description")}
                          className={commonFormStyles}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration and Order */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="lessonDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("duration")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder={text("validation.enter_duration")}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Video URL */}
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{text("validation.video_url")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={text("validation.enter_video_url")}
                        className={commonFormStyles}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section is determined by where Add was clicked; no field shown */}

              {/* Attachments Upload */}
              <div className="space-y-2">
                <FormLabel>{text("validation.attachments")}</FormLabel>
                <FileInput
                  accept="image/png,image/jpeg,application/pdf"
                  multiple
                  onFilesSelected={handleAttachmentFilesSelected}
                  description={text("validation.attachments")}
                />
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            removeAttachment(index);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </Form>
        )}

        {/* Dialog Footer */}
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || (isEdit && fetchingLesson)}
          >
            {text("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={loading || (isEdit && fetchingLesson)}
            onClick={
              !(isEdit && fetchingLesson)
                ? form.handleSubmit(handleSubmit)
                : undefined
            }
          >
            {(loading || (isEdit && fetchingLesson)) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEdit && fetchingLesson
              ? text("loading")
              : isEdit
              ? text("save_changes")
              : text("validation.create_lesson")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonEditDialog;
