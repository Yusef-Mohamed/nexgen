import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import QuestionsList from "./components/QuestionsList";
import { IQuestion, IUser } from "@/types";

import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import DashboardContainer from "../../../../components/DashboardContainer";
import { ClipboardList } from "lucide-react";

const getData = async (
  lessonId: string,
  token: string,
  userId: string,
  locale: string,
) => {
  try {
    const axiosInstance = await createServerAxiosInstance({
      overRideLocale: locale,
    });
    const data = await axiosInstance.get(
      `/exams/getLessonPerformance/${lessonId}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const CourseExams = async (props: {
  params: Promise<{ locale: string; lessonId: string }>;
}) => {
  const params = await props.params;

  const { locale, lessonId } = params;

  const text = await getTranslations("learn");
  const cookie = await cookies();
  const token = cookie.get("token")?.value || "";
  const myAccount = JSON.parse(cookie.get("user")?.value || "{}") as IUser;
  const data = (await getData(lessonId, token, myAccount._id, locale)) as {
    data: {
      lessonQuestions: IQuestion[];
    };
  } | null;

  if (!data) {
    return (
      <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
        <DashboardContainer>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm font-bold text-destructive">
            {text("failedToLoadExams")}
          </div>
        </DashboardContainer>
      </main>
    );
  }

  const { lessonQuestions } = data.data;

  return (
    <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
      <DashboardContainer className="space-y-5">
        <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm sm:p-6">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(var(--primary)/0.08)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative flex min-w-0 items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
              <ClipboardList className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-text-1 sm:text-xl">
                {text("examDetails")}
              </h1>
              <p className="mt-1 text-sm leading-6 text-text-3">
                {text("questions")}: {lessonQuestions.length}
              </p>
            </div>
          </div>
        </section>

        <QuestionsList questions={lessonQuestions} />
      </DashboardContainer>
    </main>
  );
};

export default CourseExams;
