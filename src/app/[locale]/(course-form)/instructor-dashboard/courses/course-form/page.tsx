import { unstable_setRequestLocale } from "next-intl/server";
import AddCourseClient from "./components/AddCourseClient";
import { Metadata } from "next";
import {
  getMetadataInstructorCreateCoursePage,
  getMetadataInstructorEditCoursePage,
} from "@/getMetaData";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { courseId?: string; mode?: string };
}): Promise<Metadata> {
  // Check if we're in edit mode (has courseId or mode is edit)
  const isEditMode = searchParams.courseId && searchParams.mode !== "create";

  if (isEditMode) {
    return getMetadataInstructorEditCoursePage({ params });
  } else {
    return getMetadataInstructorCreateCoursePage({ params });
  }
}

const AddCoursePage = async ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);
  return <AddCourseClient />;
};

export default AddCoursePage;
