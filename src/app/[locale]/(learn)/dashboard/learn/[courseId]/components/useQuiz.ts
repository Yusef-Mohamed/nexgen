"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "@/i18n/routing";
import { IExam, ILesson, IQuestion } from "@/types";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useCourseContext } from "../context/CourseContext";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { unlockLessonsSequentially } from "./unlockLessons";

export type QuizType = "lesson" | "course" | "placement";

export interface UseQuizParams {
  id: string;
  quizType: QuizType;
}

export const useQuiz = ({ id, quizType }: UseQuizParams) => {
  const [quiz, setQuiz] = useState<IExam | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState<string>("");
  const [fetchError, setFetchError] = useState<AxiosError<{
    message?: string;
  }> | null>(null);
  const [submitData, setSubmitData] = useState<{
    passed: boolean;
    totalScore: number;
    score: number;
  }>({
    passed: false,
    totalScore: 0,
    score: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackQuestions, setFeedbackQuestions] = useState<
    IQuestion[] | null
  >(null);

  const router = useRouter();
  const text = useTranslations("learn");
  const { token } = useAuth();
  const { sections, updateSections } = useCourseContext();
  const { setSearchParams } = useCustomSearchParams();

  const endpoint: "lesson" | "course" | "placement" = useMemo(() => {
    switch (quizType) {
      case "lesson":
        return "lesson";
      case "course":
        return "course";
      default:
        return "placement";
    }
  }, [quizType]);

  const getQuiz = useCallback(async () => {
    try {
      if (!token) return;
      setIsLoading(true);
      setFetchError(null);

      const response = await axiosInstance.get(`/exams/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuiz(response.data.exam);
      setFetchError(null);
    } catch (err) {
      const typedError = err as AxiosError<{ message?: string }>;
      setFetchError(typedError);
      setQuiz(null);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, id, token]);

  useEffect(() => {
    if (!id) return;
    getQuiz();
  }, [getQuiz, id]);

  const handleSubmit = useCallback(async () => {
    const answeredQuestions = Object.keys(answers).length;
    if (
      !quiz ||
      !Array.isArray(quiz.questions) ||
      answeredQuestions < quiz.questions.length
    ) {
      setError(text("please_answer_all_questions"));
      return;
    }
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.keys(answers).map((key) => ({
        questionId: key,
        answer: answers[key],
      }));
      const response = await axiosInstance.post(
        `/exams/${quizType}/${quiz?._id}/submit`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = response.data.data;
      setSubmitData(result);

      // Unlock lessons if quiz was passed successfully and it's a lesson quiz
      if (result.passed && quizType === "lesson" && sections && id) {
        const updatedSections = unlockLessonsSequentially(
          sections,
          id,
          false // checkForNoQuiz = false for quiz
        );

        // Mark passedExam as true for the current lesson
        for (const section of updatedSections) {
          const lesson = section.lessons.find((lesson) => lesson._id === id);
          if (lesson) {
            lesson.passedExam = true;
            break;
          }
        }

        updateSections(updatedSections);
      }

      router.refresh();
    } catch (err) {
      const typedError = err as AxiosError;
      toast.error(text("something_wrong"));
      setSubmitError(JSON.stringify(typedError.response?.data || "{}"));
    }
    setIsSubmitting(false);
    setIsLoading(false);
  }, [
    answers,
    quiz,
    quizType,
    router,
    text,
    token,
    id,
    sections,
    updateSections,
  ]);

  useEffect(() => {
    if (!id) return;
    setIsStarted(false);
    setAnswers({});
    setError("");
    setSubmitError("");
    setFetchError(null);
    setShowFeedback(false);
    setFeedbackQuestions(null);
    setSubmitData({ passed: false, totalScore: 0, score: 0 });
  }, [id]);

  const retakeQuiz = useCallback(async () => {
    await getQuiz();
    setIsStarted(false);
    setAnswers({});
    setError("");
    setSubmitError("");
    setShowFeedback(false);
    setFeedbackQuestions(null);
    setSubmitData({ passed: false, totalScore: 0, score: 0 });
  }, [getQuiz]);

  const findNextItem = useCallback((): {
    lessonId: string;
    display: string;
  } | null => {
    if (quizType === "course") {
      return null;
    }
    if (!sections || sections.length === 0) return null;

    const allLessons: ILesson[] = sections.flatMap((section) =>
      Array.isArray(section.lessons) ? section.lessons : []
    );
    const sortedLessons = [...allLessons].sort((a, b) => a.order - b.order);
    const currentLessonIndex = sortedLessons.findIndex(
      (lesson) => lesson._id === id
    );
    if (currentLessonIndex === -1) return null;

    const currentLesson = sortedLessons[currentLessonIndex];
    if (currentLesson.assignmentTitle || currentLesson.assignmentFile) {
      return { lessonId: currentLesson._id, display: "practice" };
    }

    for (let i = currentLessonIndex + 1; i < sortedLessons.length; i++) {
      const nextLesson = sortedLessons[i];
      if (nextLesson.videoUrl)
        return { lessonId: nextLesson._id, display: "lesson" };
      if (nextLesson.assignmentTitle || nextLesson.assignmentFile)
        return { lessonId: nextLesson._id, display: "practice" };
      if (nextLesson.hasQuiz)
        return { lessonId: nextLesson._id, display: "quiz" };
    }
    return null;
  }, [id, quizType, sections]);

  const handleGoNext = useCallback(() => {
    const nextItem = findNextItem();
    if (nextItem) {
      setSearchParams({ lesson: nextItem.lessonId, display: nextItem.display });
    } else {
      setSearchParams({});
      toast.info(text("completedAllContent"));
    }
  }, [findNextItem, setSearchParams, text]);

  const showStaticFeedback = useCallback(() => {
    const staticQuestions: IQuestion[] = [
      {
        _id: "q1",
        question: "What is Forex trading?",
        options: [
          "Buying and selling currencies",
          "Buying groceries",
          "Learning languages",
          "Playing games",
        ],
        correctOption: 1,
      },
      {
        _id: "q2",
        question: "Which is a currency pair?",
        options: ["EUR/USD", "Apple/Orange", "Car/Bike", "Dog/Cat"],
        correctOption: 1,
        wrongAnswer: 2,
      },
    ];
    setFeedbackQuestions(staticQuestions);
    setShowFeedback(true);
  }, []);

  return {
    // state
    quiz,
    isStarted,
    isLoading,
    answers,
    error,
    fetchError,
    submitData,
    isSubmitting,
    submitError,
    showFeedback,
    feedbackQuestions,

    // actions
    setIsStarted,
    setAnswers,
    setError,
    handleSubmit,
    handleGoNext,
    showStaticFeedback,
    retakeQuiz,
    getQuiz,
  };
};

export default useQuiz;
