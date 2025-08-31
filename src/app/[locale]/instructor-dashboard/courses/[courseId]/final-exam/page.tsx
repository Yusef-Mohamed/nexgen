import { ExamsManager } from "@/app/[locale]/instructor-dashboard/courses/[courseId]/lessons/[lessonId]/exams/components/ExamsManager";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getMetadataInstructorFinalExamPage } from "@/getMetaData";

interface FinalExamPageProps {
  params: {
    courseId: string;
    locale: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; courseId: string };
}): Promise<Metadata> {
  return getMetadataInstructorFinalExamPage({ params });
}

export default function FinalExamPage({ params }: FinalExamPageProps) {
  const text = useTranslations("exams");

  return (
    <ExamsManager
      type="course"
      parentId={params.courseId}
      title={text("final_exam")}
      description={text("manage_final_exam")}
      backUrl={`/instructor-dashboard/courses/${params.courseId}`}
    />
  );
}
