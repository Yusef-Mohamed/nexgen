"use client";
import { ILive } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { Trash2, Edit } from "lucide-react";
import { getDynamicString } from "@/lib/utils";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

interface LiveCardProps {
  live: ILive;
  onDelete?: (liveId: string) => void;
  onEdit?: (liveId: string) => void;
}
const LiveCard: React.FC<LiveCardProps> = ({ live, onDelete, onEdit }) => {
  const text = useTranslations("instructorLives");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setTheme(theme);
    }
  }, []);

  // Use the status field from the live object
  const isActive = live.status === "active";
  const statusText = isActive ? text("active") : text("inactive");
  const statusVariant = isActive ? "default" : "destructive";
  return (
    <div className="flex flex-col justify-between w-full gap-4 p-4 border rounded-md">
      <div>
        <div className="flex flex-wrap items-center justify-start gap-2">
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
                  fontSize: "0.6rem",
                }}
                className="px-1.5 py-1  rounded font-semibold "
              >
                {getDynamicString(packageItem.course.title)}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between py-2 mt-1 mb-3">
          <div className="font-semibold">{getDynamicString(live.title)}</div>
          <Badge variant={statusVariant} className="text-xs">
            {statusText}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-text-3">
            <FaRegCalendarAlt />
            {format(new Date(live.date), "dd/MM/yyyy")}{" "}
          </div>

          <div className="flex items-center gap-2 font-semibold text-text-3">
            <FaRegClock />
            {format(new Date(live.date), "hh:mm a", {
              locale: isArabic ? arSA : enUS,
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => onEdit?.(live._id)}
          className="flex items-center gap-2 flex-1"
        >
          <Edit className="w-4 h-4" />
          {text("edit")}
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete?.(live._id)}
          className="flex items-center gap-2 flex-1"
        >
          <Trash2 className="w-4 h-4" />
          {text("delete")}
        </Button>
      </div>
    </div>
  );
};

export default LiveCard;
