"use client";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Plus } from "lucide-react";
import { useLearningPathForm } from "../hooks/useLearningPathForm";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import ReorderableHighlightsList from "@/app/[locale]/(course-form)/instructor-dashboard/courses/course-form/components/ReorderableHighlightsList";

const commonFormStyles =
  "!px-4 !py-3 !h-auto !rounded-md min-h-12 items-center";

const AddLearningPathClient = () => {
  const {
    loading,
    form,
    onSubmit,
    text,
    isEditMode,
    courses,
    selectedCourses,
    setSelectedCourses,
  } = useLearningPathForm();

  return (
    <div className="container max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        <Link
          href={`/instructor-dashboard/courses?type=learning-path`}
          className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 rotateInRTL" />
          <span className="xs:hidden">{text("back")}</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
          {isEditMode
            ? text("edit_learning_path")
            : text("add_new_learning_path")}
        </h1>
      </div>

      <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Highlights Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="highlights.en"
                render={({ field, fieldState }) => {
                  const fieldErrors: string[] = [];

                  // Create individual error messages for each highlight
                  if (fieldState.error?.message) {
                    field.value.forEach((highlight, index) => {
                      if (!highlight || highlight.trim().length === 0) {
                        fieldErrors[index] = text("highlight_cannot_be_empty");
                      }
                    });
                  }

                  return (
                    <FormItem>
                      <ReorderableHighlightsList
                        value={field.value}
                        onChange={field.onChange}
                        label={`${text("highlights")} (${text("english")})`}
                        placeholder={text("enter_highlights_english")}
                        error={fieldState.error?.message}
                        fieldErrors={fieldErrors}
                        commonFormStyles={commonFormStyles}
                        disabled={loading}
                      />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="highlights.ar"
                render={({ field, fieldState }) => {
                  const fieldErrors: string[] = [];

                  // Create individual error messages for each highlight
                  if (fieldState.error?.message) {
                    field.value.forEach((highlight, index) => {
                      if (!highlight || highlight.trim().length === 0) {
                        fieldErrors[index] = text("highlight_cannot_be_empty");
                      }
                    });
                  }

                  return (
                    <FormItem>
                      <ReorderableHighlightsList
                        value={field.value}
                        onChange={field.onChange}
                        label={`${text("highlights")} (${text("arabic")})`}
                        placeholder={text("enter_highlights_arabic")}
                        error={fieldState.error?.message}
                        fieldErrors={fieldErrors}
                        commonFormStyles={commonFormStyles}
                        disabled={loading}
                      />
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* Pricing Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

            {/* Courses Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {text("courses")}
                </label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    const selectedCourse = courses?.find(
                      (course) => course._id === value
                    );
                    if (
                      selectedCourse &&
                      !selectedCourses.find((c) => c._id === value)
                    ) {
                      setSelectedCourses((prev) => [...prev, selectedCourse]);
                    }
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className={commonFormStyles}>
                    <SelectValue placeholder={text("select_courses")} />
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

              {/* Display selected courses */}
              {selectedCourses.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {text("selected_courses")}
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    {selectedCourses.map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
                      >
                        <span className="text-sm">{course.title}</span>
                        <button
                          onClick={() =>
                            setSelectedCourses((prev) =>
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
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading
                  ? text("saving")
                  : isEditMode
                  ? text("update")
                  : text("create")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddLearningPathClient;
