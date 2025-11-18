import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import AddLearningPathClient from "./components/AddLearningPathClient";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  params: { locale: string };
  searchParams: { learningPathId?: string; mode?: string };
}): Promise<Metadata> {
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

const AddLearningPathPage = async ({
  params,
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(params.locale);

  return <AddLearningPathClient />;
};

export default AddLearningPathPage;
