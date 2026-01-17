
import AddCourseClient from "./components/AddCourseClient";
import { Metadata } from "next";
import {
  getMetadataInstructorCreateCoursePage,
  getMetadataInstructorEditCoursePage,
} from "@/getMetaData";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ courseId?: string; mode?: string }>;
  }
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  // Check if we're in edit mode (has courseId or mode is edit)
  const isEditMode = searchParams.courseId && searchParams.mode !== "create";

  if (isEditMode) {
    return getMetadataInstructorEditCoursePage({ params });
  } else {
    return getMetadataInstructorCreateCoursePage({ params });
  }
}

const AddCoursePage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  
  return <AddCourseClient />;
};

export default AddCoursePage;
