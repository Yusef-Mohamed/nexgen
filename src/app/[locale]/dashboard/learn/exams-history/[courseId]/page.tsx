import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";

import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICourse } from "@/types";
import { getDynamicString } from "@/lib/utils";
import ExamsHistoryClient from "./components/ExamsHistoryClient";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string; courseId: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const axiosInstance = await createServerAxiosInstance();
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

const CoursesPage = async (
  props: {
    params: Promise<{ locale: string; courseId: string }>;
  }
) => {
  const params = await props.params;
  
  return <ExamsHistoryClient courseId={params.courseId} />;
};

export default CoursesPage;
