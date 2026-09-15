"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { HiOutlineQueueList } from "react-icons/hi2";
import SectionBlock from "@/components/SectionBlock";
import { PublicCurriculum } from "@/components/public-curriculum";

export default function CourseContent() {
  const text = useTranslations("coursePage");
  const { courseId } = useParams();
  const identifier = Array.isArray(courseId) ? courseId[0] : courseId;
  return (
    <SectionBlock tone="primary" title={text("courseContent")} icon={<HiOutlineQueueList className="size-5" />}>
      {identifier ? <PublicCurriculum key={identifier} courseId={identifier} /> : null}
    </SectionBlock>
  );
}
