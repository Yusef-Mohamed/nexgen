"use client";

import ImageWithZoom from "@/components/ImageWithZoom";
import { Button } from "@/components/ui/button";
import { cn, getDynamicString } from "@/lib/utils";
import QuestionsList from "@/app/[locale]/dashboard/learn/exams-history/[courseId]/[lessonId]/components/QuestionsList";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CorrectIcon, InCorrectIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import useQuiz, { QuizType } from "./useQuiz";
import { toast } from "react-toastify";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  failedExamMotivationalMessages,
  motivationalMessages,
} from "@/data/messages";

interface QuizBodyProps {
  id: string;
  quizType: string;
}
const QuizBody: React.FC<QuizBodyProps> = ({ id, quizType }) => {
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

  const motivationalMessage = useMemo(() => {
    if (!submitData.totalScore) return null;
    const messages = submitData.passed
      ? motivationalMessages
      : failedExamMotivationalMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  }, [submitData.passed, submitData.totalScore]);
  // Add early return if quiz data is not ready
  if (!quiz && isLoading) {
    return (
      <section>
        <div>
          {/* Title skeleton */}
          <Skeleton className="mb-2 h-10 w-64" />

          {/* Subtitle skeleton */}
          <div className="my-2 sm:my-4 flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Content skeleton - passing score and button */}
          <div className="mt-8 space-y-4">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="py-16">
        <div className="flex flex-col gap-4 justify-center items-center">
          <p className="font-semibold text-destructive text-lg">
            {fetchError.response?.data?.message ||
              fetchError.message ||
              text("error_loading_quiz")}
          </p>
          <Button
            onClick={() => {
              getQuiz();
            }}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {text("retry")}
          </Button>
        </div>
      </section>
    );
  }

  if (!quiz && !isLoading) {
    return (
      <section className="py-16">
        <div>
          <p>{text("quiz_not_found")}</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        <h1 className="mb-2 text-4xl font-semibold">
          {getDynamicString(quiz?.title) || "QUIZ STATIC TITLE"}
        </h1>
        <h3 className="my-2 sm:my-4 text-text-3">
          {text(quizType + "_type")} | {quiz ? quiz.questions?.length : 0}{" "}
          {text("questions")}
        </h3>
        {submitData.totalScore ? (
          <div>
            {/* Header row */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {" "}
                  <span
                    className={cn(
                      submitData.passed ? "text-success" : "text-destructive"
                    )}
                  >
                    {submitData.passed ? <CorrectIcon /> : <InCorrectIcon />}
                  </span>
                  <span className="text-xl font-medium">
                    {text("receiveGrade")}
                  </span>
                </div>
                <p className="text-lg font-medium">
                  {text("toPassOrHigher", { score: quiz?.passingScore ?? 0 })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xl font-medium">{text("yourGrade")}</p>
                  <p
                    className={cn(
                      "text-2xl font-semibold",
                      submitData.passed ? "text-success" : "text-destructive"
                    )}
                  >
                    {((submitData.score / submitData.totalScore) * 100).toFixed(
                      1
                    )}
                    %
                  </p>
                </div>
                {submitData.passed && (
                  <Button
                    variant="default"
                    onClick={() => {
                      if (showFeedback) handleGoNext();
                      else setShowFeedback(true);
                    }}
                  >
                    {showFeedback ? text("next") : text("viewFeedback")}
                  </Button>
                )}
              </div>
            </div>

            {/* Illustration placeholder */}

            {showFeedback ? (
              <div className="mt-8">
                <QuestionsList questions={feedbackQuestions || []} />
              </div>
            ) : submitData.passed ? (
              <>
                <div className="flex justify-center py-8">
                  <div className="text-6xl select-none">👍</div>
                </div>
                <p
                  className="cardShadowSecondary w-fit mx-auto
                 p-4 rounded-md font-semibold text-center text-xl"
                >
                  {locale === "ar"
                    ? motivationalMessage?.ar
                    : motivationalMessage?.en}
                </p>
                <p className="mt-3 text-text-3 text-center">
                  {text("resultSuccessTitle")}
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center py-8">
                  <div className="text-6xl select-none">📈</div>
                </div>
                <p
                  className="cardShadowSecondary w-fit mx-auto
                 p-4 rounded-md font-semibold text-center text-xl"
                >
                  {locale === "ar"
                    ? motivationalMessage?.ar
                    : motivationalMessage?.en}
                </p>
                <p className="mt-3 text-text-3 text-center">
                  {text("resultFailTitle")}
                </p>
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await retakeQuiz();
                    }}
                  >
                    {text("retake")}
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {!isStarted && (
              <>
                <p className="text-text-3">
                  {text("toPassExamYouNeedMoreThan")} {quiz?.passingScore}%
                </p>
                <Button
                  onClick={() => {
                    setIsStarted(true);
                  }}
                  disabled={isLoading}
                  className="mt-2 sm:mt-4"
                  size={"lg"}
                  isLoading={isLoading}
                >
                  {text("start")}
                </Button>
              </>
            )}
            {isStarted && quiz && (
              <div className="mt-8 space-y-6 sm:space-y-8">
                {Array.isArray(quiz.questions) &&
                  quiz.questions.map((question, index) => {
                    if (!question) {
                      return null;
                    }
                    return (
                      <div
                        className="space-y-4 sm:space-y-6"
                        key={question._id}
                      >
                        <h2 className="flex gap-2 items-start text-2xl font-semibold text-text-2">
                          <span>{index + 1}. </span>{" "}
                          <p>{getDynamicString(question?.question)}</p>
                        </h2>
                        {question?.questionImage && (
                          <ImageWithZoom
                            width={600}
                            height={600}
                            src={question?.questionImage || ""}
                            alt=""
                            className="object-contain w-auto h-40 rounded-md"
                          />
                        )}
                        <div className="mt-4">
                          {Array.isArray(question.options) &&
                            question.options.map(
                              (option: string, optionIndex: number) => {
                                if (typeof option !== "string") {
                                  return null;
                                }
                                return (
                                  <button
                                    disabled={isSubmitting}
                                    key={optionIndex}
                                    onClick={() => {
                                      setError("");
                                      setAnswers((prev: object) => {
                                        return {
                                          ...prev,
                                          [question._id]: optionIndex + 1,
                                        };
                                      });
                                    }}
                                    className={cn(
                                      "flex focus:outline-none disabled:opacity-75 items-center mt-2 border p-4 w-full rounded-md gap-4",
                                      {
                                        "border-primary":
                                          answers[question._id] ===
                                          optionIndex + 1,
                                      }
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "w-4 h-4 transition-all rounded-full",
                                        {
                                          "border border-foreground":
                                            answers[question._id] !==
                                            optionIndex + 1,
                                          "bg-primary":
                                            answers[question._id] ===
                                            optionIndex + 1,
                                        }
                                      )}
                                    />
                                    {option.startsWith("http") ? (
                                      <div className="relative h-32 aspect-video">
                                        <Image
                                          src={option}
                                          alt="question"
                                          fill
                                        />
                                      </div>
                                    ) : (
                                      <span className="text-text-2">
                                        {getDynamicString(option)}
                                      </span>
                                    )}
                                  </button>
                                );
                              }
                            )}
                        </div>
                      </div>
                    );
                  })}

                {error && (
                  <p className="mt-8 font-semibold text-center text-red-500">
                    {error}
                  </p>
                )}
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={isSubmitting}
                  >
                    {text("submit")}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {submitError && (
          <div className="flex flex-col gap-4 justify-center items-center mt-4">
            <p className="font-semibold text-destructive">
              {text(
                "there_is_error_please_click_the_button_below_to_copy_the_error_and_send_it_to_support"
              )}
            </p>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(submitError);
                toast.success(text("copied"));
              }}
            >
              {text("copy_error")}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizBody;
