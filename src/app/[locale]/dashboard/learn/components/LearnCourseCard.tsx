"use client";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { PiExam } from "react-icons/pi";
import { Lock } from "lucide-react";
import { PlayIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getDynamicString } from "@/lib/utils";
import { ICourse } from "@/types";

interface LearnCourseCardProps {
  course: ICourse;
  minimal?: boolean;
  /** Suggested next course - same layout, public course link, lock overlay. */
  locked?: boolean;
}

const cardClassName =
  "relative flex items-stretch gap-4 overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-text-1/5 md:gap-5 md:p-4 max-md:flex-col";

const imageClassName =
  "aspect-[16/9] w-full rounded-xl object-cover md:h-36 md:w-60";

export const LearnCourseCard = ({
  course,
  minimal = false,
  locked = false,
}: LearnCourseCardProps) => {
  const text = useTranslations("learn");
  const locale = useLocale();
  const courseId = course._id || course.id;
  const learnHref = `/dashboard/learn/${courseId}`;
  const coursePageHref = `/courses/${course.slug || courseId}`;

  if (locked) {
    return (
      <Link href={coursePageHref} className={`${cardClassName} group`}>
        <Image
          loading="lazy"
          src={course.image}
          alt={getDynamicString(course.title)}
          width={600}
          height={600}
          className={imageClassName}
        />
        <div className="flex min-w-0 flex-1 max-md:flex-col">
          <div className="flex min-w-0 flex-1">
            <div className="w-full self-center md:pe-6 xl:pe-10">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                {text("lockedCourse")}
              </p>
              <h2 className="my-2 line-clamp-2 font-black text-text-1 transition-colors group-hover:text-primary md:text-lg">
                {getDynamicString(course.title)}
              </h2>
              <p className="text-sm text-text-3">{text("viewCoursePage")}</p>
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/25 backdrop-blur-[2px] transition-colors"
          aria-hidden
        >
          <Button
            type="button"
            size="icon"
            tabIndex={-1}
            className="pointer-events-none size-14 rounded-full shadow-lg"
          >
            <Lock className="size-7" strokeWidth={2} />
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <div className={cardClassName}>
      <Link href={learnHref} className="shrink-0">
        <Image
          loading="lazy"
          src={course.image}
          alt={getDynamicString(course.title)}
          width={600}
          height={600}
          className={imageClassName}
        />
      </Link>
      <div className="flex min-w-0 flex-1 gap-3 max-md:flex-col">
        <div className="flex min-w-0 flex-1">
          <div className="w-full self-center pe-1 md:pe-28 xl:pe-32">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">
              {text("course")}
            </p>
            <Link href={learnHref}>
              <h2 className="my-2 line-clamp-2 font-black text-text-1 transition-colors hover:text-primary md:text-lg">
                {getDynamicString(course.title)}
              </h2>
            </Link>
            {course.courseProgress?.status === "Completed" ? (
              <>
                <p className="text-sm text-text-2">
                  {text("congratsOnFinishingTheCourse")}
                </p>
                {course.courseProgress.certificate?.file ? (
                  <a
                    href={course.courseProgress.certificate.file}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex text-sm font-bold text-primary underline-offset-4 hover:underline"
                  >
                    {text("checkYourCertificate")}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-text-3">
                    {text("yourCertificateDosnotAvailableYet")}
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="flex w-full items-center gap-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted md:max-w-xs">
                    <div
                      className="h-2 w-full rounded-full bg-primary"
                      style={{
                        transform: `translateX(${locale === "en" ? "-" : ""}${
                          100 - Number(course.userScore?.totalProgress || 0)
                        }%)`,
                      }}
                    />
                  </div>
                  <span className="shrink-0 text-sm font-black text-text-1">
                    {parseInt(
                      course.userScore?.totalProgress?.toString() || "0",
                    )}
                    %
                  </span>
                </div>
                <span className="mt-1 block text-sm text-text-3">
                  {text("overAllProgress")}
                </span>
              </>
            )}
          </div>
        </div>
        {!minimal && (
          <div className="flex rounded-xl border-primary/10 md:border-s md:px-5">
            {course.courseProgress?.certificate?.file ? (
              <a
                className="hidden h-32 w-auto overflow-hidden rounded-xl md:block"
                href={course.courseProgress.certificate.file}
                target="_blank"
                rel="noreferrer"
              >
                {!course.courseProgress.certificate.file?.endsWith(".pdf") && (
                  <Image
                    loading="lazy"
                    src={course.courseProgress.certificate.file}
                    alt={getDynamicString(course.title)}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                )}
              </a>
            ) : course.lastLesson ? (
              <Link
                href={`${learnHref}?display=lesson&lesson=${course.lastLesson._id}`}
                className="group flex items-center gap-3 self-center rounded-xl border border-primary/10 bg-background-2 p-3 transition-colors hover:border-primary/30 hover:bg-primary/10 md:h-32 md:w-56"
              >
                <PlayIcon />
                <div className="min-w-0">
                  <h3 className="line-clamp-2 font-bold text-primary group-hover:underline">
                    {getDynamicString(course.lastLesson.title)}
                  </h3>
                  <p className="line-clamp-1 text-sm text-text-3">
                    {getDynamicString(course.lastLesson.section.title)} |{" "}
                    {course.lastLesson.lessonDuration} {text("min")}
                  </p>
                </div>
              </Link>
            ) : null}
          </div>
        )}
        <Link
          href={`/dashboard/learn/exams-history/${courseId}`}
          className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-faded px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:border-primary/40 hover:bg-primary/15"
        >
          <PiExam size={16} /> {text("examsHistory")}
        </Link>
      </div>
    </div>
  );
};

export const LearnCourseCardSkeleton = () => {
  return (
    <div className={cardClassName}>
      <div className="aspect-[16/9] w-full rounded-xl bg-muted md:h-36 md:w-60" />

      <div className="flex flex-1">
        <div className="w-full self-center md:pe-28 xl:pe-32">
          <div className="h-3 w-28 rounded-full bg-muted" />
          <div className="my-3 h-7 w-3/4 rounded bg-muted" />

          <div className="flex items-center gap-3">
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted" />
            <div className="h-4 w-8 rounded bg-muted" />
          </div>

          <div className="mt-2 h-4 w-32 rounded bg-muted" />
        </div>
        <div className="absolute end-3 top-3 h-7 w-28 rounded-full bg-muted" />
      </div>
    </div>
  );
};
