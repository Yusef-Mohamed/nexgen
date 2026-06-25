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
import { getDynamicString } from "@/lib/utils";

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
    <div className="h-fit w-full rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
      <Label
        htmlFor={"course"}
        className="mb-2 block text-sm font-bold text-text-2"
      >
        {inputs("course")} :
      </Label>
      <Select
        value={getSearchParam("course") || ""}
        onValueChange={(value) => {
          setSearchParams({ course: value });
        }}
      >
        <SelectTrigger className="h-11 w-full rounded-xl border-primary/10 bg-background-2 shadow-none">
          <SelectValue placeholder={inputs("select_course")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{inputs("all_courses")}</SelectItem>
          {packages.map((packageItem) => {
            if (!packageItem.course) return null;
            return (
              <SelectItem value={packageItem._id} key={packageItem._id}>
                {getDynamicString(packageItem.course?.title || "")}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LiveFilters;
