import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";

import { unstable_setRequestLocale } from "next-intl/server";
import {
  createServerAxiosInstance,
  getServerCookie,
} from "@/app/lib/serverUtils";
import { ICourse, ILesson, ISection } from "@/types";
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
): Promise<ISection[]> {
  const axiosInstance = createServerAxiosInstance();

  try {
    const sectionsRes = await axiosInstance.get(`/sections/${courseId}/course`);
    const sections = sectionsRes.data.data as ISection[];
    const sectionsWithLessons = await Promise.all(
      sections.map(async (section) => {
        try {
          const lessonsRes = await axiosInstance.get(
            `/lessons/sectionLessons/${courseId}/${section._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const lessons = lessonsRes.data.data as ILesson[];
          return {
            ...section,
            lessons,
          };
        } catch (e) {
          console.log(e);
          return {
            ...section,
            lessons: [],
          };
        }
      })
    );
    return sectionsWithLessons;
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
    const courseData = courseRes.data.data as ICourse;

    return (
      <main
        style={{
          minHeight: "calc(100vh - 76px)",
        }}
        className="flex flex-col px-2 py-6 lg:px-6 sm:px-4"
      >
        <Main sections={sections.reverse()} course={courseData} />
      </main>
    );
  } catch (e) {
    console.log(e);
    return notFound();
  }
};
export default CoursesPage;
