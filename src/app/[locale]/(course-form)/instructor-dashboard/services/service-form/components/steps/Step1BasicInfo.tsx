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
import { X } from "lucide-react";
import { ServiceFormData } from "../../hooks/useServiceForm";
import { cn, getDynamicString } from "@/lib/utils";
import { ICourse } from "@/types";
import ImageUploadField from "@/components/form/ImageUploadField";

interface Step1BasicInfoProps {
  form: UseFormReturn<ServiceFormData>;
  courses: ICourse[];
  selectedCourse: ICourse | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<ICourse | null>>;
  imagePreview: string | null;
  onImageFilesSelected: (files: File[]) => void;
  commonFormStyles: string;
  loading?: boolean;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  form,
  courses,
  selectedCourse,
  setSelectedCourse,
  imagePreview,
  onImageFilesSelected,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("serviceForm");
  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("title_en")} / {text("title_ar")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("add_service_description") ||
            "Enter the basic information for your service"}
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

      {/* Course Selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium">
            {text("course")}
          </FormLabel>
          <Select
            value={selectedCourse?._id || selectedCourse?.id || ""}
            onValueChange={(value) => {
              const course = courses?.find((course) => course._id === value);
              if (course) {
                setSelectedCourse(course);
              }
            }}
            disabled={loading}
          >
            <SelectTrigger className={commonFormStyles}>
              <SelectValue placeholder={text("select_course")} />
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

        {/* Display selected course */}
        {selectedCourse && (
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">
              {text("selected_course")}
            </FormLabel>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
              <span className="text-sm">
                {getDynamicString(selectedCourse.title)}
              </span>
              <button
                onClick={() => setSelectedCourse(null)}
                type="button"
                disabled={loading}
                className="text-destructive hover:text-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Service Image */}
      <div className="space-y-4 mt-8">
        <FormLabel className="text-base font-semibold">
          {text("service_image") || "Service Image"}
        </FormLabel>
        <ImageUploadField
          previewUrl={imagePreview}
          loading={loading}
          placeholderText={
            text("service_image_preview") || "Service image preview"
          }
          infoDescription={
            text("service_image_upload_instruction") ||
            "Upload an image for your service. Click the image area or use the button below."
          }
          guidelinesTitle={text("guidelines") || "Guidelines"}
          guidelines={[
            text("service_image_guideline_size") || "Maximum file size: 5MB",
            text("service_image_guideline_format") ||
              "Accepted formats: JPG, PNG, GIF",
          ]}
          fileInputButtonText={text("upload_file") || "Upload File"}
          fileInputDescription={text("no_file_selected") || "No file selected"}
          onFilesSelected={onImageFilesSelected}
        />
      </div>
    </div>
  );
};

export default Step1BasicInfo;
