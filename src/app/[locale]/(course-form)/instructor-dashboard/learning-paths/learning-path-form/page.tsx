import { getTranslations } from "next-intl/server";
import AddLearningPathClient from "./components/AddLearningPathClient";
import { Metadata } from "next";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ learningPathId?: string; mode?: string }>;
  }
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const t = await getTranslations("learningPathForm");

  // Check if we're in edit mode (has learningPathId or mode is edit)
  const isEditMode =
    searchParams.learningPathId && searchParams.mode !== "create";

  return {
    title: isEditMode ? t("edit_learning_path") : t("add_new_learning_path"),
    description: isEditMode
      ? t("edit_learning_path_description")
      : t("add_learning_path_description"),
  };
}

const AddLearningPathPage = async (
  props: {
    params: Promise<{ locale: string }>;
  }
) => {
  const params = await props.params;
  

  return <AddLearningPathClient />;
};

export default AddLearningPathPage;
