import React from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLabel } from "@/components/ui/form";
import { X } from "lucide-react";
import { ICourse } from "@/types";
import { getDynamicString } from "@/lib/utils";

interface Step2ContentProps {
  courses: ICourse[];
  selectedCourses: ICourse[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<ICourse[]>>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step2Content: React.FC<Step2ContentProps> = ({
  courses,
  selectedCourses,
  setSelectedCourses,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("learningPathForm");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("learning_path_content") || "Learning Path Content"}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("select_courses_description") ||
            "Select the courses to include in this learning path"}
        </p>
      </div>

      {/* Courses Selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium">
            {text("courses")}
          </FormLabel>
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
                  {getDynamicString(course.title)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Display selected courses */}
        {selectedCourses.length > 0 && (
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">
              {text("selected_courses")}
            </FormLabel>
            <div className="flex flex-wrap items-center gap-4">
              {selectedCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
                >
                  <span className="text-sm">
                    {getDynamicString(course.title)}
                  </span>
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
    </div>
  );
};

export default Step2Content;
