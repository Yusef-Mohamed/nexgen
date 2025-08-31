import { ExamsManager } from "@/app/[locale]/instructor-dashboard/courses/[courseId]/lessons/[lessonId]/exams/components/ExamsManager";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getMetadataInstructorPlacementExamPage } from "@/getMetaData";

interface PlacementExamPageProps {
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
  return getMetadataInstructorPlacementExamPage({ params });
}

export default function PlacementExamPage({ params }: PlacementExamPageProps) {
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
