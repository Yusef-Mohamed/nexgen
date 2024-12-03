"use client";
import clsx from "clsx";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { arSA, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import useCustomSearchParams from "@/hooks/useSearchParams";
const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const LivesCalender = () => {
  // const { setSearchParams, getSearchParam } = useCustomSearchParams();
  const { getSearchParam } = useCustomSearchParams();
  const locale = useLocale();
  const isArabic = locale === "ar";
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(
    startOfMonth(currentDate)
  );
  const startingDayIndex = getDay(firstDayOfMonth);
  const [lastDayOfMonth, setLastDayOfMonth] = useState(endOfMonth(currentDate));
  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  }, [firstDayOfMonth, lastDayOfMonth]);
  return (
    <div dir="ltr" className="w-full bg-clear-ground rounded-xl h-fit">
      <div className="p-4">
        <span className="block text-xs text-center">
          {format(selectedMonth, " yyyy", {
            locale: isArabic ? arSA : enUS,
          })}
        </span>
        <div
          className="flex items-center mb-6 justify-evenly"
          style={{ direction: "ltr" }}
        >
          <button
            onClick={() => {
              const newMonth = subMonths(selectedMonth, 1);
              setSelectedMonth(newMonth);
              setFirstDayOfMonth(startOfMonth(newMonth));
              setLastDayOfMonth(endOfMonth(newMonth));
            }}
          >
            <FaChevronLeft />
          </button>
          <h2
            className={cn("text-center w-36", {
              "text-primary font-semibold": selectedMonth === currentDate,
            })}
          >
            {" "}
            <span>
              {format(selectedMonth, "MMMM", {
                locale: isArabic ? arSA : enUS,
              })}
            </span>
          </h2>
          <button
            onClick={() => {
              const newMonth = addMonths(selectedMonth, 1);

              setSelectedMonth(newMonth);
              setFirstDayOfMonth(startOfMonth(newMonth));
              setLastDayOfMonth(endOfMonth(newMonth));
            }}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((day) => {
            return (
              <div key={day} className="font-bold text-center">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </div>
            );
          })}
          {Array.from({ length: startingDayIndex }).map((_, index) => {
            return <div key={`empty-${index}`} />;
          })}
          {daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            return (
              <button
                onClick={() => {
                  // setSearchParams({ date: dateKey });
                }}
                key={index}
                className={clsx(
                  " rounded-full transition-all px-5 py-1 w-full flex justify-center items-center text-center",
                  {
                    "bg-primary text-white": isToday(day),
                    "bg-primary/70 text-white":
                      getSearchParam("date") === dateKey,
                  }
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default LivesCalender;
