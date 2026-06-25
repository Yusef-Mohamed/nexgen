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
import MonthSelector from "@/components/MonthSelector"; // Updated import
import TrendBadge from "@/components/TrendBadge";
import { axiosInstance } from "@/app/lib/utils";
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

// Helper function to get all days in a month
const getMonthDays = (selectedMonth: string): Date[] => {
  const [month, year] = selectedMonth.split("/").map(Number);
  const startDate = new Date(year, month - 1, 1); // Month is 0-based
  const endDate = new Date(year, month, 0); // Last day of the month
  const days: Date[] = [];
  for (let i = 0; i < endDate.getDate(); i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }
  return days;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  const text = useTranslations("analytics");
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
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
  selectedMonth: string,
): ChartDataPoint[] => {
  const monthDays = getMonthDays(selectedMonth);
  const initialData: Record<string, ChartDataPoint> = {};
  monthDays.forEach((date) => {
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
  return monthDays
    .map((date) => {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      return initialData[normalizedDate.toISOString()];
    })
    .filter((item): item is ChartDataPoint => item !== undefined)
    .sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime(),
    );
};

const Practice: React.FC = () => {
  const { token } = useAuth();
  const { selectedUser, selectedUserObject } = useAnalyticsStore();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [monthDays, setMonthDays] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Updated state for month
  const text = useTranslations("analytics");

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        if (!selectedMonth || !selectedUser) return;

        const [month, year] = selectedMonth.split("/").map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const res = await axiosInstance.get<AnalyticsResponse>(
          `/analytics/user-analytic-performance/${selectedUser}?startDate=${
            startDate.toISOString().split("T")[0]
          }&endDate=${endDate.toISOString().split("T")[0]}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setData(res.data);

        // Get month days and set them in state
        const days = getMonthDays(selectedMonth);
        setMonthDays(days);

        // Process analytics data for chart with selected month
        const processedData = processAnalyticsData(
          res.data?.analyticsDocs || [],
          selectedMonth,
        );
        setChartData(processedData);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedUser && selectedMonth) getData();
  }, [selectedUser, token, selectedMonth]);
  return (
    <Card className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
      <CardHeader className="border-b border-primary/10 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="h3">{text("practice")}</CardTitle>
          </div>
          <MonthSelector // Updated component
            selectedUserObject={selectedUserObject}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
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
                title={text("thisMonthPracticeNumber")} // Updated text
                value={data?.analyticsDocs?.length || 0}
                difference={0}
                total={20}
              />
              <StatBlock
                title={text("thisMonthWrongPracticeNumber")} // Updated text
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
              className="w-full rounded-md animate-pulse bg-muted"
              style={{ height: "400px" }}
            />
            <table className="w-full mt-2 animate-pulse">
              <thead>
                <tr>
                  <th className="p-2">
                    <div className="w-1/2 h-4 rounded-full bg-muted"></div>
                  </th>
                  <th className="p-2">
                    <div className="w-1/2 h-4 rounded-full bg-muted"></div>
                  </th>
                  <th className="p-2">
                    <div className="w-1/2 h-4 rounded-full bg-muted"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <div className="w-1/3 h-4 rounded-full bg-muted"></div>
                    </td>
                    <td className="p-2">
                      <div className="w-1/3 h-4 rounded-full bg-muted"></div>
                    </td>
                    <td className="p-2">
                      <div className="w-1/3 h-4 rounded-full bg-muted"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : data?.analyticsDocs.length ? (
          <>
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
                        const dayIndex = monthDays.findIndex(
                          (d) => d.toISOString() === value,
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
                              "bg-destructive text-destructive-foreground":
                                analytic.isSeen,
                              "bg-yellow-400 text-clear-ground dark:bg-yellow-600":
                                !analytic.isPassed && !analytic.isSeen,
                              "bg-primary text-primary-foreground":
                                analytic.isPassed,
                            },
                          )}
                        >
                          {analytic.isPassed
                            ? text("correct")
                            : analytic.isSeen
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
          <p className="py-8 text-center">{text("noPracticeForThisMonth")}</p> // Updated text
        )}
      </CardContent>
    </Card>
  );
};

export default Practice;
