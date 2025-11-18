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
import { LearningPathFormData } from "../../hooks/useLearningPathForm";
import { cn } from "@/lib/utils";
import FileInput from "@/components/ui/file-input";

interface Step1BasicInfoProps {
  form: UseFormReturn<LearningPathFormData>;
  imagePreview: string | null;
  onImageFilesSelected: (files: File[]) => void;
  commonFormStyles: string;
  loading?: boolean;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  form,
  imagePreview,
  onImageFilesSelected,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("learningPathForm");
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

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("title_en")} / {text("title_ar")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("add_learning_path_description") ||
            "Enter the basic information for your learning path"}
        </p>
      </div>

      {/* Title Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="title.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("title_en")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={text("enter_title_en")}
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
              <FormLabel>{text("title_ar")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={text("enter_title_ar")}
                  className={commonFormStyles}
                  disabled={loading}
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
              <FormLabel>{text("description_en")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_description_en")}
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
              <FormLabel>{text("description_ar")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={text("enter_description_ar")}
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

      {/* Type Field */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{text("type")}</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger className={commonFormStyles}>
                  <SelectValue placeholder={text("select_type")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="beginnerToIntermediate">
                  {text("beginner_to_intermediate")}
                </SelectItem>
                <SelectItem value="intermediateToAdvanced">
                  {text("intermediate_to_advanced")}
                </SelectItem>
                <SelectItem value="beginnerToAdvanced">
                  {text("beginner_to_advanced")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Learning Path Image */}
      <div className="space-y-4 mt-8">
        <FormLabel className="text-base font-semibold">
          {text("learning_path_image") || "Learning Path Image"}
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
                alt={
                  text("learning_path_image_preview") ||
                  "Learning path image preview"
                }
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
                {text("learning_path_image_upload_instruction") ||
                  "Upload an image for your learning path. Click the image area or use the button below."}
              </p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {text("guidelines") || "Guidelines"}
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>
                    {text("learning_path_image_guideline_size") ||
                      "Maximum file size: 5MB"}
                  </li>
                  <li>
                    {text("learning_path_image_guideline_format") ||
                      "Accepted formats: JPG, PNG, GIF"}
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <FileInput
                accept="image/png,image/jpeg,image/jpg,image/gif"
                multiple={false}
                onFilesSelected={onImageFilesSelected}
                disabled={loading}
                buttonText={text("upload_file") || "Upload File"}
                description={text("no_file_selected") || "No file selected"}
                className="max-w-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
