import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";

import { unstable_setRequestLocale } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICourse } from "@/types";
import { notFound } from "next/navigation";
import QuizBody from "@/app/[locale]/(learn)/dashboard/learn/[courseId]/components/QuizBody";
export async function generateMetadata({
  params,
}: {
  params: { locale: string; courseId: string };
}): Promise<Metadata> {
  const axiosInstance = createServerAxiosInstance();
  const courseRes = await axiosInstance.get("/courses/" + params.courseId);
  const courseData = courseRes.data.data as ICourse;
  return getMetadataCoursePage({
    params,
    course: courseData,
  });
}

const CoursesPage = async ({
  params,
}: {
  params: { locale: string; courseId: string };
}) => {
  unstable_setRequestLocale(params.locale);
  try {
    return (
      <main className="dashboard">
        <section className="container secPadding">
          <div className="cardShadow bg-clear-ground rounded-xl lg:p-12 md:p-8 p-6">
            <QuizBody id={params.courseId} quizType="placement" />
          </div>
        </section>
      </main>
    );
  } catch (e) {
    console.log(e);
    return notFound();
  }
};

export default CoursesPage;
