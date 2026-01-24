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
import { ILive } from "@/types";

interface LivesCalendarProps {
  lives: ILive[];
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
}

const LivesCalendar = ({
  lives,
  selectedDate: propSelectedDate,
  onDateSelect,
}: LivesCalendarProps) => {
  const { setSearchParams, getSearchParam } = useCustomSearchParams();
  const locale = useLocale();
  const isArabic = locale === "ar";

  const searchParamDate = getSearchParam("date") || "";
  const selectedDate =
    propSelectedDate !== undefined ? propSelectedDate : searchParamDate;

  const handleDateSelect = (date: string) => {
    if (onDateSelect) {
      if (selectedDate === date) {
        onDateSelect("");
      } else {
        onDateSelect(date);
      }
    } else {
      if (selectedDate === date) {
        setSearchParams({ date: "" });
      } else {
        setSearchParams({ date: date });
      }
    }
  };

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

  const getLivesForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return lives.filter(
      (live) => format(new Date(live.date), "yyyy-MM-dd") === dateKey
    );
  };

  const localizedWeekdays = useMemo(() => {
    const days = [];
    const sunday = new Date(2024, 0, 7); // Jan 7, 2024 is a Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      days.push(
        format(date, isArabic ? "EEEE" : "EEE", {
          locale: isArabic ? arSA : enUS,
        })
      );
    }
    return days;
  }, [isArabic]);

  return (
    <div dir="ltr" className="w-full cardShadow rounded-xl h-fit">
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
              "text-primary font-semibold":
                format(selectedMonth, "yyyy-MM") ===
                format(currentDate, "yyyy-MM"),
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
          {localizedWeekdays.map((day) => {
            return (
              <div key={day} className="font-bold text-center rtl:text-xs">
                {day}
              </div>
            );
          })}
          {Array.from({ length: startingDayIndex }).map((_, index) => {
            return <div key={`empty-${index}`} />;
          })}
          {daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayLives = getLivesForDate(day);
            return (
              <div key={index}>
                <button
                  onClick={() => handleDateSelect(dateKey)}
                  className={clsx(
                    "rounded-md flex-col transition-all px-1 py-1 w-full flex justify-center items-center text-center border-2",
                    {
                      "border-primary": isToday(day),
                      "border-[#FFD700]": selectedDate === dateKey,
                      "border-transparent":
                        !isToday(day) && selectedDate !== dateKey,
                      "bg-secondary text-white": dayLives.length > 0,
                    }
                  )}
                >
                  {format(day, "d")}{" "}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LivesCalendar;
