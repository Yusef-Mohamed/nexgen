"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import ImageWithZoom from "@/components/ImageWithZoom";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { IExam } from "@/types";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface QuizBodyProps {
  id: string;
  quizType: string;
  title: string;
}
const QuizBody: React.FC<QuizBodyProps> = ({ id, quizType, title }) => {
  const [quiz, setQuiz] = useState<IExam | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string>("");
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
  const router = useRouter();
  const text = useTranslations("learn");
  const { token } = useAuth();
  const [submitError, setSubmitError] = useState("");
  let endpoint = "";
  switch (quizType) {
    case "lesson":
      endpoint = "lesson";
      break;
    case "course":
      endpoint = "course";
      break;

    default:
      endpoint = "placement";
  }
  const getQuiz = useCallback(async () => {
    try {
      if (!token) return;
      setIsLoading(true);

      const response = await axiosInstance.get(`/exams/${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuiz(response.data.exam);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [endpoint, id, token]);
  useEffect(() => {
    if (!id) return;
    getQuiz();
  }, [getQuiz, id]);
  const handleSubmit = async () => {
    // check all questions are answered
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
      const formattedAnswers = Object.keys(answers).map((key) => {
        return {
          questionId: key,
          answer: answers[key],
        };
      });
      const response = await axiosInstance.post(
        `/exams/${quizType}/${quiz?._id}/submit`,
        {
          answers: formattedAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmitData(response.data.data);

      router.refresh();
    } catch (error) {
      const typedError = error as AxiosError;
      toast.error(text("something_wrong"));
      setSubmitError(JSON.stringify(typedError.response?.data || "{}"));
    }
    setIsSubmitting(false);
    setIsLoading(false);
  };
  useEffect(() => {
    if (!id) return;

    // Reset all states in a controlled manner
    setIsStarted(false);
    setAnswers({});
    setError("");
    setSubmitError("");
    setSubmitData({
      passed: false,
      totalScore: 0,
      score: 0,
    });
  }, [id]);

  // Add early return if quiz data is not ready
  if (!quiz && isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-4xl">
          <p>{text("loading")}</p>
        </div>
      </section>
    );
  }

  if (!quiz && !isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-4xl">
          <p>{text("quiz_not_found")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-2 text-4xl font-semibold">
          {title} - {text("quiz")}
        </h1>
        <h3 className="my-2 sm:my-4 text-text-3">
          {text(quizType + "_type")} | {quiz ? quiz.questions?.length : 0}{" "}
          {text("questions")}
        </h3>
        {submitData.totalScore ? (
          <p className="mt-6 text-lg text-text-1">
            {submitData.passed ? (
              <>
                {quizType === "placement" && text("placementPassed")}
                {quizType === "lesson" && text("quizPassed")}
                {quizType === "course" && text("coursePassed")}
              </>
            ) : (
              <>
                {quizType === "placement" && text("placementFailed")}
                {quizType === "lesson" && text("quizFailed")}
                {quizType === "course" && text("courseFailed")}
              </>
            )}
            <br />
            {text("yourScoreIs")} : {submitData.score} / {submitData.totalScore}
            {!submitData.passed ? (
              <>
                <Button
                  className="mt-2 sm:mt-4"
                  size={"lg"}
                  isLoading={isLoading}
                  onClick={async () => {
                    await getQuiz();
                    setIsStarted(false);
                    setAnswers({});
                    setSubmitData({
                      passed: false,
                      totalScore: 0,
                      score: 0,
                    });
                  }}
                >
                  {text("retake")}
                </Button>
              </>
            ) : null}
          </p>
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
                          <span>{index + 1}. </span> <p>{question?.question}</p>
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
                                        {option}
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
