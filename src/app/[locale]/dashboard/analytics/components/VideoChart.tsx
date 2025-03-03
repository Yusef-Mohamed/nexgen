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
import MonthSelector from "@/components/MonthSelector";

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
  const [selectedMonth, setSelectedMonth] = useState("");
  const text = useTranslations("analytics");

  const chartData = useMemo(() => {
    if (!selectedMonth || !courseProgress?.progress) return [];

    const [month, year] = selectedMonth.split("/").map(Number);
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    // Initialize array for all days of the month
    const daysOfMonth = Array.from({ length: monthEnd.getDate() }, (_, i) => {
      const day = new Date(monthStart);
      day.setDate(monthStart.getDate() + i);
      return {
        date: day.toISOString(),
        count: 0,
        titles: [] as string[],
        dayIndex: i + 1,
      };
    });

    // Aggregate exam counts by day
    courseProgress.progress
      .filter((exam: { status: string }) => {
        return exam.status === "Completed";
      })
      .filter((exam: { attemptDate: string }) => {
        const examDate = new Date(exam.attemptDate);
        return examDate >= monthStart && examDate <= monthEnd;
      })
      .forEach((exam: { attemptDate: string; lesson: { title: string } }) => {
        const examDate = new Date(exam.attemptDate);
        const dayIndex = examDate.getDate() - 1;
        if (dayIndex >= 0 && dayIndex < daysOfMonth.length) {
          daysOfMonth[dayIndex].count++;
          daysOfMonth[dayIndex].titles.push(exam.lesson.title);
        }
      });

    return daysOfMonth;
  }, [selectedMonth, courseProgress]);

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
          <MonthSelector
            selectedUserObject={selectedUserObject}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center">{text("noVideosForThisMonth")}</p>
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
