import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, GripVertical, X } from "lucide-react";
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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

  const moveNextCourse = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= nextCourses.length) return;

    const updatedCourses = [...nextCourses];
    const [movedCourse] = updatedCourses.splice(fromIndex, 1);
    updatedCourses.splice(toIndex, 0, movedCourse);
    syncNextCourses(updatedCourses);
  };

  const handleDragStart = (event: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveNextCourse(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
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

        <div className="space-y-2">
          <FormLabel className="text-sm font-medium">
            {text("next_courses")}
          </FormLabel>

          {nextCourses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-md">
              <p className="text-sm">{text("select_next_courses")}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {nextCourses.map((course, index) => (
                <div
                  key={course._id}
                  draggable={!loading}
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, index)}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={cn(
                    "flex items-center gap-2 p-3 border rounded-md bg-muted/50 transition-colors",
                    draggedIndex === index && "opacity-50",
                    !loading && "hover:bg-muted"
                  )}
                >
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className="w-6 shrink-0 text-sm font-semibold text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {getDynamicString(course.title)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveNextCourse(index, index - 1)}
                    disabled={loading || index === 0}
                    className="p-1 h-8 w-8"
                    title={text("move_up")}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveNextCourse(index, index + 1)}
                    disabled={loading || index === nextCourses.length - 1}
                    className="p-1 h-8 w-8"
                    title={text("move_down")}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      syncNextCourses(
                        nextCourses.filter((item) => item._id !== course._id)
                      )
                    }
                    disabled={loading}
                    className="p-1 h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    title={text("remove_highlight")}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step7WhatIsNext;
