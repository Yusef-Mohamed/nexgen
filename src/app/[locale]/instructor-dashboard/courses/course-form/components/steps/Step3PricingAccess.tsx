import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  FormDescription,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { ICourse } from "@/types";
import { CourseFormSchema } from "../../hooks/useCourseForm";

interface Step3PricingAccessProps {
  form: UseFormReturn<CourseFormSchema>;
  courses: ICourse[];
  accessibleCourses: ICourse[];
  setAccessibleCourses: React.Dispatch<React.SetStateAction<ICourse[]>>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step3PricingAccess: React.FC<Step3PricingAccessProps> = ({
  form,
  courses,
  accessibleCourses,
  setAccessibleCourses,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("courses");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("step3_title")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 px-2">
          {text("step3_description")}
        </p>
      </div>

      {/* Pricing */}
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

      {/* Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text("rating")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
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
                  className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
                >
                  <span className="text-sm">{course.title}</span>
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
    </div>
  );
};

export default Step3PricingAccess;
