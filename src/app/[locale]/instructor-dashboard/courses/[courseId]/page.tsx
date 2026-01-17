
import { Metadata } from "next";
import { getMetadataInstructorCoursePage } from "@/getMetaData";
import CourseDetailClient from "./components/CourseDetailClient";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string; courseId: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataInstructorCoursePage({ params });
}

const CourseDetailPage = async (
  props: {
    params: Promise<{ locale: string; courseId: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale
  } = params;

  

  return <CourseDetailClient />;
};

export default CourseDetailPage;
