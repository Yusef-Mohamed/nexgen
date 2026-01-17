import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import QuestionsList from "./components/QuestionsList";
import { IQuestion, IUser } from "@/types";

import { getTranslations} from "next-intl/server";
import { cookies } from "next/headers";
const getData = async (lessonId: string, token: string, userId: string) => {
  try {
    const axiosInstance = await createServerAxiosInstance();
    const data = await axiosInstance.get(
      `/exams/getLessonPerformance/${lessonId}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const CourseExams = async (
  props: {
    params: Promise<{ locale: string; lessonId: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale,
    lessonId
  } = params;

  
  const text = await getTranslations("learn");
  const cookie = await cookies();
  const token = cookie.get("token")?.value || "";
  const myAccount = JSON.parse(cookie.get("user")?.value || "{}") as IUser;
  const data = (await getData(lessonId, token, myAccount._id)) as {
    data: {
      lessonQuestions: IQuestion[];
    };
  };
  if (!data) {
    return null;
  }
  const { lessonQuestions } = data.data;
  return (
    <main className="bg-dash-ground">
      <section className="py-16">
        <div className="container max-w-4xl mx-auto">
          <h1 className="mb-2 text-4xl font-semibold">{text("examDetails")}</h1>
          <QuestionsList questions={lessonQuestions} />
        </div>
      </section>
    </main>
  );
};

export default CourseExams;
