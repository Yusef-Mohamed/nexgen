import { useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { addMonths, endOfMonth, startOfMonth, format } from "date-fns";
import { useTranslations } from "next-intl";
import { IUser } from "@/types";

export interface Month {
  start: Date;
  end: Date;
  label: string;
}

export interface MonthLabel {
  value: string;
  label: string;
}

const MonthSelector = ({
  selectedUserObject,
  selectedMonth,
  setSelectedMonth,
}: {
  selectedUserObject: IUser | null;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
}) => {
  const text = useTranslations("analytics");

  const months = useMemo<Month[]>(() => {
    const currentDate = new Date();
    const registrationDate = new Date(
      selectedUserObject?.createdAt || "2024-01-01"
    );
    const monthsList: Month[] = [];
    let monthStartDate = startOfMonth(registrationDate);

    while (monthStartDate <= currentDate) {
      const monthEndDate = endOfMonth(monthStartDate);
      monthsList.push({
        start: monthStartDate,
        end: monthEndDate,
        label: `${format(monthStartDate, "MM/yyyy")}`,
      });
      monthStartDate = addMonths(monthStartDate, 1);
    }

    return monthsList.reverse();
  }, [selectedUserObject]);

  const monthLabels = useMemo<MonthLabel[]>(() => {
    return months.map((month) => ({
      value: month.label,
      label: month.label,
    }));
  }, [months]);

  useEffect(() => {
    if (monthLabels.length && !selectedMonth) {
      setSelectedMonth(monthLabels[0].value);
    }
  }, [monthLabels]);

  return (
    <Select
      value={selectedMonth}
      onValueChange={(value) => setSelectedMonth(value)}
    >
      <SelectTrigger className="w-[60px] lg:text-xs md:text-xs sm:text-xs text-xs lg:px-2 md:px-2 sm:px-2 px-2 rounded-sm lg:h-10 md:h-10 sm:h-10 h-10">
        <SelectValue placeholder={text("selectMonth")} />
      </SelectTrigger>
      <SelectContent>
        {monthLabels.map((label) => (
          <SelectItem value={label.value} key={label.value}>
            {label.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MonthSelector;
