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
import FileInput from "@/components/ui/file-input";
import { cn } from "@/lib/utils";
import { CourseFormSchema } from "../../hooks/useCourseForm";

interface Step1BasicInfoProps {
  form: UseFormReturn<CourseFormSchema>;
  categories: Array<{ _id: string; title: string }>;
  imagePreview: string | null;
  onImageFilesSelected: (files: File[]) => void;
  commonFormStyles: string;
  loading?: boolean;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  form,
  categories,
  imagePreview,
  onImageFilesSelected,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("courses");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("step1_title")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 px-2">
          {text("step1_description")}
        </p>
      </div>

      {/* Course Image */}
      <div className="space-y-2">
        {imagePreview && (
          <div className="mb-2 w-fit mx-auto">
            <img
              src={imagePreview}
              alt={text("course_image_preview")}
              className="w-32 h-32 object-cover rounded-md border border-border"
            />
          </div>
        )}
        <FormLabel>{text("course_image")}</FormLabel>
        <FileInput
          accept="image/png,image/jpeg"
          multiple={false}
          onFilesSelected={onImageFilesSelected}
          disabled={loading}
        />
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
                      {category.title}
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
    </div>
  );
};

export default Step1BasicInfo;
