"use client";

import ImageWithZoom from "@/components/ImageWithZoom";
import { cn, getDynamicString } from "@/lib/utils";
import { IQuestion } from "@/types";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface QuestionsListProps {
  questions: IQuestion[];
}

const QuestionsList = ({ questions }: QuestionsListProps) => {
  const text = useTranslations("learn");

  return (
    <div className="space-y-4 sm:space-y-5">
      {questions.map((question, index) => (
        <article
          className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm"
          key={question._id}
        >
          <div className="border-b border-primary/10 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-sm font-black text-primary">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-wide text-text-3">
                  {text("question")}
                </p>
                <h2 className="mt-1 text-base font-black leading-7 text-text-1 sm:text-lg">
                  {getDynamicString(question.question)}
                </h2>
              </div>
            </div>

            {question.questionImage && (
              <ImageWithZoom
                width={720}
                height={420}
                src={question.questionImage}
                alt=""
                className="mt-4 h-48 w-full rounded-2xl border border-primary/10 bg-background-2 object-contain sm:h-64"
              />
            )}
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            {question.options.map((option: string, optionIndex: number) => {
              const optionNumber = optionIndex + 1;
              const isCorrect = question.correctOption === optionNumber;
              const isWrongSelection =
                Number(question.wrongAnswer) === optionNumber;

              return (
                <div
                  key={`${question._id}-${optionIndex}`}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border bg-background-2 p-3 text-sm font-semibold text-text-2 transition-colors sm:p-4",
                    isCorrect && "border-success/40 bg-success/10 text-success",
                    isWrongSelection &&
                      "border-destructive/40 bg-destructive/10 text-destructive",
                    !isCorrect && !isWrongSelection && "border-primary/10",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-clear-ground text-text-3",
                      isCorrect &&
                        "border-success/30 bg-success/15 text-success",
                      isWrongSelection &&
                        "border-destructive/30 bg-destructive/15 text-destructive",
                    )}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="size-4" />
                    ) : isWrongSelection ? (
                      <XCircle className="size-4" />
                    ) : (
                      <HelpCircle className="size-4" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    {option.startsWith("http") ? (
                      <div className="relative h-32 w-full max-w-sm overflow-hidden rounded-xl border border-primary/10 bg-clear-ground">
                        <Image
                          src={option}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 384px, 100vw"
                          className="object-contain p-2"
                        />
                      </div>
                    ) : (
                      <span className="break-words leading-6">{option}</span>
                    )}

                    {(isCorrect || isWrongSelection) && (
                      <p className="mt-1 text-xs font-black uppercase tracking-wide">
                        {isCorrect
                          ? text("correctAnswer")
                          : text("incorrectAnswer")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
};

export default QuestionsList;
