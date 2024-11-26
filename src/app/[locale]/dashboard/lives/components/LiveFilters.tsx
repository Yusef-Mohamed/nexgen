"use client";
import { createClientAxiosInstance } from "@/app/lib/utils";
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
    const axiosInstance = createClientAxiosInstance();
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
    <div className="flex items-center gap-4 px-4 py-4">
      <Label htmlFor={"course"}>{inputs("course")} :</Label>
      <Select
        value={getSearchParam("course") || ""}
        onValueChange={(value) => {
          setSearchParams({ course: value });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={inputs("select_course")} />
        </SelectTrigger>
        <SelectContent>
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
