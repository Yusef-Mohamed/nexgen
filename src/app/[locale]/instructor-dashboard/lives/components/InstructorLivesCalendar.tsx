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
import { ILive } from "@/types";

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

interface InstructorLivesCalendarProps {
  lives: ILive[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const InstructorLivesCalendar = ({
  lives,
  selectedDate,
  onDateSelect,
}: InstructorLivesCalendarProps) => {
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

  const getLivesForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return lives.filter(
      (live) => format(new Date(live.date), "yyyy-MM-dd") === dateKey
    );
  };

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
            const dayLives = getLivesForDate(day);
            return (
              <div key={index}>
                <button
                  onClick={() => {
                    if (selectedDate === dateKey) {
                      onDateSelect("");
                    } else {
                      onDateSelect(dateKey);
                    }
                  }}
                  className={clsx(
                    "rounded-md flex-col transition-all px-1 py-1 w-full flex justify-center items-center text-center border-2",
                    {
                      "border-primary": isToday(day),
                      "border-[#FFD700]": selectedDate === dateKey,
                      "border-transparent":
                        !isToday(day) && selectedDate !== dateKey,
                    }
                  )}
                >
                  {format(day, "d")}{" "}
                  {dayLives.length > 0 && (
                    <div className="bottom-0 flex justify-center gap-1 transform -translate-x-1/2 left-1/2">
                      {dayLives.map((live, liveIndex) =>
                        live.package.map((pkg, pkgIndex) => {
                          const courseColor =
                            pkg.course.colors.bgColor || "#000000";
                          const courseDarkColor =
                            pkg.course.colors.bgDarkMode || "#000000";
                          return (
                            <div
                              key={`${liveIndex}-${pkgIndex}`}
                              className="flex gap-1"
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full dark:hidden"
                                style={{ backgroundColor: courseColor }}
                              />
                              <div
                                className="w-1.5 h-1.5 rounded-full dark:block hidden"
                                style={{ backgroundColor: courseDarkColor }}
                              />
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InstructorLivesCalendar;
