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
import { Switch } from "@/components/ui/switch";
import { Loader2, X } from "lucide-react";
import { ILesson } from "@/types";
import { useLessonEditDialog } from "./useLessonEditDialog";

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
    image,
    attachments,
    imagePreview,
    form,
    onSubmit,
    handleImageFilesSelected,
    handleAttachmentFilesSelected,
    removeAttachment,
    text,
    resetImage,
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
        className="sm:max-w-7xl max-h-[90vh] overflow-y-auto"
        isOpen={open}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? text("validation.edit_lesson")
              : text("validation.create_lesson")}
          </DialogTitle>
        </DialogHeader>

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

            {/* Require Analytic Switch */}
            <FormField
              control={form.control}
              name="isRequireAnalytic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {text("validation.require_analytic")}
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {text("validation.require_analytic_description")}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <FormLabel>{text("validation.image")}</FormLabel>
              <FileInput
                accept="image/png,image/jpeg"
                multiple={false}
                onFilesSelected={handleImageFilesSelected}
                description={text("validation.image")}
              />
              {(imagePreview || lesson?.image) && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview || lesson?.image}
                    alt={text("validation.image_preview")}
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        resetImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

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

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {text("cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit
                  ? text("save_changes")
                  : text("validation.create_lesson")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonEditDialog;
