"use client";

import QuestionsList from "@/app/[locale]/dashboard/learn/exams-history/[courseId]/[lessonId]/components/QuestionsList";
import ImageWithZoom from "@/components/ImageWithZoom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  failedExamMotivationalMessages,
  motivationalMessages,
} from "@/data/messages";
import { cn, getDynamicString } from "@/lib/utils";
import type { DynamicString } from "@/types";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowPath,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentCheck,
  HiOutlineExclamationTriangle,
  HiOutlineSparkles,
  HiOutlineTrophy,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import useQuiz, { QuizType } from "./useQuiz";

interface QuizBodyProps {
  id: string;
  quizType: string;
  contextTitle?: DynamicString;
}

const QuizBody: React.FC<QuizBodyProps> = ({ id, quizType, contextTitle }) => {
  const text = useTranslations("learn");
  const {
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
    hasSubmitted,
    feedbackQuestions,
    setIsStarted,
    setAnswers,
    setError,
    handleSubmit,
    handleGoNext,
    retakeQuiz,
    getQuiz,
    setShowFeedback,
  } = useQuiz({ id, quizType: quizType as QuizType });
  const { locale } = useParams();

  const quizTitle = useMemo(() => {
    const title = getDynamicString(quiz?.title);
    if (title) return title;

    const fallbackTitle = getDynamicString(contextTitle);
    if (fallbackTitle) {
      return quizType === "course"
        ? fallbackTitle + " — " + text("final_exam")
        : fallbackTitle + " — " + text("quiz");
    }

    return quizType === "course" ? text("final_exam") : text("lessonQuiz");
  }, [contextTitle, quiz?.title, quizType, text]);

  const motivationalMessage = useMemo(() => {
    if (!hasSubmitted) return null;

    const messages = submitData.passed
      ? motivationalMessages
      : failedExamMotivationalMessages;
    const seed = submitData.passed + "-" + submitData.totalScore;
    const hash = [...seed].reduce(
      (value, character) =>
        (Math.imul(31, value) + character.charCodeAt(0)) | 0,
      0,
    );

    return messages[Math.abs(hash) % messages.length];
  }, [hasSubmitted, submitData.passed, submitData.totalScore]);

  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
  const questionCount = questions.length;
  const answeredCount = Object.keys(answers).length;
  const answerProgress =
    questionCount > 0 ? Math.round((answeredCount / questionCount) * 100) : 0;
  const grade =
    submitData.totalScore > 0
      ? ((submitData.score / submitData.totalScore) * 100).toFixed(1)
      : "0.0";
  const motivationText =
    locale === "ar" ? motivationalMessage?.ar : motivationalMessage?.en;

  if (!quiz && isLoading) {
    return (
      <section className="space-y-5">
        <div className="rounded-3xl border border-primary/10 bg-clear-ground p-5 cardShadowSm sm:p-7">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-8 w-2/3 rounded-xl" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
          <Skeleton className="mt-6 h-12 w-40 rounded-full" />
        </div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="flex min-h-[30rem] items-center justify-center rounded-3xl border border-destructive/15 bg-clear-ground p-6 text-center cardShadowSm">
        <div className="max-w-md">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <HiOutlineExclamationTriangle className="size-7" />
          </span>
          <h1 className="mt-5 font-black text-text-1">
            {text("error_loading_quiz")}
          </h1>
          <p className="mt-2 leading-7 text-text-3">
            {fetchError.response?.data?.message ||
              fetchError.message ||
              text("quizLoadFallback")}
          </p>
          <Button
            type="button"
            onClick={getQuiz}
            disabled={isLoading}
            isLoading={isLoading}
            className="mt-6 rounded-full"
          >
            <HiOutlineArrowPath className="me-2 size-4" />
            {text("retry")}
          </Button>
        </div>
      </section>
    );
  }

  if (!quiz && !isLoading) {
    return (
      <section className="flex min-h-[24rem] items-center justify-center rounded-3xl border border-primary/10 bg-clear-ground p-6 text-center">
        <div>
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HiOutlineClipboardDocumentCheck className="size-7" />
          </span>
          <h1 className="mt-5 font-black text-text-1">
            {text("quiz_not_found")}
          </h1>
          <p className="mt-2 text-text-3">{text("quizNotFoundDescription")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-secondary/10 p-5 sm:p-7 lg:p-8">
        <div className="absolute start-6 end-6 top-0 h-1 rounded-b-full bg-secondary/70" />
        <div
          aria-hidden
          className="pointer-events-none absolute -end-24 -top-24 size-72 rounded-full bg-primary/15 blur-[100px]"
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-clear-ground/70 px-3 py-1.5 text-xs font-bold text-secondary backdrop-blur-sm">
              <HiOutlineSparkles className="size-4" />
              {text(quizType + "_type")}
            </div>
            <h1 className="mt-4 font-black text-text-1">{quizTitle}</h1>
            <p className="mt-3 leading-7 text-text-2">
              {text("quizInstructions")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[20rem]">
            <div className="rounded-2xl border border-secondary/15 bg-clear-ground/75 p-3 backdrop-blur-sm">
              <HiOutlineClipboardDocumentCheck className="size-5 text-secondary" />
              <p className="mt-2 text-xl font-black text-text-1">
                {questionCount}
              </p>
              <p className="text-xs font-bold text-text-3">
                {text("questions")}
              </p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-clear-ground/75 p-3 backdrop-blur-sm">
              <HiOutlineAcademicCap className="size-5 text-primary" />
              <p className="mt-2 text-xl font-black text-text-1">
                {quiz?.passingScore ?? 0}%
              </p>
              <p className="text-xs font-bold text-text-3">
                {text("passingScore")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {hasSubmitted ? (
        <div className="space-y-5">
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl border bg-clear-ground p-5 cardShadowSm sm:p-7 lg:p-8",
              submitData.passed ? "border-green/20" : "border-destructive/20",
            )}
          >
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute -end-24 -top-24 size-72 rounded-full blur-[100px]",
                submitData.passed ? "bg-fadedGreen" : "bg-destructive/10",
              )}
            />
            <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span
                  className={cn(
                    "inline-flex size-14 items-center justify-center rounded-2xl",
                    submitData.passed
                      ? "bg-fadedGreen text-green"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {submitData.passed ? (
                    <HiOutlineTrophy className="size-7" />
                  ) : (
                    <HiOutlineXCircle className="size-7" />
                  )}
                </span>
                <h2 className="mt-5 font-black text-text-1">
                  {submitData.passed
                    ? text("resultSuccessTitle")
                    : text("resultFailTitle")}
                </h2>
                <p className="mt-2 max-w-2xl leading-7 text-text-3">
                  {motivationText ||
                    (submitData.passed
                      ? text("resultSuccessDesc")
                      : text("resultFailDesc"))}
                </p>
              </div>

              <div className="min-w-[11rem] rounded-2xl border border-primary/10 bg-background-2 p-5 text-center">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-text-3">
                  {text("yourGrade")}
                </p>
                <p
                  className={cn(
                    "mt-2 text-4xl font-black",
                    submitData.passed ? "text-green" : "text-destructive",
                  )}
                >
                  {grade}%
                </p>
                <p className="mt-2 text-xs font-bold text-text-3">
                  {text("toPassOrHigher", {
                    score: quiz?.passingScore ?? 0,
                  })}
                </p>
              </div>
            </div>

            <div className="relative mt-7 flex flex-col gap-3 border-t border-primary/10 pt-5 sm:flex-row">
              {submitData.passed ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (showFeedback) handleGoNext();
                    else setShowFeedback(true);
                  }}
                  className="group rounded-full"
                >
                  {showFeedback ? text("next") : text("viewFeedback")}
                  <HiOutlineArrowRight className="ms-2 size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primaryOutline"
                  onClick={retakeQuiz}
                  className="rounded-full bg-clear-ground"
                >
                  <HiOutlineArrowPath className="me-2 size-4" />
                  {text("retake")}
                </Button>
              )}
            </div>
          </div>

          {showFeedback && (
            <div className="rounded-3xl border border-primary/10 bg-clear-ground p-4 cardShadowSm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HiOutlineCheckCircle className="size-5" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">
                    {text("reviewAnswers")}
                  </p>
                  <h2 className="mt-1 font-black text-text-1">
                    {text("viewFeedback")}
                  </h2>
                </div>
              </div>
              <QuestionsList questions={feedbackQuestions || []} />
            </div>
          )}
        </div>
      ) : !isStarted ? (
        <div className="rounded-3xl border border-primary/10 bg-clear-ground p-5 cardShadowSm sm:p-7">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HiOutlineClipboardDocumentCheck className="size-8" />
            </span>
            <div>
              <h2 className="font-black text-text-1">
                {text("beforeYouStart")}
              </h2>
              <p className="mt-2 max-w-2xl leading-7 text-text-3">
                {text("answerEveryQuestion")}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-primary/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-text-2">
              {text("toPassExamYouNeedMoreThan")} {quiz?.passingScore ?? 0}%
            </p>
            <Button
              type="button"
              onClick={() => setIsStarted(true)}
              disabled={isLoading || questionCount === 0}
              size="lg"
              className="rounded-full"
              isLoading={isLoading}
            >
              {text("start")}
              <HiOutlineArrowRight className="ms-2 size-4 rtl:rotate-180" />
            </Button>
          </div>

          {questionCount === 0 && (
            <p className="mt-4 rounded-xl border border-destructive/15 bg-destructive/10 p-3 text-sm font-bold text-destructive">
              {text("quizEmpty")}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="sticky top-[84px] z-20 rounded-2xl border border-primary/15 bg-clear-ground/95 p-4 cardShadowSm backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-text-1">
                  {text("questionProgress", {
                    current: answeredCount,
                    total: questionCount,
                  })}
                </p>
                <p className="mt-1 text-xs text-text-3">
                  {text("answerEveryQuestion")}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-black text-primary">
                {answerProgress}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: answerProgress + "%" }}
              />
            </div>
          </div>

          {questions.map((question, index) => (
            <article
              className="rounded-3xl border border-primary/10 bg-clear-ground p-4 cardShadowSm sm:p-6"
              key={question._id}
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                  {index + 1}
                </span>
                <h2 className="pt-1 font-black leading-7 text-text-1">
                  {getDynamicString(question.question)}
                </h2>
              </div>

              {question.questionImage && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-primary/10 bg-background-2 p-2">
                  <ImageWithZoom
                    width={960}
                    height={640}
                    src={question.questionImage}
                    alt={text("question") + " " + (index + 1)}
                    className="max-h-[28rem] w-full rounded-xl object-contain"
                  />
                </div>
              )}

              <div className="mt-5 grid gap-3">
                {Array.isArray(question.options) &&
                  question.options.map((option, optionIndex) => {
                    if (typeof option !== "string") return null;
                    const isSelected =
                      answers[question._id] === optionIndex + 1;

                    return (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        key={optionIndex}
                        aria-pressed={isSelected}
                        onClick={() => {
                          setError("");
                          setAnswers((previous) => ({
                            ...previous,
                            [question._id]: optionIndex + 1,
                          }));
                        }}
                        className={cn(
                          "group flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-start transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-70 sm:p-4",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-primary/10 bg-background-2 hover:border-primary/30 hover:bg-primary/5",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex size-8 shrink-0 items-center justify-center rounded-xl border text-xs font-black transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-primary/15 bg-clear-ground text-text-3 group-hover:text-primary",
                          )}
                        >
                          {optionIndex + 1}
                        </span>

                        {option.startsWith("http") ? (
                          <span className="relative block aspect-video h-28 overflow-hidden rounded-xl border border-primary/10 bg-clear-ground sm:h-36">
                            <Image
                              src={option}
                              alt={
                                text("answerOption") + " " + (optionIndex + 1)
                              }
                              fill
                              sizes="(max-width: 640px) 50vw, 320px"
                              className="object-contain"
                            />
                          </span>
                        ) : (
                          <span className="min-w-0 flex-1 break-words text-sm font-medium leading-6 text-text-2 sm:text-base">
                            {getDynamicString(option)}
                          </span>
                        )}

                        {isSelected && (
                          <HiOutlineCheckCircle className="ms-auto size-5 shrink-0 text-primary" />
                        )}
                      </button>
                    );
                  })}
              </div>
            </article>
          ))}

          {error && (
            <div
              role="alert"
              className="flex items-center justify-center gap-2 rounded-2xl border border-destructive/15 bg-destructive/10 p-4 text-center font-bold text-destructive"
            >
              <HiOutlineExclamationTriangle className="size-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-primary/15 bg-clear-ground/95 p-3 cardShadow backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <p className="text-sm font-bold text-text-3">
              {text("answeredCount", {
                answered: answeredCount,
                total: questionCount,
              })}
            </p>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="rounded-full"
            >
              {text("submitAnswers")}
            </Button>
          </div>
        </div>
      )}

      {submitError && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-center">
          <p className="font-semibold text-destructive">
            {text(
              "there_is_error_please_click_the_button_below_to_copy_the_error_and_send_it_to_support",
            )}
          </p>
          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(submitError);
              toast.success(text("copied"));
            }}
            className="rounded-full"
          >
            {text("copy_error")}
          </Button>
        </div>
      )}
    </section>
  );
};

export default QuizBody;
