"use client";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Plus } from "lucide-react";
import { useServiceForm } from "../hooks/useServiceForm";
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

const AddServiceClient = () => {
  const {
    loading,
    form,
    onSubmit,
    text,
    isEditMode,
    courses,
    selectedCourse,
    setSelectedCourse,
  } = useServiceForm();

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
          {isEditMode ? text("edit_service") : text("add_new_service")}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg border p-4 sm:p-6 lg:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="title.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {text("title_en")}
                    </FormLabel>
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
                    <FormLabel className="text-sm font-medium">
                      {text("title_ar")}
                    </FormLabel>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="description.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {text("description_en")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={text("enter_description_en")}
                        className={cn(
                          commonFormStyles,
                          "min-h-[100px] resize-none"
                        )}
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
                    <FormLabel className="text-sm font-medium">
                      {text("description_ar")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={text("enter_description_ar")}
                        className={cn(
                          commonFormStyles,
                          "min-h-[100px] resize-none"
                        )}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Highlights Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="highlights.en"
                render={({ field, fieldState }) => {
                  const fieldErrors: string[] = [];

                  // Create individual error messages for each highlight
                  if (fieldState.error?.message) {
                    field.value.forEach((highlight, index) => {
                      if (!highlight || highlight.trim().length === 0) {
                        fieldErrors[index] = text("empty_highlight_error");
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
                        fieldErrors[index] = text("empty_highlight_error");
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

            {/* Price Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {text("price")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
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
                    <FormLabel className="text-sm font-medium">
                      {text("price_after_discount")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
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

            <FormField
              control={form.control}
              name="subscriptionDurationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {text("subscription_duration_days")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder={text("enter_subscription_duration_days")}
                      className={commonFormStyles}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {text("course")}
                </label>
                <Select
                  value={selectedCourse?._id || selectedCourse?.id || ""}
                  onValueChange={(value) => {
                    const course = courses?.find(
                      (course) => course._id === value
                    );
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
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Display selected course */}
              {selectedCourse && (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {text("selected_course")}
                  </label>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <span className="text-sm">{selectedCourse.title}</span>
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

export default AddServiceClient;
