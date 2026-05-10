import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
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
import { cn, getDynamicString } from "@/lib/utils";
import { ICourse } from "@/types";
import { CourseFormSchema } from "../../hooks/useCourseForm";

interface Step7WhatIsNextProps {
  form: UseFormReturn<CourseFormSchema>;
  courses: ICourse[];
  nextCourses: ICourse[];
  setNextCourses: React.Dispatch<React.SetStateAction<ICourse[]>>;
  currentCourseId?: string | null;
  commonFormStyles: string;
  loading?: boolean;
}

const Step7WhatIsNext: React.FC<Step7WhatIsNextProps> = ({
  form,
  courses,
  nextCourses,
  setNextCourses,
  currentCourseId,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("courses");
  const selectableCourses = courses.filter(
    (course) => course._id !== currentCourseId
  );

  const syncNextCourses = (updatedCourses: ICourse[]) => {
    setNextCourses(updatedCourses);
    form.setValue(
      "nextCourses",
      updatedCourses.map((course) => course._id),
      { shouldDirty: true }
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("what_is_next")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("what_is_next_description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="whatIsNextTitle.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("what_is_next_title")} ({text("english")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder={text("enter_what_is_next_title_english")}
                  rows={3}
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
          name="whatIsNextTitle.ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("what_is_next_title")} ({text("arabic")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder={text("enter_what_is_next_title_arabic")}
                  rows={3}
                  className={cn(commonFormStyles, "!rounded-e-none")}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="whatIsNextDescription.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("what_is_next_description_label")} ({text("english")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder={text("enter_what_is_next_description_english")}
                  rows={6}
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
          name="whatIsNextDescription.ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {text("what_is_next_description_label")} ({text("arabic")})
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder={text("enter_what_is_next_description_arabic")}
                  rows={6}
                  className={cn(commonFormStyles, "!rounded-e-none")}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel>{text("next_courses")}</FormLabel>
          <Select
            value=""
            onValueChange={(value) => {
              const selectedCourse = selectableCourses.find(
                (course) => course._id === value
              );
              if (
                selectedCourse &&
                !nextCourses.find((course) => course._id === value)
              ) {
                syncNextCourses([...nextCourses, selectedCourse]);
              }
            }}
            disabled={loading}
          >
            <SelectTrigger className={commonFormStyles}>
              <SelectValue placeholder={text("select_next_courses")} />
            </SelectTrigger>
            <SelectContent>
              {selectableCourses.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {getDynamicString(course.title)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {nextCourses.length > 0 && (
          <div className="flex flex-wrap items-center gap-4">
            {nextCourses.map((course) => (
              <div
                key={course._id}
                className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
              >
                <span className="text-sm">{getDynamicString(course.title)}</span>
                <button
                  onClick={() =>
                    syncNextCourses(
                      nextCourses.filter((item) => item._id !== course._id)
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
    </div>
  );
};

export default Step7WhatIsNext;
