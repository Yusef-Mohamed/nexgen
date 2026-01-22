import { useLocale, useTranslations } from "next-intl";
import { ICourseProgress } from "@/types";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/app/lib/utils";
import Image from "next/image";
const CourseProgress = () => {
  const token = getCookie("token");
  const [isFetching, setIsFetching] = useState(true);
  const [selectedCourseProgress, setSelectedCourseProgress] =
    useState<ICourseProgress | null>(null);
  const { selectedCourse, selectedUser, courseProgress, selectedUserObject } =
    useAnalyticsStore();
  const locale = useLocale();
  const getCourseScore = async (course: string) => {
    setIsFetching(true);
    try {
      const courseScore = await axiosInstance.get(
        `/exams/userScore/${course}/${selectedUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedCourseProgress(courseScore.data.data as ICourseProgress);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    if (selectedCourse && selectedUser) {
      getCourseScore(selectedCourse);
    }
  }, [selectedCourse, selectedUser]);
  // grades.png
  // time.png
  // progress.png
  return (
    <div>
      {courseProgress?.certificate && (
        <div className="p-2 mb-2 text-center rounded-md ">
          <p>
            {locale === "ar"
              ? "لقد اجتزت الامتحان وتستحق الشهادة🎉"
              : "congratulations you have passed the exam and deserve the certificate🎉"}
          </p>

          <a
            href={courseProgress.certificate}
            download
            className="underline text-primary"
          >
            {locale === "ar"
              ? "اضغط هنا لفتح الشهادة"
              : "click here to open the certificate"}
          </a>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CircleCell
          title="gradesAverage"
          icon={"/images/grades.png"}
          value={
            Number(selectedCourseProgress?.totalLessonsExamsPercentage) || 0
          }
          color="#1B7DF5"
          isFetching={isFetching}
        />
        <CircleCell
          icon={"/images/time.png"}
          title="timeSpent"
          color="#9747FF"
          value={Number(
            Math.min(
              ((selectedUserObject?.timeSpent?.totalTimeSpent || 0) /
                (100 * 60 * 60)) *
                100,
              100
            ).toFixed(2)
          )}
          timeSpent={selectedUserObject?.timeSpent?.totalTimeSpent}
          isFetching={isFetching}
        />
        <CircleCell
          icon={"/images/progress.png"}
          title="totalProgress"
          color="#5DD5D5"
          value={Number(selectedCourseProgress?.totalProgress) || 0}
          isFetching={isFetching}
          className="md:col-span-2 lg:col-span-1"
        />
      </div>
    </div>
  );
};

export default CourseProgress;
const formatTimeSpent = (seconds: number, locale: string) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return locale === "ar" ? `${hours} ساعة` : `${hours}h`;
  } else if (minutes > 0) {
    return locale === "ar" ? `${minutes} دقيقة` : `${minutes}m`;
  } else {
    return locale === "ar" ? `${seconds} ثانية` : `${seconds}s`;
  }
};

const CircleCell = ({
  title,
  value,
  isFetching,
  icon,
  color,
  className,
  timeSpent,
}: {
  title: string;
  value: number;
  color: string;
  icon: string;
  isFetching: boolean;
  className?: string;
  timeSpent?: number;
}) => {
  const text = useTranslations("analytics");
  const locale = useLocale();
  return (
    <div
      className={cn(
        "p-4 rounded-md bg-background cardShadowSecondary relative",
        className
      )}
    >
      <div className="flex items-start justify-between ">
        <div>
          <Image
            src={icon}
            alt={title}
            width={100}
            height={100}
            className="size-12"
          />
          {!isFetching ? (
            <h2 className="mb-1 font-semibold">
              {parseInt(value.toFixed(0))} %
            </h2>
          ) : (
            <div className="w-20 h-3 mb-1 font-semibold rounded-md bg-muted animate-pulse" />
          )}
        </div>
        <div className="w-[90px]">
          {!isFetching ? (
            <HalfCircleProgress
              color={color}
              progress={value}
              size="sm"
            />
          ) : (
            <div className="font-semibold w-[90px] aspect-square rounded-full bg-muted animate-pulse" />
          )}
        </div>
      </div>{" "}
      <h4 className="text-muted-foreground max-sm:text-sm">
        {text(title)}{" "}
        {title === "timeSpent" && timeSpent && (
          <span className="ml-1 text-primary">
            ({formatTimeSpent(timeSpent, locale)})
          </span>
        )}
      </h4>
    </div>
  );
};

const HalfCircleProgress = ({
  progress = 75,
  size = "md",
  color = "#60a5fa",
}) => {
  const radius = size === "sm" ? 30 : size === "lg" ? 110 : 70;
  const circumference = radius * Math.PI;
  const stroke =
    circumference - (circumference * Math.min(progress, 100)) / 100;
  const viewBoxSize = radius * 2 + 20;

  return (
    <div className="relative w-full aspect-square">
      <svg
        viewBox={`0 0 ${viewBoxSize} ${radius + 20}`}
        className="rotate-180 -scale-y-100"
        style={{ overflow: "visible" }}
      >
        <path
          d={`M ${viewBoxSize / 2 - radius} ${
            radius + 10
          } A ${radius} ${radius} 0 0 1 ${viewBoxSize / 2 + radius} ${
            radius + 10
          }`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d={`M ${viewBoxSize / 2 - radius} ${
            radius + 10
          } A ${radius} ${radius} 0 0 1 ${viewBoxSize / 2 + radius} ${
            radius + 10
          }`}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={stroke}
          style={{
            transition: "stroke-dashoffset 625ms ease-in-out",
          }}
        />
      </svg>
    </div>
  );
};
