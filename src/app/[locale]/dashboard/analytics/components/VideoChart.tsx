import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useTranslations } from "next-intl";
import WeekSelector from "@/components/WeekSelector";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      date: string;
      count: number;
      titles: string[];
      dayIndex: number;
    };
  }>;
}

const VideoChart = () => {
  const { selectedUserObject, courseProgress } = useAnalyticsStore();
  const [selectedWeek, setSelectedWeek] = useState("");
  const text = useTranslations("analytics");

  const chartData = useMemo(() => {
    if (!selectedWeek || !courseProgress?.progress) return [];

    const [startStr, endStr] = selectedWeek.split(" - ");
    const [startDay, startMonth, startYear] = startStr.split("/").map(Number);
    const [endDay, endMonth, endYear] = endStr.split("/").map(Number);
    const weekStart = new Date(startYear, startMonth - 1, startDay);
    const weekEnd = new Date(endYear, endMonth - 1, endDay);

    // Initialize array for all days of the week
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return {
        date: day.toISOString(),
        count: 0,
        titles: [] as string[],
        dayIndex: i + 1,
      };
    });

    // Aggregate exam counts by day
    courseProgress.progress
      .filter((exam: { attemptDate: string }) => {
        const examDate = new Date(exam.attemptDate);
        return examDate >= weekStart && examDate <= weekEnd;
      })
      .forEach((exam: { attemptDate: string; lesson: { title: string } }) => {
        const examDate = new Date(exam.attemptDate);
        const dayIndex = Math.floor(
          (examDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayIndex >= 0 && dayIndex < 7) {
          daysOfWeek[dayIndex].count++;
          daysOfWeek[dayIndex].titles.push(exam.lesson.title);
        }
      });

    return daysOfWeek;
  }, [selectedWeek, courseProgress]);

  const chartConfig = {
    count: {
      label: "Number of Exams",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="p-4 border rounded-lg shadow-lg bg-background">
          <p className="mb-2 font-medium text-center">
            {new Date(data?.date ?? "").toLocaleDateString()}
          </p>
          <div className="flex flex-col gap-2">
            <span className="font-bold">
              {text("videosCount")}: {data?.count}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="h3">{text("courseVideos")}</CardTitle>
          </div>
          <WeekSelector
            selectedUserObject={selectedUserObject}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center">{text("noVideosForThisWeek")}</p>
        ) : (
          <ChartContainer className="w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="dayIndex"
                  axisLine={true}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis
                  domain={[0, "auto"]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={20}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoChart;
