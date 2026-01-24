"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { ICourse } from "@/types";

interface CourseMetadataProps {
  courseData: ICourse;
}

const CourseMetadata = ({ courseData }: CourseMetadataProps) => {
  const text = useTranslations("coursePage");

  // Get skill level
  const getSkillLevel = () => {
    const level = courseData.type?.toLowerCase();
    if (level === "beginner") return text("beginner");
    if (level === "intermediate") return text("intermediate");
    if (level === "advanced") return text("advanced");
    return text("beginner"); // default
  };

  // Check if certificate exists
  const hasCertificate = !!courseData.certificateDescription;
  const theme = useTheme();
  const isDark = theme.resolvedTheme === "dark";
  return (
    <div
      style={
        isDark
          ? {
              background: "linear-gradient(180deg, #282828 0%, #00424A 100%)",
              boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
            }
          : {
              background: "linear-gradient(180deg, #FFF 0%, #B2F7FF 100%)",
              boxShadow: "2px 4px 16px 0 rgba(142, 213, 255, 0.40)",
            }
      }
      className="my-4 md:my-8 rounded-2xl p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Skill Level Section */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
            <Image
              src="/images/level.png"
              width={56}
              height={56}
              alt={text("skillLevel")}
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-text-1">
              {getSkillLevel()}
            </span>
            <span className="text-xs md:text-sm text-text-2">
              {text("skillLevel")}
            </span>
          </div>
        </div>

        {/* Lifetime Access Section */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
            <Image
              src="/images/time.png"
              width={56}
              height={56}
              alt={text("lifetimeAccess")}
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-text-1">
              {text("lifetimeAccess")}
            </span>
            <span className="text-xs md:text-sm text-text-2">
              {text("accessDuration")}
            </span>
          </div>
        </div>

        {/* Certificate Section */}
        {hasCertificate && (
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
              <Image
                src="/images/certificate.png"
                width={56}
                height={56}
                alt={text("certificate")}
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-text-1">
                {text("certificate")}
              </span>
              <span className="text-xs md:text-sm text-text-2">
                {text("earnCertificate")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMetadata;
