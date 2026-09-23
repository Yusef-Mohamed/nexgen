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
import { useAssessmentDialog } from "./useAssessmentDialog";
import AssessmentFormSkeleton from "./AssessmentFormSkeleton";
import { getDynamicString } from "@/lib/utils";

interface AssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: ILesson | null;
  courseId: string;
  onAssessmentUpdated: (lessonData?: unknown) => void;
}

const AssessmentDialog = ({
  open,
  onOpenChange,
  lesson,
  courseId,
  onAssessmentUpdated,
}: AssessmentDialogProps) => {
  const {
    loading,
    fetchedLesson,
    fetchingLesson,
    fetchError,
    fetchLesson,
    assignmentFile,
    form,
    onSubmit,
    handleAssignmentFileSelected,
    removeAssignmentFile,
    text,
  } = useAssessmentDialog({
    lesson,
    courseId,
    onAssessmentUpdated,
    open,
  });

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
            {text("lesson_assessment")} -{" "}
            {getDynamicString(lesson?.title || "")}
          </DialogTitle>
        </DialogHeader>

        {fetchError && (
          <div role="alert" className="space-y-2 text-destructive">
            <p>{text("something_wrong")}</p>
            <Button type="button" variant="outline" onClick={() => lesson?._id && fetchLesson(lesson._id)}>
              {text("try_again")}
            </Button>
          </div>
        )}
        {fetchingLesson ? (
          <AssessmentFormSkeleton />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Assignment Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assignmentTitle.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("validation.assignment_title")} ({text("english")}
                        )
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={text(
                            "validation.enter_assignment_title"
                          )}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignmentTitle.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("validation.assignment_title")} ({text("arabic")})
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={text(
                            "validation.enter_assignment_title"
                          )}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Assignment Description Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assignmentDescription.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("validation.assignment_description")} (
                        {text("english")})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={text(
                            "validation.enter_assignment_description"
                          )}
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
                  name="assignmentDescription.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("validation.assignment_description")} (
                        {text("arabic")})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={text(
                            "validation.enter_assignment_description"
                          )}
                          className={commonFormStyles}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Assignment File Upload */}
              <div className="space-y-2">
                <FormLabel>{text("validation.assignment_file")}</FormLabel>
                <FileInput
                  multiple={false}
                  onFilesSelected={handleAssignmentFileSelected}
                  description={text("validation.assignment_file_description")}
                />
                {assignmentFile && (
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm">{assignmentFile.name}</span>
                    <button
                      type="button"
                      onClick={removeAssignmentFile}
                      className="text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {fetchedLesson?.assignmentFile && !assignmentFile && (
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm">
                      {text("current_assignment_file")}:{" "}
                      <a
                        href={fetchedLesson.assignmentFile}
                        target="_blank"
                        className="text-primary underline"
                      >
                        {fetchedLesson.assignmentFile}
                      </a>
                    </span>
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
            disabled={loading}
          >
            {text("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={loading || fetchingLesson || fetchError}
            onClick={
              !fetchingLesson ? form.handleSubmit(handleSubmit) : undefined
            }
          >
            {(loading || fetchingLesson) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {fetchingLesson ? text("loading") : text("save_assessment")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentDialog;
