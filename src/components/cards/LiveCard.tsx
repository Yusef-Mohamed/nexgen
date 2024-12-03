"use client";
import { ILive } from "@/types";
import UserAvatar from "../UserAvatar";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";

interface LiveCardProps {
  live: ILive;
}
const LiveCard: React.FC<LiveCardProps> = ({ live }) => {
  const text = useTranslations("lives");
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setTheme(theme);
    }
  }, []);
  return (
    <div className="w-full p-4 border rounded-md">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {live.package.map((packageItem) => {
          if (!packageItem?.course) return null;
          return (
            <div
              key={packageItem._id}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? packageItem.course.colors?.bgDarkMode
                    : packageItem.course.colors?.bgColor,
                color:
                  theme === "dark"
                    ? packageItem.course.colors?.fontDarkMode
                    : packageItem.course.colors?.fontColor,
              }}
              className="px-3 py-2 text-xs rounded-md "
            >
              {packageItem.course.title}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2 ">
        <div className="flex items-center gap-4">
          {live.instructor ? (
            <UserAvatar user={live.instructor} />
          ) : (
            <UserAvatar />
          )}
          <h4 className="text-sm font-semibold">
            {live.instructor ? live.instructor.name : text("no_instructor")}
          </h4>
        </div>
      </div>
      <div className="py-2 my-3 font-semibold">{live.title}</div>
      {live.link && (
        <div>
          <Button
            className="flex items-center justify-center w-full h-10 py-0 lg:h-10 md:h-10 sm:h-10"
            asChild
          >
            <a href={live.link} target="_blank">
              {text("go_to_meeting_room")}
            </a>
          </Button>
        </div>
      )}
      {!live.link && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-text-3">
            <FaRegCalendarAlt />
            {new Date(live.date).toLocaleDateString()}{" "}
          </div>
          <div className="flex items-center gap-2 font-semibold text-text-3">
            <FaRegClock />
            {new Date(live.date).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCard;
