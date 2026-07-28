import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import {
  AnalyticsCertificate,
  useAnalyticsStore,
} from "@/stores/AnalyticsStore";
import { Card, CardContent } from "@/components/ui/card";

const getCertificateFile = (certificate?: AnalyticsCertificate) => {
  if (!certificate || typeof certificate.file !== "string") return null;

  const file = certificate.file.trim();
  const normalizedFile = file.toLowerCase();
  const eligibilityFlags = [
    certificate.isdeserve,
    certificate.istake,
    certificate.isDeserve,
    certificate.isTake,
  ].filter((flag): flag is boolean => typeof flag === "boolean");
  const isExplicitlyUnavailable =
    eligibilityFlags.length > 0 && eligibilityFlags.every((flag) => !flag);

  if (
    !file ||
    normalizedFile === "null" ||
    normalizedFile === "undefined" ||
    isExplicitlyUnavailable
  ) {
    return null;
  }

  return file;
};

const CertificateCard = () => {
  const text = useTranslations("certificate");
  const { courseProgress, isCourseProgressLoading, selectedCourseObject } =
    useAnalyticsStore();
  const certificateFile = getCertificateFile(courseProgress?.certificate);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || !selectedCourseObject) {
      return;
    }

    console.debug("[Analytics] Selected course certificate source", {
      course: {
        _id: selectedCourseObject._id,
        title: selectedCourseObject.title,
        slug: selectedCourseObject.slug,
        type: selectedCourseObject.type,
        status: selectedCourseObject.status,
      },
      certificate: courseProgress?.certificate ?? null,
    });
  }, [courseProgress?.certificate, selectedCourseObject]);

  if (isCourseProgressLoading || !certificateFile) return null;

  return (
    <Card className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
      <CardContent className="p-3">
        <a
          href={certificateFile}
          target="_blank"
          rel="noreferrer"
          aria-label={text("title")}
          className="block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Image
            src={certificateFile}
            alt={text("title")}
            width={1263}
            height={893}
            unoptimized
            className="h-auto w-full object-contain transition-transform duration-300 hover:scale-[1.01]"
          />
        </a>
      </CardContent>
    </Card>
  );
};

export default CertificateCard;
