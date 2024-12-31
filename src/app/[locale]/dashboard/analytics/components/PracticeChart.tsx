"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useAuth } from "@/components/auth-provider";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import { useLocale, useTranslations } from "next-intl";
import WeekSelector from "@/components/WeekSelector";
import TrendBadge from "@/components/TrendBadge";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { IAnalytic } from "@/types";
import { cn } from "@/lib/utils";

// Types
interface AnalyticsResponse {
  status: string;
  passedAnalyticsCount: number;
  totalAnalytics: number;
  passedDocs: number;
  failedDocs: number;
  analyticsDocs: IAnalytic[];
}

interface ChartDataPoint {
  day: string;
  fullDate: string;
  correctNumber: number;
  wrongNumber: number;
}

interface StatBlockProps {
  title: string;
  value: number;
  difference: number;
  total: number;
  base?: string;
  mark?: string;
  withDivider?: boolean;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataPoint;
  }>;
  label?: string;
}

// Chart configuration
const chartConfig: ChartConfig = {
  correctNumber: {
    label: "Correct attempts",
    color: "#0084FF",
  },
  wrongNumber: {
    label: "Wrong attempts",
    color: "#FF4D4F",
  },
};
const getWeekDaysFromRange = (selectedWeek: string): Date[] => {
  const [startDate] = selectedWeek.split(" - ");
  const [startDay, startMonth, startYear] = startDate.split("/").map(Number);
  const start = new Date(startYear, startMonth - 1, startDay); // month is 0-based
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    weekDays.push(day);
  }

  return weekDays;
};
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  const text = useTranslations("analytics");
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="p-4 border rounded-lg shadow-lg bg-clear-ground">
      <p className="mb-2 font-medium text-center">
        {new Date(payload[0]?.payload.fullDate).toLocaleDateString()}
      </p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: chartConfig.correctNumber.color }}
          />
          <p className="text-sm">
            {text("correct")}: {payload[0]?.value || 0}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: chartConfig.wrongNumber.color }}
          />
          <p className="text-sm">
            {text("wrong")}: {payload[1]?.value || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

// StatBlock component
const StatBlock: React.FC<StatBlockProps> = ({
  title,
  value,
  difference,
  total,
  base,
  mark,
  withDivider = true,
}) => {
  const locale = useLocale();

  return (
    <div>
      <div>
        <p className="mb-2 font-medium sm:text-lg">{title}</p>
        <h3 className="flex items-end gap-1 mt-1 mb-2 font-semibold h1-5">
          {mark}
          {value?.toLocaleString()}
          {base && (
            <span className="mb-1 text-sm text-text-3">
              {withDivider && (locale !== "ar" ? "/" : "\\")} {base}
            </span>
          )}
        </h3>
      </div>
      {difference !== 0 && difference && total && (
        <TrendBadge
          percentage={Math.abs((difference / total) * 100).toFixed(1)}
          positive={difference > 0}
        />
      )}
    </div>
  );
};

const processAnalyticsData = (
  analyticsDocs: IAnalytic[],
  selectedWeek: string
): ChartDataPoint[] => {
  const weekDays = getWeekDaysFromRange(selectedWeek);
  const initialData: Record<string, ChartDataPoint> = {};
  weekDays.forEach((date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    const dateKey = normalizedDate.toISOString();
    initialData[dateKey] = {
      day: normalizedDate.getDate().toString(),
      fullDate: dateKey,
      correctNumber: 0,
      wrongNumber: 0,
    };
  });
  analyticsDocs.forEach((doc) => {
    const docDate = new Date(doc.createdAt);
    docDate.setHours(0, 0, 0, 0);
    const docDateKey = docDate.toISOString();
    if (initialData[docDateKey]) {
      if (doc.isPassed) {
        initialData[docDateKey].correctNumber += 1;
      } else if (doc.marketerComment) {
        initialData[docDateKey].wrongNumber += 1;
      }
    }
  });
  return weekDays
    .map((date) => {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      return initialData[normalizedDate.toISOString()];
    })
    .filter((item): item is ChartDataPoint => item !== undefined)
    .sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
    );
};
const Practice: React.FC = () => {
  const { token } = useAuth();
  const { selectedUser, selectedUserObject } = useAnalyticsStore();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const text = useTranslations("analytics");
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const axiosInstance = createClientAxiosInstance();
        if (!selectedWeek) return;

        const [start, end] = selectedWeek.split(" - ");
        if (!start || !end) return;

        const res = await axiosInstance.get<AnalyticsResponse>(
          `/analytics/user-analytic-performance/${selectedUser}?startDate=${start}&endDate=${end}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);

        // Get week days and set them in state
        const days = getWeekDaysFromRange(selectedWeek);
        setWeekDays(days);

        // Process analytics data for chart with selected week
        const processedData = processAnalyticsData(
          res.data?.analyticsDocs || [],
          selectedWeek
        );
        setChartData(processedData);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedUser && selectedWeek) getData();
  }, [selectedUser, token, selectedWeek]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="h3">{text("practice")}</CardTitle>
          </div>
          <WeekSelector
            selectedUserObject={selectedUserObject}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="w-3/4 h-4 rounded-full bg-muted" />
                <div className="w-1/2 h-3 mt-2 rounded-full bg-muted" />
              </div>
            ))
          ) : (
            <>
              <StatBlock
                title={text("totalPracticeNumber")}
                value={data?.passedAnalyticsCount || 0}
                difference={0}
                total={20}
                base="200"
              />
              <StatBlock
                title={text("thisWeekPracticeNumber")}
                value={data?.analyticsDocs?.length || 0}
                difference={0}
                total={20}
              />
              <StatBlock
                title={text("thisWeekWrongPracticeNumber")}
                value={data?.failedDocs || 0}
                difference={0}
                total={20}
              />
            </>
          )}
        </div>

        {isLoading ? (
          <>
            <div
              className="w-full rounded-md bg-muted animate-pulse"
              style={{ height: "400px" }}
            />
            <table className="w-full mt-2 animate-pulse">
              <thead>
                <tr>
                  <th className="p-2">
                    <div className="w-1/2 h-4 rounded-full bg-muted "></div>
                  </th>
                  <th className="p-2">
                    <div className="w-1/2 h-4 rounded-full bg-muted "></div>
                  </th>{" "}
                  <th className="p-2">
                    <div className="w-1/2 h-4 rounded-full bg-muted "></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <div className="w-1/3 h-4 rounded-full bg-muted "></div>
                    </td>
                    <td className="p-2">
                      <div className="w-1/3 h-4 rounded-full bg-muted "></div>
                    </td>
                    <td className="p-2">
                      <div className="w-1/3 h-4 rounded-full bg-muted "></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : data?.analyticsDocs.length ? (
          <>
            {" "}
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="fullDate"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (value) {
                        const dayIndex = weekDays.findIndex(
                          (d) => d.toISOString() === value
                        );
                        return `${dayIndex + 1}`;
                      }
                      return "";
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={20}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar
                    dataKey="correctNumber"
                    fill="var(--color-correctNumber)"
                    radius={[4, 4, 0, 0]}
                    barSize={15}
                  />
                  <Bar
                    dataKey="wrongNumber"
                    fill="var(--color-wrongNumber)"
                    radius={[4, 4, 0, 0]}
                    barSize={15}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="max-w-full mt-4 overflow-auto">
              <table className="w-full whitespace-normal">
                <thead>
                  <tr>
                    <th className="p-2 font-medium text-start">
                      {" "}
                      {text("practice")}
                    </th>
                    <th className="p-2 font-medium text-start">
                      {text("date")}
                    </th>
                    <th className="p-2 font-medium text-start">
                      {text("status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.analyticsDocs.map((analytic, index) => (
                    <tr key={analytic._id}>
                      <td className="p-2 text-text-2">
                        {text("practiceNumber")} {index + 1}
                      </td>
                      <td className="p-2 text-text-2">
                        {new Date(analytic.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-text-2">
                        <span
                          className={cn(
                            `px-2 py-1 rounded-full text-xs font-semibold`,
                            {
                              "bg-primary text-primary-foreground":
                                analytic.isPassed,
                              "bg-destructive text-destructive-foreground":
                                analytic.marketerComment,
                              "bg-yellow-400 text-clear-ground dark:bg-yellow-600":
                                !analytic.isPassed && !analytic.marketerComment,
                            }
                          )}
                        >
                          {analytic.isPassed
                            ? text("correct")
                            : analytic.marketerComment
                            ? text("wrong")
                            : text("pending")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="py-8 text-center">{text("noPracticeForThisWeek")}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Practice;
