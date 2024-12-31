import { useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { addWeeks, endOfWeek, startOfWeek, format } from "date-fns";
import { useTranslations } from "next-intl";
import { IUser } from "@/types";
export interface Week {
  start: Date;
  end: Date;
  label: string;
}

export interface WeekLabel {
  value: string;
  label: string;
}
const WeekSelector = ({
  selectedUserObject,
  selectedWeek,
  setSelectedWeek,
}: {
  selectedUserObject: IUser | null;
  selectedWeek: string;
  setSelectedWeek: (value: string) => void;
}) => {
  const text = useTranslations("analytics");
  const weeks = useMemo<Week[]>(() => {
    const currentDate = new Date();
    const registrationDate = new Date(
      selectedUserObject?.createdAt || "2024-01-01"
    );
    const weeksList: Week[] = [];
    let weekStartDate = startOfWeek(registrationDate);

    while (weekStartDate <= currentDate) {
      const weekEndDate = endOfWeek(weekStartDate);
      weeksList.push({
        start: weekStartDate,
        end: weekEndDate,
        label: `${format(weekStartDate, "dd/MM/yyyy")} - ${format(
          weekEndDate,
          "dd/MM/yyyy"
        )}`,
      });
      weekStartDate = addWeeks(weekStartDate, 1);
    }

    return weeksList.reverse();
  }, [selectedUserObject]);

  const weekLabels = useMemo<WeekLabel[]>(() => {
    return weeks.map((week) => ({
      value: week.label,
      label: week.label,
    }));
  }, [weeks]);

  useEffect(() => {
    if (weekLabels.length && !selectedWeek) {
      setSelectedWeek(weekLabels[0].value);
    }
  }, [weekLabels]);
  return (
    <Select
      value={selectedWeek}
      onValueChange={(value) => setSelectedWeek(value)}
    >
      <SelectTrigger className="w-[200px] lg:text-xs md:text-xs sm:text-xs text-xs lg:px-2 md:px-2 sm:px-2 px-2 rounded-sm lg:h-10 md:h-10 sm:h-10 h-10">
        <SelectValue placeholder={text("selectWeek")} />
      </SelectTrigger>
      <SelectContent>
        {weekLabels.map((label) => (
          <SelectItem value={label.value} key={label.value}>
            {label.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default WeekSelector;
