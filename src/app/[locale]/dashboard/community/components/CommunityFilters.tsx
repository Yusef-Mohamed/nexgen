"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterTabs } from "@/components/filters/FilterTabs";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { useFilterPackages } from "@/hooks/useFilterPackages";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getDynamicString } from "@/lib/utils";

const sharedToValues = [
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
  const { setSearchParams, searchParams } = useCustomSearchParams();

  // Local state for filters
  const [selectedSharedTo, setSelectedSharedTo] = useState(
    searchParams.get("sharedTo") || "students",
  );
  const [selectedPackage, setSelectedPackage] = useState(
    searchParams.get("package") || "",
  );
  const { packages } = useFilterPackages({
    enable: true,
  });
  const sharedToTabOptions = sharedToValues.map((item) => ({
    value: item.value,
    label: text(item.label),
  }));

  useEffect(() => {
    const isRelatedToStudents =
      selectedSharedTo === "students" ||
      (selectedSharedTo === "services" && selectedPackage === "");
    if (isRelatedToStudents)
      setSearchParams({
        sharedTo: "students",
        course: "",
        service: "",
      });
    else
      setSearchParams({
        sharedTo: selectedSharedTo,
        service: selectedPackage || "",
      });
  }, [selectedSharedTo, selectedPackage, setSearchParams]);
  return (
    <div className="flex flex-wrap items-center gap-4 p-3 rounded-md cardShadow bg-background">
      <FilterTabs
        options={sharedToTabOptions}
        activeValue={selectedSharedTo}
        onChange={(value) => {
          setSelectedSharedTo(value);
          setSelectedPackage(""); // Reset package when sharedTo changes
        }}
      />
      {selectedSharedTo === "services" && (
        <div>
          <Label htmlFor={"service"} className="text-sm sr-only ">
            {inputs("service")}
          </Label>
          <Select
            name="service"
            value={selectedPackage}
            onValueChange={(value) => setSelectedPackage(value)}
          >
            <SelectTrigger className="gap-4 bg-muted w-fit rounded text-muted-foreground border-none text-xs h-10!">
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
        </div>
      )}
    </div>
  );
};

export default CommunityFilters;
