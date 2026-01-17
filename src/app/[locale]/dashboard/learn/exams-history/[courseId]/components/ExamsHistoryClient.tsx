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

        // Fetch user score data
        const userScoreResponse = await axiosInstance.get<UserScoreData>(
          `/exams/userScore/${courseId}/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLessonsScores(userScoreResponse.data.data.lessonsScores || []);

        // Fetch course data
        const courseResponse = await axiosInstance.get<{ data: ICourse }>(
          `/courses/${courseId}`
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
  if (isLoading) {
    return (
      <main className="bg-dash-ground">
        <section className="py-8 container mx-auto">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 gap-4 pb-6 mt-8 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="w-full flex flex-col cardShadow bg-background"
              >
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="grow">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (error || !courseData) {
    return (
      <main className="bg-dash-ground">
        <section className="py-8 container mx-auto">
          <p className="text-destructive">
            {error || "Failed to load course data"}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-dash-ground">
      <section className="py-8 container mx-auto">
        <h1>
          {text("courseExamsHistory")} | {getDynamicString(courseData.title)}
        </h1>
        <div className="grid grid-cols-1 gap-4 pb-6 mt-8 lg:grid-cols-2">
          {lessonsScores.map((progress) => {
            return (
              <Card
                key={progress.lessonId}
                className="w-full flex flex-col cardShadow bg-background"
              >
                <CardHeader>
                  <CardTitle className="mb-2 h2">
                    {text("lesson_type")} |{" "}
                    {getDynamicString(progress.lessonTitle)}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={"default"}>{text("completed")}</Badge>
                    <Badge variant="outline">
                      {progress.modelExam === "A"
                        ? text("modelA")
                        : text("modelB")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grow">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>
                        {text("score")}: {progress.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(progress.attemptDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="primary" asChild>
                    <Link
                      href={`/dashboard/learn/exams-history/${courseId}/${progress.lessonId}`}
                      className="w-full"
                    >
                      {text("viewExamDetails")}
                      <ClipboardList className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default ExamsHistoryClient;
