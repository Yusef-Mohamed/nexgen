import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";

import { unstable_setRequestLocale } from "next-intl/server";
import {
  createServerAxiosInstance,
  getServerCookie,
} from "@/app/lib/serverUtils";
import { ICourse, ILesson } from "@/types";
import { notFound } from "next/navigation";
import Main from "./compoents/Main";

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
async function getSections(
  courseId: string,
  token: string
): Promise<
  {
    section: string;
    lessons: ILesson[];
  }[]
> {
  const axiosInstance = createServerAxiosInstance();

  try {
    const sectionsRes = await axiosInstance.get(
      `/lessons/sectionLessons/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return sectionsRes.data.data;
  } catch (error) {
    console.error("Error fetching sections or lessons:", error);
    return [];
  }
}
const CoursesPage = async ({
  params,
}: {
  params: { locale: string; courseId: string };
}) => {
  unstable_setRequestLocale(params.locale);
  try {
    const token = getServerCookie("token");
    const sections = await getSections(params.courseId, token);
    const courseRes = await createServerAxiosInstance().get(
      "/courses/" + params.courseId
    );
    console.log(sections[0].lessons);
    const courseData = courseRes.data.data as ICourse;
    return (
      <main
        style={{
          minHeight: "calc(100vh - 76px)",
        }}
        className="flex flex-col px-2 py-6 lg:px-6 sm:px-4"
      >
        <Main sections={sections} course={courseData} />
      </main>
    );
  } catch (e) {
    console.log(e);
    return notFound();
  }
};
export default CoursesPage;
