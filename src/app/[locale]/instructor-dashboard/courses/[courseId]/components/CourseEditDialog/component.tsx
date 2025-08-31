"use client";
import { useEffect } from "react";
import { ICourse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import FileInput from "@/components/ui/file-input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2, Edit, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourseEditDialog } from "./useCourseEditDialog";

interface CourseEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: ICourse | null;
  onCourseUpdated: (updatedCourse?: ICourse) => void;
}

const commonFormStyles =
  "!px-4 !py-3 !h-auto !rounded-md min-h-12 items-center";

const CourseEditDialog = ({
  open,
  onOpenChange,
  course,
  onCourseUpdated,
}: CourseEditDialogProps) => {
  const {
    loading,
    categories,
    courses,
    accessibleCourses,
    setAccessibleCourses,
    imagePreview,
    form,
    onSubmit,
    handleImageFilesSelected,
    fetchCategories,
    fetchCourses,
    text,
  } = useCourseEditDialog({ course, onCourseUpdated });

  // Fetch categories and courses when dialog opens
  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchCourses();
    }
  }, [open, fetchCategories, fetchCourses]);

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
            <Edit className="w-5 h-5" />
            {text("edit_course")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Image Upload */}
            <div className="space-y-2">
              {(imagePreview || course?.image) && (
                <div className="mb-2 w-fit mx-auto">
                  <img
                    src={imagePreview || course?.image}
                    alt={text("current_course_image")}
                    className="w-32 h-32 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
              <FormLabel>{text("course_image")}</FormLabel>
              <FileInput
                accept="image/png,image/jpeg"
                multiple={false}
                onFilesSelected={(files) => handleImageFilesSelected(files)}
              />
            </div>

            {/* Basic Information */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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
                          placeholder={text("enter_description_english")}
                          rows={4}
                          className={cn(commonFormStyles, "!rounded-e-none")}
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
                  name="description.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("description")} ({text("arabic")})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={text("enter_description_arabic")}
                          rows={4}
                          className={cn(commonFormStyles, "!rounded-e-none")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="highlights.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("highlights")} ({text("english")})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={text("enter_highlights_english")}
                          rows={4}
                          className={cn(commonFormStyles, "!rounded-e-none")}
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
                  name="highlights.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("highlights")} ({text("arabic")})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={text("enter_highlights_arabic")}
                          rows={4}
                          className={cn(commonFormStyles, "!rounded-e-none")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="certificateDescription.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("certificate_description")} ({text("english")})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={text(
                            "enter_certificate_description_english"
                          )}
                          rows={4}
                          className={cn(commonFormStyles, "!rounded-e-none")}
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
                  name="certificateDescription.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("certificate_description")} ({text("arabic")})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={text(
                            "enter_certificate_description_arabic"
                          )}
                          rows={4}
                          className={cn(commonFormStyles, "!rounded-e-none")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("category")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={commonFormStyles}>
                            <SelectValue
                              placeholder={text("select_category")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("type")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={commonFormStyles}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">
                            {text("beginner")}
                          </SelectItem>
                          <SelectItem value="intermediate">
                            {text("intermediate")}
                          </SelectItem>
                          <SelectItem value="advanced">
                            {text("advanced")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("rating")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={commonFormStyles}>
                            <SelectValue placeholder={text("select_rating")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>{text("rating_hint")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="courseDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {text("course_duration")} ({text("minutes")})
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder={text("enter_duration")}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("price")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder={text("enter_price")}
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
                  name="priceAfterDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("price_after_discount")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder={text("enter_price_after_discount")}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Switch for Need Accessible Course */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="needAccessibleCourse"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {text("need_accessible_course")}
                      </FormLabel>
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
            </div>

            {/* Accessible Courses Selection - Only show when needAccessibleCourse is true */}
            {form.watch("needAccessibleCourse") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>{text("accessible_courses")}</FormLabel>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      const selectedCourse = courses?.find(
                        (course) => course._id === value
                      );
                      if (
                        selectedCourse &&
                        !accessibleCourses.find((c) => c._id === value)
                      ) {
                        setAccessibleCourses((prev) => [
                          ...prev,
                          selectedCourse,
                        ]);
                      }
                    }}
                  >
                    <SelectTrigger className={commonFormStyles}>
                      <SelectValue
                        placeholder={text("select_accessible_courses")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Display selected accessible courses */}
                {accessibleCourses.length > 0 && (
                  <div className="flex flex-wrap items-center gap-4">
                    {accessibleCourses.map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
                      >
                        <span className="text-sm">{course.title}</span>
                        <button
                          onClick={() =>
                            setAccessibleCourses((prev) =>
                              prev.filter((c) => c._id !== course._id)
                            )
                          }
                          type="button"
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="bgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("background_color")}</FormLabel>
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
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
                  name="bgDarkMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("background_dark_mode")}</FormLabel>
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
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
                  name="fontColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("font_color")}</FormLabel>
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
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
                  name="fontDarkMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{text("font_dark_mode")}</FormLabel>
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
                          className={commonFormStyles}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {text("cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {text("save_changes")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditDialog;
