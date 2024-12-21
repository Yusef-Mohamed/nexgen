"use client";

import { useAuth } from "@/components/auth-provider";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { useMyCoursesStore } from "@/stores/MyCoursesStore";
import { usePackagesStore } from "@/stores/MyPackages";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";

const sharedToValues = [
  {
    label: "relatedToCourse",
    value: "courses",
  },
  {
    label: "relatedToService",
    value: "services",
  },
  {
    label: "relatedToStudents",
    value: "students",
  },
];

const CommunityFilters = () => {
  const text = useTranslations("community");
  const inputs = useTranslations("Forms");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSearchParams, searchParams } = useCustomSearchParams();

  // Local state for filters
  const [selectedSharedTo, setSelectedSharedTo] = useState(
    searchParams.get("sharedTo") || "students"
  );
  const [selectedCourse, setSelectedCourse] = useState(
    searchParams.get("course") || ""
  );
  const [selectedPackage, setSelectedPackage] = useState(
    searchParams.get("package") || ""
  );
  const { token, user } = useAuth();
  const { courses, getCourses } = useMyCoursesStore();
  const { packages, getPackages } = usePackagesStore();
  useEffect(() => {
    if (token && user) {
      getPackages(token);
      getCourses(token, user._id);
    }
  }, [token, user, getPackages, getCourses]);
  return (
    <div className="flex items-center justify-between px-6 py-3 rounded-md bg-background">
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="flex items-center justify-center w-8 h-8 rounded-md bg-muted"
      >
        <FaFilter />
      </Button>
      <span>{text("customizePosts")}</span>
      <AlertDialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("customizePosts")}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={"sharedTo"} className="text-base">
                {inputs("RelatedTo")}
              </Label>
              <Select
                name="sharedTo"
                value={selectedSharedTo}
                onValueChange={(value) => {
                  setSelectedSharedTo(value);
                  setSelectedCourse(""); // Reset course when sharedTo changes
                  setSelectedPackage(""); // Reset package when sharedTo changes
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={inputs("SelectRelatedTo")} />
                </SelectTrigger>
                <SelectContent>
                  {sharedToValues.map((value) => (
                    <SelectItem value={value.value} key={value.value}>
                      {text(value.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedSharedTo === "courses" && (
              <div className="space-y-2">
                <Label htmlFor={"course"} className="text-base">
                  {inputs("course")}
                </Label>
                <Select
                  name="course"
                  value={selectedCourse}
                  onValueChange={(value) => setSelectedCourse(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={inputs("SelectCourse")} />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem value={course._id} key={course._id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedSharedTo === "services" && (
              <div className="space-y-2">
                <Label htmlFor={"service"} className="text-base">
                  {inputs("service")}
                </Label>
                <Select
                  name="service"
                  value={selectedPackage}
                  onValueChange={(value) => setSelectedPackage(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={inputs("selectService")} />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pack) => (
                      <SelectItem
                        value={pack.package._id}
                        key={pack.package._id}
                      >
                        {pack.package.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <AlertDialogFooter className="gap-4">
            <Button
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="min-w-[120px]"
              variant={"outline"}
            >
              {text("close")}
            </Button>
            <Button
              onClick={() => {
                setSearchParams({
                  sharedTo: selectedSharedTo,
                  course: selectedCourse || "",
                  service: selectedPackage || "",
                });
                setIsModalOpen(false);
              }}
              className="min-w-[120px]"
            >
              {text("applyFilters")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommunityFilters;
