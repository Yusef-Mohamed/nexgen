"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPackage } from "@/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/app/lib/utils";

interface InstructorLiveFiltersProps {
  selectedCourse: string;
  onCourseChange: (course: string) => void;
}

const InstructorLiveFilters = ({
  selectedCourse,
  onCourseChange,
}: InstructorLiveFiltersProps) => {
  const inputs = useTranslations("Forms");
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/packages");
        setPackages(response.data.data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="w-full px-6 py-4 mb-4 cardShadow rounded-xl h-fit">
      <Label htmlFor="course" className="block mb-2">
        {inputs("course")} :
      </Label>
      <Select
        value={selectedCourse}
        onValueChange={onCourseChange}
        disabled={loading}
      >
        <SelectTrigger className="w-full border-2 border-transparent border-s-primary">
          <SelectValue
            placeholder={loading ? "Loading..." : inputs("select_course")}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{inputs("all_courses")}</SelectItem>
          {packages.map((packageItem) => {
            if (!packageItem.course) return null;
            return (
              <SelectItem value={packageItem._id} key={packageItem._id}>
                {packageItem.course?.title}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default InstructorLiveFilters;
