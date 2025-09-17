"use client";
import { axiosInstance } from "@/app/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { IPackage } from "@/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const LiveFilters = () => {
  const inputs = useTranslations("Forms");
  const [packages, setPackages] = useState<IPackage[]>([]);
  const { getSearchParam, setSearchParams } = useCustomSearchParams();
  useEffect(() => {
    axiosInstance
      .get("/packages")
      .then((res) => {
        setPackages(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="w-full px-6 py-4 mb-4 bg-clear-ground rounded-xl h-fit">
      <Label htmlFor={"course"} className="block mb-2">
        {inputs("course")} :
      </Label>
      <Select
        value={getSearchParam("course") || ""}
        onValueChange={(value) => {
          setSearchParams({ course: value });
        }}
      >
        <SelectTrigger className="w-full border-2 border-transparent border-s-primary">
          <SelectValue placeholder={inputs("select_course")} />
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

export default LiveFilters;
