"use client";
import ImageWithZoom from "@/components/ImageWithZoom";
import { cn, getDynamicString } from "@/lib/utils";
import { IQuestion } from "@/types";
import Image from "next/image";

interface QuestionsListProps {
  questions: IQuestion[];
}

const QuestionsList = ({ questions }: QuestionsListProps) => {
  // const text = useTranslations("learn");
  console.log(questions);
  return (
    <div className="mt-8 space-y-6 sm:space-y-8">
      {questions.map((question, index) => (
        <div className="space-y-4 sm:space-y-6" key={question._id}>
          <h2 className="flex items-start gap-2 text-2xl font-semibold text-text-2">
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
            {question?.options.map((option: string, optionIndex: number) => (
              <>
                <div
                  key={optionIndex}
                  className={cn(
                    "flex focus:outline-none disabled:opacity-75 items-center mt-2 border p-4 w-full rounded-md gap-4",
                    {
                      "border-success":
                        question.correctOption === optionIndex + 1,
                      "border-destructive":
                        Number(question.wrongAnswer) === optionIndex + 1,
                    }
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 border border-foreground transition-all rounded-full",
                      {
                        "bg-success border-success":
                          question.correctOption === optionIndex + 1 &&
                          !question.wrongAnswer,
                        "bg-destructive border-destructive":
                          Number(question.wrongAnswer) === optionIndex + 1,
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
                </div>

                {/* Feedback message under the chosen option */}
                {/* {question.correctOption === optionIndex + 1 && (
                  <div className="mt-2 rounded-md border px-3 py-2 text-success bg-success/10 border-success/20">
                    <div className="flex items-center text-xl gap-2 font-semibold">
                      <span>
                        <CorrectIcon />
                      </span>
                      <span>{text("correctAnswer")}</span>
                    </div>
                    <p className="mt-1 text-lg">STATIC</p>
                  </div>
                )} */}
                {/* {Number(question.wrongAnswer) === optionIndex + 1 && (
                  <div className="mt-2 rounded-md border px-3 py-2 text-destructive bg-destructive/10 border-destructive/20">
                    <div className="flex items-center text-xl gap-2 font-semibold">
                      <span>
                        <InCorrectIcon />
                      </span>
                      <span>{text("incorrectAnswer")}</span>
                    </div>
                    <p className="mt-1 text-lg">STATIC</p>
                  </div>
                )} */}
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;
