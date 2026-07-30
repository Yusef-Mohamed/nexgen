import React from "react";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useLocale } from "next-intl";
import { FaChevronDown } from "react-icons/fa";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
  buttonClassName?: string;
}
const formatDate = (date: Date) => {
  return format(date, "yyyy MM dd").split(" ").join("-");
};

export function DatePickerWithRange({
  date,
  setDate,
  className,
  buttonClassName,
}: DatePickerWithRangeProps) {
  const locale = useLocale();
  return (
    <div dir="ltr" className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "md:text-sm justify-start text-left gap-4 font-normal",
              !date && "text-muted-foreground",
              buttonClassName,
            )}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            {date?.from ? (
              date.to ? (
                <>
                  <span>{formatDate(date.from)}</span>{" "}
                  {locale === "ar" ? <FaArrowLeftLong /> : <FaArrowRightLong />}{" "}
                  <span>{formatDate(date.to)}</span>
                </>
              ) : (
                <span>{formatDate(date.from)}</span>
              )
            ) : (
              <>
                <span>
                  {locale === "ar" ? "قم باختيار المدة" : "Select the range"}
                </span>
                <FaChevronDown />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          dir="ltr"
          className="w-auto p-0"
          align="start"
          side="bottom"
        >
          <div className="p-2 border rounded-md bg-popover">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
