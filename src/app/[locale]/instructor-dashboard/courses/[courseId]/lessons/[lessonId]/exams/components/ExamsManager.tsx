"use client";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IExam } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import ExamQuestionDisplay from "./ExamQuestionDisplay";
import ExamsDisplay from "./ExamsDisplay";
import { useAuth } from "@/components/auth-provider";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";

interface ExamsManagerProps {
  type: "course" | "lesson" | "placement";
  parentId: string;
  title?: string;
  description?: string;
  backUrl?: string;
}

export const ExamsManager = ({
  type,
  parentId,
  title,
  description,
  backUrl,
}: ExamsManagerProps) => {
  const [selectedExam, setSelectedExam] = useState<IExam | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const text = useTranslations("exams");
  const { token } = useAuth();

  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initialExamId = useMemo(
    () => searchParams?.get("exam") || undefined,
    [searchParams]
  );
  const hasExamParam = !!initialExamId;

  const fetchExams = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const endpoint = `/exams/${type}s/${parentId}`;
      const response = await axiosInstance.get(endpoint);
      setExams(response.data?.data || []);
    } catch (err) {
      const typedError = err as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message ||
        typedError?.message ||
        text("fetch_error");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount/changes
  useEffect(() => {
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, parentId, token]);

  // Drive selection from URL + data
  useEffect(() => {
    if (!hasExamParam) {
      // Clear selection if param removed
      if (selectedExam) setSelectedExam(null);
      return;
    }
    // When param exists and data is ready, select matching exam
    if (!loading && exams.length > 0) {
      const match = exams.find((e) => e._id === initialExamId);
      setSelectedExam(match || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasExamParam, loading, initialExamId, exams]);

  const handleViewQuestions = (exam: IExam) => {
    try {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("exam", exam._id);
      router.replace(`${pathname}?${params.toString()}`);
    } catch {}
  };

  const handleBackToExams = () => {
    try {
      const params = new URLSearchParams(searchParams?.toString());
      params.delete("exam");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    } catch {}
  };

  const handleExamUpdate = (updatedExam: IExam) => {
    setSelectedExam(updatedExam);
  };

  // Show the questions UI when selection is materialized
  if (hasExamParam) {
    if (loading && !selectedExam) {
      // Questions-style skeleton while loading a deep-linked exam
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0"
                onClick={handleBackToExams}
              >
                <ArrowLeft
                  className={cn("w-4 h-4", locale === "ar" && "rotate-180")}
                />
              </Button>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-80" />
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white rounded-md shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-72 mb-3" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (selectedExam) {
      return (
        <ExamQuestionDisplay
          exam={selectedExam}
          onBack={handleBackToExams}
          onExamUpdate={handleExamUpdate}
        />
      );
    }
    // If param exists but no match after load, fall back to list view
  }

  return (
    <ExamsDisplay
      type={type}
      parentId={parentId}
      title={title}
      description={description}
      backUrl={backUrl}
      initialExamId={initialExamId}
      onViewQuestions={handleViewQuestions}
      exams={exams}
      loading={loading}
      error={error}
      onRefresh={fetchExams}
    />
  );
};

export default ExamsManager;
