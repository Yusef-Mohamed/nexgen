import { ExamsManager } from "@/app/[locale]/instructor-dashboard/courses/[courseId]/lessons/[lessonId]/exams/components/ExamsManager";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getMetadataInstructorLessonExamsPage } from "@/getMetaData";

interface LessonExamsPageProps {
  params: {
    courseId: string;
    lessonId: string;
    locale: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; courseId: string; lessonId: string };
}): Promise<Metadata> {
  return getMetadataInstructorLessonExamsPage({ params });
}

export default function LessonExamsPage({ params }: LessonExamsPageProps) {
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
