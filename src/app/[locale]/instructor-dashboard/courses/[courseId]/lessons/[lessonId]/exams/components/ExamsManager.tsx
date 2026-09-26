"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IExam } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn, getDynamicString } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import ExamQuestionDisplay from "./ExamQuestionDisplay";
import ExamsDisplay from "./ExamsDisplay";
import { useAuth } from "@/components/auth-provider";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "@/i18n/navigation";

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
      setExams((response.data?.data || []).map((exam: IExam & { translationTitle?: IExam["title"] }) => ({
        ...exam,
        title: exam.translationTitle && typeof exam.translationTitle === "object"
          ? { ...exam.translationTitle, localized: getDynamicString(exam.title) }
          : exam.title,
      })));
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
      if (match) {
        // Only update if it's a different exam
        if (match._id !== selectedExam?._id) {
          setSelectedExam(match);
        }
      } else if (!match && selectedExam && selectedExam._id !== initialExamId) {
        // Exam param exists but no match found - only clear if the selected exam doesn't match the param
        // This prevents clearing an exam that was set optimistically before exams loaded
        setSelectedExam(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasExamParam, loading, initialExamId, exams]);

  const handleViewQuestions = async (exam: IExam) => {
    try {
      // Set the exam immediately in state to avoid race conditions
      setSelectedExam(exam);

      const params = new URLSearchParams(searchParams?.toString());
      params.set("exam", exam._id);
      const newUrl = `${pathname}?${params.toString()}`;

      // Use router.replace and ensure it completes
      await router.replace(newUrl);
    } catch (error) {
      console.error("Error navigating to exam questions:", error);
      // If navigation fails, still try to set the exam
      setSelectedExam(exam);
    }
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
    setExams((previous) => previous.map((exam) => exam._id === updatedExam._id ? updatedExam : exam));
  };

  // Show the questions UI when selection is materialized
  // Check if we have a selected exam OR if we have an exam param (even if not matched yet)
  if (selectedExam || (hasExamParam && initialExamId)) {
    // If we have a selected exam, show it immediately
    if (selectedExam) {
      return (
        <ExamQuestionDisplay
          exam={selectedExam}
          onBack={handleBackToExams}
          onExamUpdate={handleExamUpdate}
        />
      );
    }

    // If we have an exam param but no selected exam yet, show loading only if still loading
    if (loading) {
      // Questions-style skeleton while loading a deep-linked exam
      return (
        <div className="min-h-screen">
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
                <div key={i} className="p-4 rounded-md shadow-sm">
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

    // If param exists but no match after load, fall back to list view
    // This handles the case where exam ID in URL doesn't match any exam
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
