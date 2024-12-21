"use client";

import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import ImageWithZoom from "@/components/ImageWithZoom";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { IExam } from "@/types";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const getQuiz = async () => {
      try {
        if (!token) return;
        const axiosInstance = await createClientAxiosInstance();
        const response = await axiosInstance.get(`/exams/${endpoint}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuiz(response.data.exam);
      } catch (error) {
        console.log(error);
      }
    };
    getQuiz();
  }, [endpoint, id, setQuiz, token, quizType]);
  const handleSubmit = async () => {
    // check all questions are answered
    const answeredQuestions = Object.keys(answers).length;
    if (!quiz || !quiz.questions || answeredQuestions < quiz.questions.length) {
      setError(text("please_answer_all_questions"));
      return;
    }
    setIsSubmitting(true);
    try {
      const axiosInstance = await createClientAxiosInstance();
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
      setIsSubmitting(false);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    setIsStarted(false);
    setAnswers({});
    setError("");
    setSubmitData({
      passed: false,
      totalScore: 0,
      score: 0,
    });
  }, [id]);
  return (
    <section className="py-16">
      <div className="container max-w-4xl mx-auto ">
        <h1 className="mb-2 text-4xl font-semibold">
          {title} - {text("quiz")}
        </h1>
        <h3 className="my-2 sm:my-4 text-text-3">
          {text(quizType + "_type")} | {quiz ? quiz.questions?.length : 0}{" "}
          {text("questions")}
        </h3>
        {submitData.totalScore ? (
          <p className="mt-6 text-lg text-text-1">
            {text(
              submitData.passed
                ? "congrats_you_passed_with_score"
                : "you_failed_with_score"
            )}{" "}
            {submitData.score} / {submitData.totalScore}
            <br />
            {quizType === "placement" && submitData.passed ? (
              <>{text("you_can_now_buy_the_course")}</>
            ) : (
              <>{text("your_are_not_fit_for_this_course")}</>
            )}
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
                  className="mt-2 sm:mt-4 "
                  size={"lg"}
                  isLoading={isLoading}
                >
                  {text("start")}
                </Button>
              </>
            )}
            {isStarted && quiz && (
              <div className="mt-8 space-y-6 sm:space-y-8">
                {quiz.questions.map((question, index) => (
                  <div className="space-y-4 sm:space-y-6" key={question._id}>
                    <h2 className="flex items-start gap-2 text-2xl font-semibold text-text-2">
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
                      {question?.options.map(
                        (option: string, index: number) => (
                          <button
                            disabled={isSubmitting}
                            key={index}
                            onClick={() => {
                              setError("");
                              setAnswers((prev: object) => {
                                return {
                                  ...prev,
                                  [question?._id]: index + 1,
                                };
                              });
                            }}
                            className={cn(
                              "flex focus:outline-none disabled:opacity-75 items-center mt-2 border p-4 w-full rounded-md gap-4",
                              {
                                "border-primary":
                                  answers[question?._id] === index + 1,
                              }
                            )}
                          >
                            <div
                              className={cn(
                                "w-4 h-4 transition-all rounded-full",
                                {
                                  "border border-foreground":
                                    answers[question?._id] !== index + 1,
                                  "bg-primary":
                                    answers[question?._id] === index + 1,
                                }
                              )}
                            />
                            {option.startsWith("http") ? (
                              <div className="relative h-32 aspect-video">
                                <Image src={option} alt="question" fill />
                              </div>
                            ) : (
                              <span className="text-text-2">{option}</span>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}

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
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
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
