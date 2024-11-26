"use client";
import { ILive } from "@/types";
import UserAvatar from "../UserAvatar";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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
    <div className="w-full border-y py-4 px-6">
      <div className="flex items-center justify-between ">
        <div className="flex gap-4">
          {live.instructor ? (
            <UserAvatar user={live.instructor} />
          ) : (
            <UserAvatar />
          )}
          <div>
            <h4 className="text-sm">
              {live.instructor ? live.instructor.name : "No Instructor"}
            </h4>
            <p className="text-xs">
              {new Date(live.date).toLocaleDateString()} -{" "}
              {new Date(live.date).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
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
                className="text-xs px-2 py-1 rounded-md"
              >
                {packageItem.course.title}
              </div>
            );
          })}
        </div>
      </div>
      <div className="py-2">{live.title}</div>
      <div>
        <Button
          className="w-full"
          asChild
          variant={live.link ? "default" : "outline"}
        >
          {live.link ? (
            <a href={live.link} target="_blank">
              {text("we_are_live_now_join_us")}
            </a>
          ) : (
            <div> {text("there_is_no_live_link_yet")}</div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LiveCard;
