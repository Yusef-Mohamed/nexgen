import { unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getMetadataInstructorCoursePage } from "@/getMetaData";
import CourseDetailClient from "./components/CourseDetailClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; courseId: string };
}): Promise<Metadata> {
  return getMetadataInstructorCoursePage({ params });
}

const CourseDetailPage = async ({
  params: { locale },
}: {
  params: { locale: string; courseId: string };
}) => {
  unstable_setRequestLocale(locale);

  return <CourseDetailClient />;
};

export default CourseDetailPage;
