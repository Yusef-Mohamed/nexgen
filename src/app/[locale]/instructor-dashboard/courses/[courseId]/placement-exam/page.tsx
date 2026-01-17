import { use } from "react";
import { ExamsManager } from "@/app/[locale]/instructor-dashboard/courses/[courseId]/lessons/[lessonId]/exams/components/ExamsManager";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getMetadataInstructorPlacementExamPage } from "@/getMetaData";

interface PlacementExamPageProps {
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
  return getMetadataInstructorPlacementExamPage({ params });
}

export default function PlacementExamPage(props: PlacementExamPageProps) {
  const params = use(props.params);
  const text = useTranslations("exams");

  return (
    <ExamsManager
      type="placement"
      parentId={params.courseId}
      title={text("placement_exam")}
      description={text("manage_placement_exam")}
      backUrl={`/instructor-dashboard/courses/${params.courseId}`}
    />
  );
}
