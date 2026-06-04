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
  /** Suggested next course — same layout, public course link, lock overlay. */
  locked?: boolean;
}

const cardClassName =
  "relative flex items-stretch gap-4 p-3 md:p-6 md:gap-10 max-md:flex-col cardShadow rounded-xl bg-background-2";

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
          className="object-cover aspect-[1656/931] md:h-36 md:w-auto max-md:w-full rounded-xl"
        />
        <div className="flex max-md:flex-col flex-1 w-full gap-2">
          <div className="flex w-full flex-1">
            <div className="self-center w-full xl:pe-10 md:pe-6">
              <p className="text-text-2 max-md:text-xs">
                {text("lockedCourse")} | {getDynamicString(course.title)}
              </p>
              <h2 className="my-1 font-semibold md:my-4 h1-5 group-hover:text-primary">
                {getDynamicString(course.title)}
              </h2>
              <p className="max-md:text-sm text-text-2">
                {text("viewCoursePage")}
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl transition-colors pointer-events-none backdrop-blur-[2px] bg-white/10"
          aria-hidden
        >
          <Button
            type="button"
            size="icon"
            tabIndex={-1}
            className="size-14 rounded-full shadow-lg pointer-events-none"
          >
            <Lock className="size-7" strokeWidth={2} />
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <div className={cardClassName}>
      <Link href={learnHref}>
        <Image
          loading="lazy"
          src={course.image}
          alt={getDynamicString(course.title)}
          width={600}
          height={600}
          className="object-cover aspect-[1656/931] md:h-36 md:w-auto max-md:w-full rounded-xl"
        />
      </Link>
      <div className="flex max-md:flex-col flex-1 w-full gap-2">
        <div className="flex w-full flex-1">
          <div className="self-center w-full xl:pe-10 md:pe-6">
            <p className="text-text-2 max-md:text-xs">
              {text("course")} | {getDynamicString(course.title)}
            </p>
            <Link href={learnHref}>
              <h2 className="my-1 font-semibold md:my-4 h1-5">
                {getDynamicString(course.title)}
              </h2>
            </Link>
            {course.courseProgress?.status === "Completed" ? (
              <>
                <p className="max-md:text-sm">
                  {text("congratsOnFinishingTheCourse")}
                </p>
                {course.courseProgress.certificate?.file ? (
                  <a
                    href={course.courseProgress.certificate.file}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 underline text-primary max-md:text-sm"
                  >
                    {text("checkYourCertificate")}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-text-3 max-md:text-xs">
                    {text("yourCertificateDosnotAvailableYet")}
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center w-full gap-2 ">
                  <div className="w-full h-1 overflow-hidden rounded-full md:max-w-xs bg-muted">
                    <div
                      className="w-full h-1 rounded-full bg-primary"
                      style={{
                        transform: `translateX(${locale === "en" ? "-" : ""}${
                          100 - Number(course.userScore?.totalProgress || 0)
                        }%)`,
                      }}
                    />
                  </div>
                  <span className="block mt-1 font-semibold">
                    {parseInt(
                      course.userScore?.totalProgress?.toString() || "0",
                    )}
                    %
                  </span>
                </div>
                <span className="block max-md:text-sm text-text-2">
                  {text("overAllProgress")}
                </span>
              </>
            )}
          </div>
        </div>
        {!minimal && (
          <div className="md:border-s border-primary/20 md:px-10 flex">
            {course.courseProgress?.certificate?.file ? (
              <a
                className="max-md:hidden w-auto aspect-[126/90] max-md:w-full md:h-36 overflow-hidden rounded-xl"
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
                    className="object-cover w-full h-full"
                  />
                )}
              </a>
            ) : course.lastLesson ? (
              <Link
                href={`${learnHref}?display=lesson&lesson=${course.lastLesson._id}`}
                className="flex items-center self-center group gap-3 aspect-[126/90] md:h-36"
              >
                <PlayIcon />
                <div className="flex flex-col">
                  <h3 className="font-medium text-primary group-hover:underline line-clamp-2">
                    {getDynamicString(course.lastLesson.title)}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
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
          className="flex items-center gap-2 text-xs absolute top-4 end-4 border bg-primary-faded text-primary border-primary/20 px-1 py-0.5 rounded"
        >
          <PiExam size={18} /> {text("examsHistory")}
        </Link>
      </div>
    </div>
  );
};

export const LearnCourseCardSkeleton = () => {
  return (
    <div
      className={cardClassName.replace("bg-background-2", "bg-clear-ground")}
    >
      <div className="object-cover aspect-[1656/931] md:w-60 w-full rounded-xl bg-muted animate-pulse" />

      <div className="flex flex-1 w-full">
        <div className="self-center w-full xl:pe-10 md:pe-6">
          <div className="w-40 h-4 rounded bg-muted animate-pulse max-md:text-xs" />
          <div className="w-3/4 h-8 my-1 rounded bg-muted animate-pulse md:my-4" />

          <div className="flex items-center gap-2">
            <div className="w-full h-1 max-w-xs overflow-hidden rounded-full bg-muted">
              <div className="w-full h-1 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="w-8 h-4 rounded bg-muted animate-pulse" />
          </div>

          <div className="w-32 h-4 rounded bg-muted animate-pulse max-md:text-sm" />
        </div>
        <div className="flex items-center justify-center w-8 h-8 p-0 rounded aspect-square bg-muted animate-pulse max-md:absolute top-4 right-4" />
      </div>
    </div>
  );
};
