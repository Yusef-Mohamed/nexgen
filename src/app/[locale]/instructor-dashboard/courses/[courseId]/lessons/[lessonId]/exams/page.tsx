import { use } from "react";
import { ExamsManager } from "@/app/[locale]/instructor-dashboard/courses/[courseId]/lessons/[lessonId]/exams/components/ExamsManager";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getMetadataInstructorLessonExamsPage } from "@/getMetaData";

interface LessonExamsPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
    locale: string;
  }>;
}

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string; courseId: string; lessonId: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataInstructorLessonExamsPage({ params });
}

export default function LessonExamsPage(props: LessonExamsPageProps) {
  const params = use(props.params);
  const text = useTranslations("exams");

  return (
    <ExamsManager
      type="lesson"
      parentId={params.lessonId}
      title={text("lesson_exams")}
      description={text("manage_lesson_exams")}
      backUrl={`/instructor-dashboard/courses/${params.courseId}`}
    />
  );
}
