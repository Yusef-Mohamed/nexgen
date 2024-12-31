"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/components/auth-provider";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useTranslations } from "next-intl";
import WeekSelector from "@/components/WeekSelector";

interface Exam {
  date: Date;
  examScore: number;
  title: string;
  name?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: Exam;
  }>;
}

const ExamsChart = () => {
  const { token } = useAuth();
  const {
    selectedCourse,
    selectedUser,
    selectedUserObject,
    setCourseProgress,
    isCourseProgressLoading,
    setIsCourseProgressLoading,
  } = useAnalyticsStore();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const text = useTranslations("analytics");

  useEffect(() => {
    const getExams = async () => {
      try {
        setIsCourseProgressLoading(true);
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance.get(
          `/exams/courseProgress/${selectedCourse}/${selectedUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourseProgress(res.data.data);
        setExams(
          res.data.data.progress.map(
            (exam: {
              attemptDate: string;
              examScore: number;
              lesson: { title: string };
            }) => ({
              date: new Date(exam.attemptDate),
              examScore: exam.examScore,
              title: exam.lesson.title,
            })
          ) || []
        );
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setIsCourseProgressLoading(false);
      }
    };
    if (selectedCourse && selectedUser) getExams();
  }, [
    selectedCourse,
    selectedUser,
    token,
    setIsCourseProgressLoading,
    setExams,
    setCourseProgress,
  ]);

  const filteredExams = useMemo(() => {
    if (!selectedWeek) return [];
    const [startStr, endStr] = selectedWeek.split(" - ");
    const [startDay, startMonth, startYear] = startStr.split("/").map(Number);
    const [endDay, endMonth, endYear] = endStr.split("/").map(Number);
    const weekStart = new Date(startYear, startMonth - 1, startDay);
    const weekEnd = new Date(endYear, endMonth - 1, endDay);

    return exams
      .filter((exam) => exam.date >= weekStart && exam.date <= weekEnd)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((exam, index) => ({
        ...exam,
        name: `${index + 1}`,
      }));
  }, [selectedWeek, exams]);
  const chartConfig = {
    examScore: {
      label: "Exam Score",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 border rounded-lg shadow-sm bg-background">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">
              {text("quiz")} - {payload[0]?.payload?.title} :
            </span>
            <span className="font-bold">
              {text("score")} :{payload[0]?.value}%
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
            <CardTitle className="h3">{text("examsPerformance")}</CardTitle>
          </div>
          <WeekSelector
            selectedUserObject={selectedUserObject}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isCourseProgressLoading ? (
          <>
            <div
              className="w-full rounded-md bg-muted animate-pulse"
              style={{ height: "400px" }}
            />
          </>
        ) : filteredExams.length === 0 ? (
          <p className="py-8 text-center">{text("noExamsForThisWeek")}</p>
        ) : (
          <ChartContainer className="w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={filteredExams}
                margin={{
                  top: 20,
                }}
                className="w-full"
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={true}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={20}
                  padding={{ top: 20 }}
                />
                <ChartTooltip cursor={true} content={CustomTooltip} />
                <defs>
                  <linearGradient
                    id="fillExamScore"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-examScore)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-examScore)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="examScore"
                  type="natural"
                  fill="url(#fillExamScore)"
                  fillOpacity={0.4}
                  stroke="var(--color-examScore)"
                  className="w-full"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamsChart;
