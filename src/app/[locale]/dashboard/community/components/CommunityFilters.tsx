"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { useFilterCourses } from "@/hooks/useFilterCourses";
import { useFilterPackages } from "@/hooks/useFilterPackages";
import { cn, getDynamicString } from "@/lib/utils";
import {
  BookOpenCheck,
  Check,
  CheckCircle2,
  PackageCheck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const sharedToValues = [
  {
    icon: PackageCheck,
    label: "relatedToService",
    value: "services",
  },
  {
    icon: BookOpenCheck,
    label: "relatedToCourse",
    value: "courses",
  },
  {
    icon: Users,
    label: "relatedToStudents",
    value: "students",
  },
] as const;

type CommunitySharedTo = (typeof sharedToValues)[number]["value"];

const resolveSharedTo = (value: string | null): CommunitySharedTo => {
  if (value === "courses" || value === "services" || value === "students") {
    return value;
  }

  return "students";
};

const CommunityFilters = ({
  inDialog = false,
  onCancel,
  onSave,
}: {
  inDialog?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
}) => {
  const text = useTranslations("community");
  const inputs = useTranslations("Forms");
  const { setSearchParams, searchParams } = useCustomSearchParams();
  const [selectedSharedTo, setSelectedSharedTo] = useState<CommunitySharedTo>(
    resolveSharedTo(searchParams.get("sharedTo")),
  );
  const [selectedCourse, setSelectedCourse] = useState(
    searchParams.get("course") || "",
  );
  const [selectedPackage, setSelectedPackage] = useState(
    searchParams.get("service") || "",
  );
  const { courses, isLoadingCourses } = useFilterCourses({
    enable: true,
  });
  const { packages } = useFilterPackages({
    enable: true,
  });

  const handleSharedToChange = (value: CommunitySharedTo) => {
    setSelectedSharedTo(value);
    if (value !== "courses") setSelectedCourse("");
    if (value !== "services") setSelectedPackage("");
  };

  const isSelectVisible =
    selectedSharedTo === "courses" || selectedSharedTo === "services";
  const isSaveDisabled =
    (selectedSharedTo === "courses" && !selectedCourse) ||
    (selectedSharedTo === "services" && !selectedPackage);
  const requirementText =
    selectedSharedTo === "courses"
      ? inputs("SelectCourse")
      : selectedSharedTo === "services"
        ? inputs("selectService")
        : null;

  const handleCancel = () => {
    setSelectedSharedTo(resolveSharedTo(searchParams.get("sharedTo")));
    setSelectedCourse(searchParams.get("course") || "");
    setSelectedPackage(searchParams.get("service") || "");
    onCancel?.();
  };

  const handleSave = () => {
    if (isSaveDisabled) return;

    if (selectedSharedTo === "students") {
      setSearchParams({
        course: "",
        service: "",
        sharedTo: "students",
      });
    } else if (selectedSharedTo === "courses") {
      setSearchParams({
        course: selectedCourse,
        service: "",
        sharedTo: "courses",
      });
    } else {
      setSearchParams({
        course: "",
        service: selectedPackage,
        sharedTo: "services",
      });
    }

    onSave?.();
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/10 bg-clear-ground",
        inDialog ? "p-3 sm:p-4" : "p-3",
      )}
    >
      <div className="space-y-2">
        {sharedToValues.map((option) => {
          const Icon = option.icon;
          const isActive = selectedSharedTo === option.value;

          return (
            <button
              className={cn(
                "group relative flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-background-2 p-3 text-start transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-primary/10 text-text-2",
              )}
              key={option.value}
              onClick={() => handleSharedToChange(option.value)}
              type="button"
            >
              <span
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                  isActive
                    ? "border-primary/20 bg-primary text-primary-foreground"
                    : "border-primary/10 bg-clear-ground text-text-3 group-hover:text-primary",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-black leading-5 text-text-1">
                <span className="block truncate">{text(option.label)}</span>
              </span>
              <span
                className={cn(
                  "inline-flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/10 bg-clear-ground text-transparent",
                )}
              >
                <Check className="size-3.5" />
              </span>
              {isActive && (
                <span className="absolute inset-y-3 start-0 w-1 rounded-e-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {isSelectVisible && (
        <div className="mt-3 space-y-3 rounded-xl border border-primary/10 bg-background-2 p-3">
          <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wide text-text-3">
            <CheckCircle2 className="size-4 text-primary" />
            <span>{requirementText}</span>
          </div>
          {selectedSharedTo === "courses" ? (
            <Select
              name="course"
              value={selectedCourse}
              onValueChange={setSelectedCourse}
            >
              <SelectTrigger className="h-12 w-full rounded-xl border-primary/10 bg-clear-ground px-4 text-sm font-semibold text-text-2 shadow-none">
                <SelectValue
                  placeholder={
                    isLoadingCourses ? text("loading") : inputs("SelectCourse")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem value={course._id} key={course._id}>
                    {getDynamicString(course.title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              name="service"
              value={selectedPackage}
              onValueChange={setSelectedPackage}
            >
              <SelectTrigger className="h-12 w-full rounded-xl border-primary/10 bg-clear-ground px-4 text-sm font-semibold text-text-2 shadow-none">
                <SelectValue placeholder={inputs("selectService")} />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pack) => (
                  <SelectItem value={pack._id} key={pack._id}>
                    {getDynamicString(pack.title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-col-reverse gap-2 border-t border-primary/10 pt-3 sm:flex-row sm:justify-end">
        <button
          className="inline-flex h-11 items-center justify-center rounded-xl border border-primary/10 bg-clear-ground px-5 text-sm font-bold text-text-2 transition-colors hover:border-primary/30 hover:text-primary"
          onClick={handleCancel}
          type="button"
        >
          {inputs("cancel")}
        </button>
        <button
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-xl border border-primary px-5 text-sm font-bold transition-colors",
            isSaveDisabled
              ? "cursor-not-allowed bg-primary/40 text-primary-foreground/70"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          disabled={isSaveDisabled}
          onClick={handleSave}
          type="button"
        >
          {inputs("save")}
        </button>
      </div>
    </div>
  );
};

export const CommunityFilterPills = () => {
  const text = useTranslations("community");
  const inputs = useTranslations("Forms");
  const { searchParams } = useCustomSearchParams();
  const { courses } = useFilterCourses({
    enable: true,
  });
  const { packages } = useFilterPackages({
    enable: true,
  });

  const sharedTo = searchParams.get("sharedTo") || "students";
  const courseId = searchParams.get("course") || "";
  const serviceId = searchParams.get("service") || "";
  const course = courses.find((item) => item._id === courseId);
  const service = packages.find((pack) => pack._id === serviceId);

  const pill =
    sharedTo === "courses"
      ? {
          label: text("relatedToCourse"),
          value: course
            ? getDynamicString(course.title)
            : inputs("SelectCourse"),
        }
      : sharedTo === "services"
        ? {
            label: text("relatedToService"),
            value: service
              ? getDynamicString(service.title)
              : inputs("selectService"),
          }
        : {
            label: text("relatedToStudents"),
            value: null,
          };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border border-primary/10 bg-clear-ground px-3 text-xs font-bold text-text-2">
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="shrink-0 text-text-1">{pill.label}</span>
        {pill.value && (
          <>
            <span className="h-3 w-px bg-primary/20" />
            <span className="truncate text-text-3">{pill.value}</span>
          </>
        )}
      </span>
    </div>
  );
};

export default CommunityFilters;
