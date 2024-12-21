import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import ImageWithZoom from "@/components/ImageWithZoom";
import { cn } from "@/lib/utils";
import { IQuestion, IUser } from "@/types";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";
import Image from "next/image";
const getData = async (lessonId: string, token: string, userId: string) => {
  try {
    const axiosInstance = await createServerAxiosInstance();
    const data = await axiosInstance.get(
      `/exams/getLessonPerformance/${userId}/${lessonId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};
const CourseExams = async ({
  params: { locale, lessonId },
}: {
  params: { locale: string; lessonId: string };
}) => {
  unstable_setRequestLocale(locale);
  const text = await getTranslations("learn");
  const cookie = cookies();
  const token = cookie.get("token")?.value || "";
  const myAccount = JSON.parse(cookie.get("user")?.value || "{}") as IUser;
  const data = (await getData(lessonId, token, myAccount._id)) as {
    data: {
      lessonQuestions: IQuestion[];
    };
  };
  const { lessonQuestions } = data.data;
  console.log(lessonQuestions);
  return (
    <main>
      <section className="py-16">
        <div className="container max-w-4xl mx-auto ">
          <h1 className="mb-2 text-4xl font-semibold">{text("examDetails")}</h1>
          <div className="mt-8 space-y-6 sm:space-y-8">
            {lessonQuestions.map((question, index) => (
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
                  {question?.options.map((option: string, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        "flex focus:outline-none disabled:opacity-75 items-center mt-2 border p-4 w-full rounded-md gap-4",
                        {
                          "border-primary":
                            question.correctOption === index + 1,
                          "border-destructive":
                            Number(question.wrongAnswer) === index + 1,
                        }
                      )}
                    >
                      <div
                        className={cn("w-4 h-4 transition-all rounded-full", {
                          "border border-foreground":
                            question.correctOption !== index + 1,
                          "bg-primary": question.correctOption === index + 1,
                        })}
                      />
                      {option.startsWith("http") ? (
                        <div className="relative h-32 aspect-video">
                          <Image src={option} alt="question" fill />
                        </div>
                      ) : (
                        <span className="text-text-2">{option}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseExams;
