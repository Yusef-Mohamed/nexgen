import { use } from "react";
import { ExamsManager } from "@/app/[locale]/instructor-dashboard/courses/[courseId]/lessons/[lessonId]/exams/components/ExamsManager";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getMetadataInstructorFinalExamPage } from "@/getMetaData";

interface FinalExamPageProps {
  params: Promise<{
    courseId: string;
    locale: string;
  }>;
}

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string; courseId: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataInstructorFinalExamPage({ params });
}

export default function FinalExamPage(props: FinalExamPageProps) {
  const params = use(props.params);
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
