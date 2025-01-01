/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
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
  status: "Completed" | "Not Completed";
}

interface DayData {
  name: string;
  fullDate: string;
  passed: number;
  notPassed: number;
  date: Date;
  exams: Exam[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string;
    payload?: DayData;
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
              status: "Completed" | "Not Completed";
            }) => ({
              date: new Date(exam.attemptDate),
              examScore: exam.examScore,
              title: exam.lesson.title,
              status: exam.status,
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
    const [startStr] = selectedWeek.split(" - ");
    const [startDay, startMonth, startYear] = startStr.split("/").map(Number);
    const weekStart = new Date(startYear, startMonth - 1, startDay);

    // Initialize 7 days of data
    const weekData: DayData[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      weekData.push({
        name: String(i + 1),
        fullDate: currentDate.toISOString().split("T")[0],
        passed: 0,
        notPassed: 0,
        date: currentDate,
        exams: [],
      });
    }

    // Filter and aggregate exams by day
    exams.forEach((exam) => {
      const examDate = new Date(exam.date);
      const dayIndex = weekData.findIndex(
        (day) =>
          day.date.getDate() === examDate.getDate() &&
          day.date.getMonth() === examDate.getMonth() &&
          day.date.getFullYear() === examDate.getFullYear()
      );

      if (dayIndex !== -1) {
        weekData[dayIndex].exams.push(exam);
        if (exam.status === "Completed") {
          weekData[dayIndex].passed += 1;
        } else {
          weekData[dayIndex].notPassed += 1;
        }
      }
    });

    return weekData;
  }, [selectedWeek, exams]);

  const chartConfig = {
    passed: {
      label: "Passed",
      color: "hsl(var(--primary))",
    },
    notPassed: {
      label: "Not Passed",
      color: "hsl(var(--destructive))",
    },
  } satisfies ChartConfig;

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const dayData = payload[0]?.payload as DayData;
      return (
        <div className="p-2 border rounded-lg shadow-sm bg-background">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-center text-muted-foreground">
              ({dayData.fullDate})
            </span>
            <span className="text-primary">
              {text("passed")}: {dayData.passed}
            </span>
            <span className="text-destructive">
              {text("notPassed")}: {dayData.notPassed}
            </span>
            {dayData.exams.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">{text("quizzes")}:</span>
                {dayData.exams.map((exam, index) => (
                  <div
                    key={index}
                    className={`pl-2 text-sm ${
                      exam.status === "Completed"
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {exam.title} ({parseInt(exam.examScore.toString())}%)
                  </div>
                ))}
              </div>
            )}
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
          <div
            className="w-full rounded-md bg-muted animate-pulse"
            style={{ height: "400px" }}
          />
        ) : filteredExams.length === 0 ? (
          <p className="py-8 text-center">{text("noExamsForThisWeek")}</p>
        ) : (
          <ChartContainer className="w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={filteredExams}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                }}
                className="w-full"
              >
                <XAxis
                  dataKey="name"
                  axisLine={true}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={20}
                  padding={{ top: 20 }}
                />
                {/* @ts-ignore  */}
                <ChartTooltip cursor={false} content={CustomTooltip} />
                <Bar
                  dataKey="passed"
                  fill="var(--color-passed)"
                  radius={[4, 4, 0, 0]}
                  className="w-full"
                />
                <Bar
                  dataKey="notPassed"
                  fill="var(--color-notPassed)"
                  radius={[4, 4, 0, 0]}
                  className="w-full"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamsChart;
