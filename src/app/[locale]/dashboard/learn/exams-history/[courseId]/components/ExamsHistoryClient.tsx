"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { axiosInstance } from "@/app/lib/utils";
import { ICourse } from "@/types";
import { getDynamicString } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CalendarIcon, ClipboardList } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardContainer from "../../../../components/DashboardContainer";

interface LessonsScores {
  lessonId: string;
  lessonTitle: string;
  percentage: number;
  attemptDate: string;
  modelExam: string;
}

interface UserScoreData {
  data: {
    lessonsScores: LessonsScores[];
  };
}

interface ExamsHistoryClientProps {
  courseId: string;
}

const HistorySkeleton = () => (
  <Card className="flex w-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
    <CardHeader className="border-b border-primary/10 p-4 sm:p-5">
      <Skeleton className="mb-2 h-6 w-48" />
      <Skeleton className="h-4 w-32" />
    </CardHeader>
    <CardContent className="grow p-4 sm:p-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 sm:p-5 sm:pt-0">
      <Skeleton className="h-10 w-full rounded-xl" />
    </CardFooter>
  </Card>
);

const ExamsHistoryClient = ({ courseId }: ExamsHistoryClientProps) => {
  const text = useTranslations("learn");
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [lessonsScores, setLessonsScores] = useState<LessonsScores[]>([]);
  const [courseData, setCourseData] = useState<ICourse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !user?._id) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const userScoreResponse = await axiosInstance.get<UserScoreData>(
          `/exams/userScore/${courseId}/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setLessonsScores(userScoreResponse.data.data.lessonsScores || []);

        const courseResponse = await axiosInstance.get<{ data: ICourse }>(
          `/courses/${courseId}`,
        );
        setCourseData(courseResponse.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, token, user?._id]);

  const courseTitle = courseData ? getDynamicString(courseData.title) : "";

  if (isLoading) {
    return (
      <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
        <DashboardContainer className="space-y-5">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <HistorySkeleton key={i} />
            ))}
          </div>
        </DashboardContainer>
      </main>
    );
  }

  if (error || !courseData) {
    return (
      <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
        <DashboardContainer>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm font-bold text-destructive">
            {error || "Failed to load course data"}
          </div>
        </DashboardContainer>
      </main>
    );
  }

  return (
    <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
      <DashboardContainer className="space-y-5">
        <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm sm:p-6">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(var(--primary)/0.08)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative flex min-w-0 items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
              <ClipboardList className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-text-1 sm:text-xl">
                {text("courseExamsHistory")}
              </h1>
              <p className="mt-1 max-w-2xl truncate text-sm leading-6 text-text-3">
                {courseTitle}
              </p>
            </div>
          </div>
        </section>

        {lessonsScores.length === 0 ? (
          <div className="rounded-2xl border border-primary/10 bg-clear-ground p-10 text-center shadow-sm">
            <h2 className="text-xl font-black text-text-1">
              {text("noExamAttempts")}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-3">
              {text("noExamAttemptsDescription")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {lessonsScores.map((progress) => {
              return (
                <Card
                  key={progress.lessonId}
                  className="flex w-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-text-1/5"
                >
                  <CardHeader className="border-b border-primary/10 p-4 sm:p-5">
                    <CardTitle className="mb-3 line-clamp-2 text-base font-black text-text-1">
                      {text("lesson_type")} |{" "}
                      {getDynamicString(progress.lessonTitle)}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-text-3">
                      <Badge variant="default">{text("completed")}</Badge>
                      <Badge variant="outline">
                        {progress.modelExam === "A"
                          ? text("modelA")
                          : text("modelB")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grow p-4 sm:p-5">
                    <div className="space-y-3 text-sm font-semibold text-text-2">
                      <div className="flex items-center gap-2">
                        <Award className="size-4 text-primary" />
                        <span>
                          {text("score")}: {progress.percentage}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="size-4 text-primary" />
                        <span>
                          {new Date(progress.attemptDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 sm:p-5 sm:pt-0">
                    <Button
                      className="w-full rounded-xl"
                      variant="primary"
                      asChild
                    >
                      <Link
                        href={`/dashboard/learn/exams-history/${courseId}/${progress.lessonId}`}
                        className="w-full"
                      >
                        {text("viewExamDetails")}
                        <ClipboardList className="ms-2 size-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </DashboardContainer>
    </main>
  );
};

export default ExamsHistoryClient;
