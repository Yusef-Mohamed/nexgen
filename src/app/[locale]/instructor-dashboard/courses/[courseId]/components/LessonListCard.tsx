"use client";
import { useTranslations } from "next-intl";

const LessonListCard = () => {
  const text = useTranslations("courses");

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-8">{text("lesson_list")}</h2>
      <p>{text("lesson_list_description")}</p>
    </div>
  );
};

export default LessonListCard;
