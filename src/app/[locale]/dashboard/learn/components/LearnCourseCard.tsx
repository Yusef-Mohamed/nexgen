"use client";

import { Link } from "@/i18n/navigation";
import { getDynamicString } from "@/lib/utils";
import type { ICourse } from "@/types";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  HiOutlineArrowRight,
  HiOutlineCheckBadge,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineLockClosed,
  HiOutlinePlayCircle,
  HiOutlineTrophy,
} from "react-icons/hi2";

interface LearnCourseCardProps {
  course: ICourse;
  minimal?: boolean;
  locked?: boolean;
}

const cardClassName =
  "group relative overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-text-1/5 sm:p-4";

export const LearnCourseCard = ({
  course,
  minimal = false,
  locked = false,
}: LearnCourseCardProps) => {
  const text = useTranslations("learn");
  const courseId = course._id || course.id;
  const learnHref = "/dashboard/learn/" + courseId;
  const coursePageHref = "/courses/" + (course.slug || courseId);
  const certificateFile = course.courseProgress?.certificate?.file;
  const isCertificatePdf = certificateFile?.toLowerCase().endsWith(".pdf");
  const courseTitle = getDynamicString(course.title) || text("course");
  const courseImage = course.image || "/images/courses.png";
  const progress = Math.min(
    100,
    Math.max(0, Number(course.userScore?.totalProgress) || 0),
  );
  const isCompleted = course.courseProgress?.status === "Completed";

  if (locked) {
    return (
      <Link href={coursePageHref} className={cardClassName}>
        <div className="grid gap-4 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-center">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-background-2 sm:aspect-[4/3]">
            <Image
              loading="lazy"
              src={courseImage}
              alt={courseTitle}
              fill
              sizes="(max-width: 640px) 100vw, 176px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/20" />
          </div>

          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-secondary">
              <HiOutlineLockClosed className="size-3.5" />
              {text("lockedCourse")}
            </div>
            <h2 className="mt-3 line-clamp-2 font-black text-text-1 transition-colors group-hover:text-primary">
              {courseTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-3">
              {text("viewCoursePage")}
            </p>
          </div>

          <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <HiOutlineArrowRight className="size-5 rtl:rotate-180" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <article className={cardClassName}>
      <div
        aria-hidden
        className="pointer-events-none absolute -end-16 -top-20 size-44 rounded-full bg-primary/10 blur-[70px]"
      />

      <div
        className={
          minimal
            ? "relative grid gap-4 md:grid-cols-[14rem_minmax(0,1fr)] md:items-center"
            : "relative grid gap-4 md:grid-cols-[14rem_minmax(0,1fr)] md:items-center xl:grid-cols-[14rem_minmax(0,1fr)_18rem]"
        }
      >
        <Link
          href={learnHref}
          className="relative aspect-video overflow-hidden rounded-xl bg-background-2 md:aspect-[16/10]"
        >
          <Image
            loading="lazy"
            src={courseImage}
            alt={courseTitle}
            fill
            sizes="(max-width: 768px) 100vw, 224px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-3 start-3 inline-flex size-10 items-center justify-center rounded-full border border-clear-ground/30 bg-clear-ground/90 text-primary cardShadowSm backdrop-blur-sm">
            <HiOutlinePlayCircle className="size-5" />
          </span>
        </Link>

        <div className="min-w-0 py-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-primary">
              <HiOutlineBookOpen className="size-3.5" />
              {text("course")}
            </span>
            <Link
              href={"/dashboard/learn/exams-history/" + courseId}
              className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-1 text-[10px] font-black text-secondary transition-colors hover:border-secondary/35"
            >
              <HiOutlineTrophy className="size-3.5" />
              {text("examsHistory")}
            </Link>
          </div>

          <Link href={learnHref}>
            <h2 className="mt-3 line-clamp-2 font-black text-text-1 transition-colors hover:text-primary">
              {courseTitle}
            </h2>
          </Link>

          {isCompleted ? (
            <div className="mt-3">
              <p className="text-sm font-bold text-green">
                {text("congratsOnFinishingTheCourse")}
              </p>
              {!certificateFile && (
                <p className="mt-1 text-sm text-text-3">
                  {text("yourCertificateDosnotAvailableYet")}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between gap-3 text-xs font-bold">
                <span className="text-text-3">{text("overAllProgress")}</span>
                <span className="text-text-1">{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: progress + "%" }}
                />
              </div>
            </div>
          )}
        </div>

        {!minimal && (
          <div className="border-primary/10 xl:border-s xl:ps-4">
            {certificateFile ? (
              <a
                href={certificateFile}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-28 items-center gap-3 rounded-2xl border border-green/15 bg-fadedGreen p-3 transition-all hover:-translate-y-0.5 hover:border-green/30"
              >
                <span className="inline-flex size-12 shrink-0 overflow-hidden rounded-xl border border-green/15 bg-clear-ground text-green">
                  {isCertificatePdf ? (
                    <span className="flex size-full items-center justify-center">
                      <HiOutlineDocumentText className="size-6" />
                    </span>
                  ) : (
                    <Image
                      loading="lazy"
                      src={certificateFile}
                      alt={courseTitle}
                      width={96}
                      height={96}
                      className="size-full object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <HiOutlineCheckBadge className="mb-1 size-5 text-green" />
                  <span className="line-clamp-2 text-sm font-black text-text-1">
                    {text("checkYourCertificate")}
                  </span>
                </span>
              </a>
            ) : course.lastLesson ? (
              <Link
                href={
                  learnHref + "?display=lesson&lesson=" + course.lastLesson._id
                }
                className="flex min-h-28 items-center gap-3 rounded-2xl border border-primary/10 bg-background-2 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HiOutlinePlayCircle className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-primary">
                    {text("continueLearning")}
                  </span>
                  <span className="mt-1 block line-clamp-2 text-sm font-black text-text-1">
                    {getDynamicString(course.lastLesson.title) ||
                      text("lesson")}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-xs text-text-3">
                    <HiOutlineClock className="size-3.5" />
                    {Number(course.lastLesson.lessonDuration) || 0}{" "}
                    {text("minuteAbbr")}
                  </span>
                </span>
              </Link>
            ) : (
              <Link
                href={learnHref}
                className="flex min-h-28 items-center justify-center gap-2 rounded-2xl border border-primary/10 bg-primary/5 px-4 text-sm font-black text-primary transition-colors hover:bg-primary/10"
              >
                {text("openCourse")}
                <HiOutlineArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export const LearnCourseCardSkeleton = () => (
  <div className={cardClassName}>
    <div className="grid gap-4 md:grid-cols-[14rem_minmax(0,1fr)] md:items-center xl:grid-cols-[14rem_minmax(0,1fr)_18rem]">
      <div className="aspect-video animate-pulse rounded-xl bg-muted md:aspect-[16/10]" />
      <div className="space-y-3 py-1">
        <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-3/4 animate-pulse rounded-lg bg-muted" />
        <div className="h-2 w-full max-w-md animate-pulse rounded-full bg-muted" />
      </div>
      <div className="hidden h-28 animate-pulse rounded-2xl bg-muted xl:block" />
    </div>
  </div>
);
