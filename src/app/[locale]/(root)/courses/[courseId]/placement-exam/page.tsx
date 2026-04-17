import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";

import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICourse } from "@/types";
import QuizBody from "@/app/[locale]/(learn)/dashboard/learn/[courseId]/components/QuizBody";
import { getDynamicString } from "@/lib/utils";
export async function generateMetadata(props: {
  params: Promise<{ locale: string; courseId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
  const courseRes = await axiosInstance.get("/courses/" + params.courseId);
  const courseData = courseRes.data.data as ICourse;
  return getMetadataCoursePage({
    params,
    course: {
      title: getDynamicString(courseData.title),
      description: getDynamicString(courseData.description),
    },
  });
}

const CoursesPage = async (props: {
  params: Promise<{ locale: string; courseId: string }>;
}) => {
  const params = await props.params;

  return (
    <main className="dashboard">
      <section className="container secPadding">
        <div className="cardShadow bg-clear-ground rounded-xl lg:p-12 md:p-8 p-6">
          <QuizBody id={params.courseId} quizType="placement" />
        </div>
      </section>
    </main>
  );
};

export default CoursesPage;
