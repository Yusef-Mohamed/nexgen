import { unstable_setRequestLocale } from "next-intl/server";
import AddCourseClient from "./components/AddCourseClient";

const AddCoursePage = async ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);

  return <AddCourseClient />;
};

export default AddCoursePage;
