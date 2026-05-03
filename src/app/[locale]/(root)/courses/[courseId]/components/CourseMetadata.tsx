"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ICourse } from "@/types";
import { cn } from "@/lib/utils";

interface CourseMetadataProps {
  courseData: ICourse;
}

type Tone = "primary" | "secondary";

const toneStyles: Record<
  Tone,
  { ring: string; iconBg: string; bar: string }
> = {
  primary: {
    ring: "ring-primary/20",
    iconBg: "bg-primary/10",
    bar: "bg-primary",
  },
  secondary: {
    ring: "ring-secondary/25",
    iconBg: "bg-secondary/10",
    bar: "bg-secondary",
  },
};

const CourseMetadata = ({ courseData }: CourseMetadataProps) => {
  const text = useTranslations("coursePage");

  const getSkillLevel = () => {
    const level = courseData.type?.toLowerCase();
    if (level === "beginner") return text("beginner");
    if (level === "intermediate") return text("intermediate");
    if (level === "advanced") return text("advanced");
    return text("beginner");
  };

  const hasCertificate = !!courseData.certificateDescription;

  const items: {
    tone: Tone;
    image: string;
    title: string;
    subtitle: string;
  }[] = [
    {
      tone: "primary",
      image: "/images/level.png",
      title: getSkillLevel(),
      subtitle: text("skillLevel"),
    },
    {
      tone: "secondary",
      image: "/images/time.png",
      title: text("lifetimeAccess"),
      subtitle: text("accessDuration"),
    },
  ];

  if (hasCertificate) {
    items.push({
      tone: "secondary",
      image: "/images/certificate.png",
      title: text("certificate"),
      subtitle: text("earnCertificate"),
    });
  }

  return (
    <div className="relative my-4 md:my-8 rounded-2xl bg-primary-faded border border-primary/15 p-4 sm:p-5 overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-12 -right-12 size-40 rounded-full bg-secondary/15 dark:bg-secondary/25 blur-[80px] opacity-70 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-12 -left-12 size-40 rounded-full bg-primary/10 dark:bg-primary/20 blur-[80px] opacity-60 pointer-events-none"
      />

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const styles = toneStyles[item.tone];
          return (
            <div
              key={index}
              className={cn(
                "group flex items-center gap-3 md:gap-4 rounded-xl bg-clear-ground/80 backdrop-blur-sm p-3 md:p-4 border border-primary/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/15",
              )}
            >
              <div
                className={cn(
                  "relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ring-4 transition-transform duration-300 group-hover:scale-105",
                  styles.iconBg,
                  styles.ring,
                )}
              >
                <Image
                  src={item.image}
                  width={56}
                  height={56}
                  alt={item.subtitle}
                  className="w-7 h-7 md:w-9 md:h-9 object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm md:text-base text-text-1 truncate">
                  {item.title}
                </span>
                <span className="text-xs md:text-sm text-text-3 mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseMetadata;
