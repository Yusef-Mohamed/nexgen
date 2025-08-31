"use client";
import { ISection } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Edit, Plus } from "lucide-react";
import { useSectionEditDialog } from "./useSectionEditDialog";

interface SectionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: ISection | null;
  onSectionUpdated: (sectionData?: ISection, isEdit?: boolean) => void;
  isEdit?: boolean;
  courseId: string;
  sectionIndex?: number;
  sectionsLength: number;
}

const commonFormStyles = "!px-4 !py-3 !h-auto !rounded-md";

const SectionEditDialog = ({
  open,
  onOpenChange,
  section,
  courseId,
  onSectionUpdated,
  isEdit = false,
  sectionIndex,
  sectionsLength,
}: SectionEditDialogProps) => {
  const { loading, form, onSubmit, text } = useSectionEditDialog({
    section,
    onSectionUpdated,
    isEdit,
    courseId,
    sectionIndex,
    sectionsLength,
  });

  const handleSubmit = async (data: Parameters<typeof onSubmit>[0]) => {
    const success = await onSubmit(data);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-7xl max-h-[90vh] overflow-y-auto"
        isOpen={open}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <>
                <Edit className="w-5 h-5" />
                {text("edit_section")}
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {text("add_new_section")}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Section Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="title.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("title")} ({text("english")})
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={text("enter_title_english")}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="title.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("title")} ({text("arabic")})
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={text("enter_title_arabic")}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Order is computed automatically based on section index/length */}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {text("cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? text("save_changes") : text("create_section")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionEditDialog;
