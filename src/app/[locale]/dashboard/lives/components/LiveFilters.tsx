"use client";
import { axiosInstance } from "@/app/lib/utils";
import {
  CommandSelect,
  CommandSelectOption,
} from "@/components/ui/command-select";
import { Label } from "@/components/ui/label";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { IPackage } from "@/types";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { getDynamicString } from "@/lib/utils";

type LiveFiltersProps = {
  fallbackPackages?: IPackage[];
};

const EMPTY_PACKAGES: IPackage[] = [];

const LiveFilters = ({
  fallbackPackages = EMPTY_PACKAGES,
}: LiveFiltersProps) => {
  const inputs = useTranslations("Forms");
  const [packages, setPackages] = useState<IPackage[]>(fallbackPackages);
  const { getSearchParam, setSearchParams } = useCustomSearchParams();
  const selectedCourse = getSearchParam("course") || "all";

  useEffect(() => {
    axiosInstance
      .get("/packages")
      .then((res) => {
        const apiPackages = Array.isArray(res.data.data) ? res.data.data : [];
        setPackages(apiPackages.length > 0 ? apiPackages : fallbackPackages);
      })
      .catch((err) => {
        console.log(err);
        setPackages(fallbackPackages);
      });
  }, [fallbackPackages]);

  const packageOptions = useMemo(() => {
    const mergedPackages = new Map<string, IPackage>();

    fallbackPackages.forEach((packageItem) => {
      mergedPackages.set(packageItem._id, packageItem);
    });

    packages.forEach((packageItem) => {
      mergedPackages.set(packageItem._id, packageItem);
    });

    return Array.from(mergedPackages.values()).filter(
      (packageItem) => packageItem.course,
    );
  }, [fallbackPackages, packages]);

  const options = useMemo<CommandSelectOption[]>(
    () => [
      {
        value: "all",
        label: inputs("all_courses"),
        searchLabel: inputs("all_courses"),
      },
      ...packageOptions.map((packageItem) => ({
        value: packageItem._id,
        label: getDynamicString(packageItem.course.title),
        searchLabel: getDynamicString(packageItem.course.title),
      })),
    ],
    [inputs, packageOptions],
  );

  return (
    <div className="h-fit w-full rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
      <Label
        htmlFor="course"
        className="mb-2 block text-sm font-bold text-text-2"
      >
        {inputs("course")} :
      </Label>
      <CommandSelect
        value={selectedCourse}
        onValueChange={(value) => {
          setSearchParams({ course: value });
        }}
        options={options}
        placeholder={inputs("select_course")}
        searchPlaceholder={inputs("select_course")}
        emptyText="No courses found"
        triggerClassName="bg-background-2 shadow-none"
      />
    </div>
  );
};

export default LiveFilters;
