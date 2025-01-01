import { useLocale, useTranslations } from "next-intl";
import { ICourseProgress } from "@/types";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { cn } from "@/lib/utils";
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
      const axiosInstance = createClientAxiosInstance();
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

  return (
    <div>
      {courseProgress.certificate.isTake && (
        <div className="p-2 mb-2 text-center rounded-md ">
          <p>
            {locale === "ar"
              ? "لقد اجتزت الامتحان وتستحق الشهادة🎉"
              : "congratulations you have passed the exam and deserve the certificate🎉"}
          </p>

          <a
            href={courseProgress.certificate.file}
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
          icon={
            <svg
              width={24}
              height={25}
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.3578 4.64526C12.2266 4.57967 12.161 4.54687 12.0922 4.53396C12.0313 4.52253 11.9687 4.52253 11.9078 4.53396C11.839 4.54687 11.7734 4.57967 11.6422 4.64526L2 9.46637L11.6422 14.2875C11.7734 14.3531 11.839 14.3859 11.9078 14.3988C11.9687 14.4102 12.0313 14.4102 12.0922 14.3988C12.161 14.3859 12.2266 14.3531 12.3578 14.2875L16.9211 12.0058L22 9.46637L12.3578 4.64526Z"
                fill="#EEF8FF"
              />
              <path
                d="M11.6422 14.2875L4 10.4664C4 13.1245 4 14.6148 4 17.273C4 17.6449 4 17.8309 4.05802 17.9937C4.10931 18.1376 4.1929 18.2679 4.30238 18.3745C4.42622 18.4951 4.59527 18.5725 4.93335 18.7275L11.3334 21.6608C11.5786 21.7732 11.7012 21.8294 11.8289 21.8516C11.9421 21.8713 12.0579 21.8713 12.1711 21.8516C12.2988 21.8294 12.4214 21.7732 12.6666 21.6608L19.0666 18.7275C19.4047 18.5725 19.5738 18.4951 19.6976 18.3745C19.8071 18.2679 19.8907 18.1376 19.942 17.9937C20 17.8309 20 17.6449 20 17.273C20 14.6148 20 13.1245 20 10.4664L16.9211 12.0058L12.3578 14.2875C12.2266 14.3531 12.161 14.3859 12.0922 14.3988C12.0313 14.4102 11.9687 14.4102 11.9078 14.3988C11.839 14.3859 11.7734 14.3531 11.6422 14.2875Z"
                fill="#EEF8FF"
              />
              <path
                d="M11.6422 14.2875L2 9.46637L11.6422 4.64526C11.7734 4.57967 11.839 4.54687 11.9078 4.53396C11.9687 4.52253 12.0313 4.52253 12.0922 4.53396C12.161 4.54687 12.2266 4.57967 12.3578 4.64526L22 9.46637L16.9211 12.0058M11.6422 14.2875C11.7734 14.3531 11.839 14.3859 11.9078 14.3988C11.9687 14.4102 12.0313 14.4102 12.0922 14.3988C12.161 14.3859 12.2266 14.3531 12.3578 14.2875L16.9211 12.0058M11.6422 14.2875L4 10.4664C4 13.1245 4 14.6148 4 17.273C4 17.6449 4 17.8309 4.05802 17.9937C4.10931 18.1376 4.1929 18.2679 4.30238 18.3745C4.42622 18.4951 4.59527 18.5725 4.93335 18.7275L11.3334 21.6608C11.5786 21.7732 11.7012 21.8294 11.8289 21.8516C11.9421 21.8713 12.0579 21.8713 12.1711 21.8516C12.2988 21.8294 12.4214 21.7732 12.6666 21.6608L19.0666 18.7275C19.4047 18.5725 19.5738 18.4951 19.6976 18.3745C19.8071 18.2679 19.8907 18.1376 19.942 17.9937C20 17.8309 20 17.6449 20 17.273C20 14.6148 20 13.1245 20 10.4664L16.9211 12.0058M17 15.4664V12.4608C17 12.2813 17 12.1916 16.9727 12.1124C16.9597 12.0748 16.9424 12.0391 16.9211 12.0058M12 9.46637L16.5578 11.7453C16.7183 11.8255 16.7986 11.8657 16.8572 11.9255C16.8813 11.9501 16.9027 11.977 16.9211 12.0058"
                stroke="#1B7DF5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          value={
            Number(selectedCourseProgress?.totalLessonsExamsPercentage) || 0
          }
          color="#1B7DF5"
          isFetching={isFetching}
        />
        <CircleCell
          icon={
            <svg
              width={24}
              height={25}
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6.9668V12.9668L16 14.9668M22 12.9668C22 18.4896 17.5228 22.9668 12 22.9668C6.47715 22.9668 2 18.4896 2 12.9668C2 7.44395 6.47715 2.9668 12 2.9668C17.5228 2.9668 22 7.44395 22 12.9668Z"
                stroke="#9747FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          title="timeSpent"
          color="#9747FF"
          value={Number(
            (
              ((selectedUserObject?.timeSpent?.monthlyTimeSpent || 0) /
                (50 * 60 * 60 * 1000)) *
              100
            ).toFixed(2)
          )}
          isFetching={isFetching}
        />
        <CircleCell
          icon={
            <svg
              width={24}
              height={25}
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 3.9668H7.8C6.11984 3.9668 5.27976 3.9668 4.63803 4.29378C4.07354 4.5814 3.6146 5.04034 3.32698 5.60483C3 6.24656 3 7.08664 3 8.7668V17.1668C3 18.847 3 19.687 3.32698 20.3288C3.6146 20.8933 4.07354 21.3522 4.63803 21.6398C5.27976 21.9668 6.11984 21.9668 7.8 21.9668H16.2C17.8802 21.9668 18.7202 21.9668 19.362 21.6398C19.9265 21.3522 20.3854 20.8933 20.673 20.3288C21 19.687 21 18.847 21 17.1668V13.9668M12 8.9668H16V12.9668M15.5 4.4668V2.9668M19.4393 5.52746L20.5 4.4668M20.5103 9.4668H22.0103M3 14.3139C3.65194 14.4146 4.31987 14.4668 5 14.4668C9.38636 14.4668 13.2653 12.2944 15.6197 8.9668"
                stroke="#5DD5D5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
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
const CircleCell = ({
  title,
  value,
  isFetching,
  icon,
  color,
  className,
}: {
  title: string;
  value: number;
  color: string;
  icon: JSX.Element;
  isFetching: boolean;
  className?: string;
}) => {
  const text = useTranslations("analytics");
  return (
    <div className={cn("p-4 rounded-md bg-clear-ground", className)}>
      <div className="flex items-start justify-between ">
        <div>
          <div
            className="flex items-center justify-center mb-1 text-xl rounded-md w-11 h-11"
            style={{
              color: color,
              backgroundColor: color + "2a",
            }}
          >
            {icon}
          </div>
          {!isFetching ? (
            <h2 className="mb-1 font-semibold">
              {parseInt(value.toFixed(0))} %
            </h2>
          ) : (
            <div className="w-20 h-3 mb-1 font-semibold rounded-md bg-muted animate-pulse" />
          )}
          <h4 className="text-muted-foreground max-sm:text-sm">
            {text(title)}
          </h4>
        </div>
        <div className="w-[90px]">
          {!isFetching ? (
            <HalfCircleProgress color={color} progress={value} size="sm" />
          ) : (
            <div className="font-semibold w-[90px] aspect-square rounded-full bg-muted animate-pulse" />
          )}
        </div>
      </div>
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
