import React, { useState, useRef, useCallback } from "react";
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
import FileInput from "@/components/ui/file-input";
import { cn, getDynamicString } from "@/lib/utils";
import { X, Play } from "lucide-react";
import { ICategory, ICourse } from "@/types";
import { CourseFormSchema } from "../../hooks/useCourseForm";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback(
    (filesList: FileList | null) => {
      if (!filesList || filesList.length === 0) return;
      const files = Array.from(filesList);
      onImageFilesSelected(files);
    },
    [onImageFilesSelected]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;
      setIsDragOver(true);
    },
    [loading]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;
      setIsDragOver(true);
    },
    [loading]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;
      setIsDragOver(false);
    },
    [loading]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;
      setIsDragOver(false);
      const files = e.dataTransfer?.files ?? null;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [loading, handleFiles]
  );

  const handleClick = useCallback(() => {
    if (loading) return;
    fileInputRef.current?.click();
  }, [loading]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  // Extract YouTube video ID and convert to embed URL
  const extractYouTubeEmbedUrl = useCallback((input: string): string | null => {
    if (!input || input.trim() === "") return null;

    let videoId: string | null = null;

    // Check if it's already an embed URL or contains embed URL (for iframe code)
    const embedMatch = input.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) {
      videoId = embedMatch[1];
    }
    // Check if it's a watch URL
    else {
      const watchMatch = input.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
      if (watchMatch) {
        videoId = watchMatch[1];
      }
      // Check if it's a short URL (youtu.be)
      else {
        const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (shortMatch) {
          videoId = shortMatch[1];
        }
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
  }, []);

  // Watch the promotion video field value
  const promotionVideoValue = form.watch("promotionVideo");
  // Check if it's already an embed URL or extract from other formats
  const embedUrl = promotionVideoValue
    ? promotionVideoValue.startsWith("https://www.youtube.com/embed/")
      ? promotionVideoValue
      : extractYouTubeEmbedUrl(promotionVideoValue)
    : null;

  const handlePromotionVideoChange = useCallback(
    (value: string) => {
      const embedUrl = extractYouTubeEmbedUrl(value);
      if (embedUrl) {
        form.setValue("promotionVideo", embedUrl, { shouldValidate: true });
      } else {
        form.setValue("promotionVideo", value, { shouldValidate: true });
      }
    },
    [form, extractYouTubeEmbedUrl]
  );

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
        <FormLabel className="text-base font-semibold">
          {text("course_image")}
        </FormLabel>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Preview Placeholder with Drag and Drop */}
          <div
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex-shrink-0 w-full lg:w-[400px] h-[240px] rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-all cursor-pointer",
              {
                "bg-primary/5 border-primary border-solid": isDragOver,
                "bg-muted border-muted-foreground/30": !isDragOver,
                "opacity-60 cursor-not-allowed": loading,
              }
            )}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={text("course_image_preview")}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-2 opacity-60"
                >
                  {/* Landscape/Mountain icon similar to the reference */}
                  <path
                    d="M3 18L9 12L13 16L21 8V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18Z"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M3 18L7 14L13 20L21 10V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18Z"
                    fill="currentColor"
                    fillOpacity="0.6"
                  />
                  {/* Sun/Moon icon in upper left */}
                  <circle
                    cx="6"
                    cy="6"
                    r="2.5"
                    fill="currentColor"
                    fillOpacity="0.5"
                  />
                </svg>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              className="hidden"
              disabled={loading}
              onChange={handleFileChange}
            />
          </div>

          {/* Upload Instructions and Button */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                {text("course_image_upload_instruction")}
              </p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {text("guidelines")}
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>{text("course_image_guideline_size")}</li>
                  <li>{text("course_image_guideline_format")}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <FileInput
                accept="image/png,image/jpeg,image/jpg,image/gif"
                multiple={false}
                onFilesSelected={onImageFilesSelected}
                disabled={loading}
                buttonText={text("upload_file")}
                description={text("no_file_selected")}
                className="max-w-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Video */}
      <div className="space-y-4 mt-8">
        <FormLabel className="text-base font-semibold">
          {text("promotion_video")}
        </FormLabel>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Video Preview Placeholder */}
          <div className="flex-shrink-0 w-full lg:w-[400px] h-[240px] bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden">
            {embedUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title="Promotion Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Play className="w-16 h-16 mb-2 opacity-60" />
              </div>
            )}
          </div>

          {/* Video URL Input */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                {text("promotion_video_instruction")}
              </p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {text("accepted_formats")}
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>{text("promotion_video_format_1")}</li>
                  <li>{text("promotion_video_format_2")}</li>
                  <li>{text("promotion_video_format_3")}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="promotionVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          handlePromotionVideoChange(e.target.value);
                        }}
                        placeholder={text("enter_promotion_video_url")}
                        className={commonFormStyles}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfoAccessible;
