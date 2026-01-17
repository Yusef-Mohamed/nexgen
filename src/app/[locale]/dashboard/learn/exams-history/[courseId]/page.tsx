import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICourse } from "@/types";
import { getDynamicString } from "@/lib/utils";
import ExamsHistoryClient from "./components/ExamsHistoryClient";

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
    course: {
      title: getDynamicString(courseData.title),
      description: getDynamicString(courseData.description),
    },
  });
}

const CoursesPage = ({
  params,
}: {
  params: { locale: string; courseId: string };
}) => {
  unstable_setRequestLocale(params.locale);
  return <ExamsHistoryClient courseId={params.courseId} />;
};

export default CoursesPage;
