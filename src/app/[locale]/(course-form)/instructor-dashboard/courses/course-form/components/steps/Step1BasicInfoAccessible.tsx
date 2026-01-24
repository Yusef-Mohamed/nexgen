import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn, getDynamicString } from "@/lib/utils";
import { X } from "lucide-react";
import { ICategory, ICourse } from "@/types";
import { CourseFormSchema } from "../../hooks/useCourseForm";
import ImageUploadField from "@/components/form/ImageUploadField";
import PromotionVideoField from "@/components/form/PromotionVideoField";

interface Step1BasicInfoAccessibleProps {
  form: UseFormReturn<CourseFormSchema>;
  categories: Array<ICategory>;
  courses: ICourse[];
  accessibleCourses: ICourse[];
  setAccessibleCourses: React.Dispatch<React.SetStateAction<ICourse[]>>;
  imagePreview: string | null;
  onImageFilesSelected: (files: File[]) => void;
  commonFormStyles: string;
  loading?: boolean;
}

const Step1BasicInfoAccessible: React.FC<Step1BasicInfoAccessibleProps> = ({
  form,
  categories,
  courses,
  accessibleCourses,
  setAccessibleCourses,
  imagePreview,
  onImageFilesSelected,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("courses");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("basic_info")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("basic_info_description")}
        </p>
      </div>

      {/* Course Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  disabled={loading}
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
                {text("title")} ({text("arabic")})
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={text("enter_title_arabic")}
                  className={commonFormStyles}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Course Description */}
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
                  placeholder={text("enter_description_english")}
                  rows={4}
                  className={cn(commonFormStyles, "!rounded-e-none")}
                  disabled={loading}
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
                  placeholder={text("enter_description_arabic")}
                  rows={4}
                  className={cn(commonFormStyles, "!rounded-e-none")}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Category and Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("category")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger className={commonFormStyles}>
                    <SelectValue placeholder={text("select_category")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {getDynamicString(category.title)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("type")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger className={commonFormStyles}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">{text("beginner")}</SelectItem>
                  <SelectItem value="intermediate">
                    {text("intermediate")}
                  </SelectItem>
                  <SelectItem value="advanced">{text("advanced")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Course Duration */}
      <div className="w-full">
        <FormField
          control={form.control}
          name="courseDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("course_duration")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder={text("enter_duration")}
                  className={commonFormStyles}
                  disabled={loading}
                  min="1"
                  max="1000"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Need Accessible Course Toggle */}
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
                  disabled={loading}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Accessible Courses Selection */}
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
                  setAccessibleCourses((prev) => [...prev, selectedCourse]);
                }
              }}
              disabled={loading}
            >
              <SelectTrigger className={commonFormStyles}>
                <SelectValue placeholder={text("select_accessible_courses")} />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {getDynamicString(course.title)}
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
                  className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
                >
                  <span className="text-sm">
                    {getDynamicString(course.title)}
                  </span>
                  <button
                    onClick={() =>
                      setAccessibleCourses((prev) =>
                        prev.filter((c) => c._id !== course._id)
                      )
                    }
                    type="button"
                    disabled={loading}
                    className="text-destructive hover:text-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Course Image - Last Input */}
      <div className="space-y-4 mt-8">
        <FormLabel className="text-base block font-semibold">
          {text("course_image")}
        </FormLabel>
        <ImageUploadField
          previewUrl={imagePreview}
          loading={loading}
          placeholderText={text("course_image_preview")}
          infoDescription={text("course_image_upload_instruction")}
          guidelinesTitle={text("guidelines")}
          guidelines={[
            text("course_image_guideline_size"),
            text("course_image_guideline_format"),
          ]}
          fileInputButtonText={text("upload_file")}
          fileInputDescription={text("no_file_selected")}
          onFilesSelected={onImageFilesSelected}
        />
      </div>

      {/* Promotion Video */}
      <PromotionVideoField
        form={form}
        name="promotionVideo"
        commonFormStyles={commonFormStyles}
        loading={loading}
      />
    </div>
  );
};

export default Step1BasicInfoAccessible;
