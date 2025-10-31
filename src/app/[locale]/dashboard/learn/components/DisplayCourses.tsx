"use client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/routing";
import { useMyCoursesStore } from "@/stores/MyCoursesStore";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiExam } from "react-icons/pi";
import { FilterTabs } from "@/components/filters/FilterTabs";
import { PlayIcon } from "@/components/icons";

const DisplayCourses = () => {
  const text = useTranslations("learn");
  const { getCourses, courses, isLoading } = useMyCoursesStore();
  const { token, user } = useAuth();
  const [show, setShow] = useState<"completed" | "notCompleted">(
    "notCompleted"
  );
  const locale = useLocale();

  useEffect(() => {
    getCourses(token, user?._id || "");
  }, [getCourses, token, user]);
  const toShowCourses = useMemo(() => {
    if (show === "completed") {
      return courses.filter(
        (course) => course.courseProgress?.status === "Completed"
      );
    } else {
      return courses.filter(
        (course) => course.courseProgress?.status !== "Completed"
      );
    }
  }, [show, courses]);
  console.log(courses);
  return (
    <section className="space-y-4">
      <FilterTabs
        options={[
          { value: "notCompleted", label: text("notCompleted") },
          { value: "completed", label: text("completed") },
        ]}
        activeValue={show}
        onChange={(value) => setShow(value as typeof show)}
      />
      {isLoading ? (
        [1, 2, 3].map((index) => (
          <div
            key={index}
            className="relative flex items-stretch gap-4 p-3 md:p-6 md:gap-10 max-md:flex-col cardShadow rounded-xl bg-clear-ground"
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
        ))
      ) : toShowCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-6 p-4 rounded-full bg-muted/20">
            <PiExam className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            {show === "completed"
              ? text("noCompletedCourses")
              : text("noInProgressCourses")}
          </h3>
          <p className="mb-6 text-muted-foreground max-w-md">
            {show === "completed"
              ? text("noCompletedCoursesDescription")
              : text("noInProgressCoursesDescription")}
          </p>
          <Button asChild>
            <Link href="/courses">
              {show === "completed"
                ? text("startLearning")
                : text("browseCourses")}
            </Link>
          </Button>
        </div>
      ) : (
        toShowCourses.map((course) => (
          <div
            key={course._id}
            className="relative flex items-stretch gap-4 p-3 md:p-6 md:gap-10 max-md:flex-col cardShadow rounded-xl bg-clear-ground"
          >
            <Link href={`/dashboard/learn/${course._id}`}>
              <Image
                loading="lazy"
                src={course.image}
                alt={course.title}
                width={600}
                height={600}
                className="object-cover aspect-[1656/931] md:h-36 md:w-auto max-md:w-full rounded-xl"
              />
            </Link>
            <div
              className="flex max-md:flex-col
             flex-1 w-full gap-2"
            >
              <div className="flex w-full flex-1">
                <div className="self-center w-full xl:pe-10 md:pe-6">
                  <p className="text-text-2 max-md:text-xs">
                    {text("course")} | {course.title}
                  </p>
                  <Link href={`/dashboard/learn/${course._id}`}>
                    <h2 className="my-1 font-semibold md:my-4 h1-5">
                      {course.title}
                    </h2>
                  </Link>
                  {course.courseProgress?.status === "Completed" ? (
                    <>
                      <p className="max-md:text-sm">
                        {text("congratsOnFinishingTheCourse")}
                      </p>
                      {course.courseProgress.certificate.file ? (
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
                              transform: `translateX(${
                                locale === "en" ? "-" : ""
                              }${
                                100 -
                                Number(course.userScore?.totalProgress || 0)
                              }%)`,
                            }}
                          ></div>
                        </div>
                        <span className="block mt-1 font-semibold">
                          {parseInt(
                            course.userScore?.totalProgress?.toString() || "0"
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
              <div className="md:border-s border-primary/20 md:px-10 flex">
                {course.courseProgress?.certificate.file ? (
                  <a
                    className="max-md:hidden w-auto aspect-[28/19] max-md:w-full md:h-36 rounded-xl"
                    href={course.courseProgress.certificate.file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {!course.courseProgress.certificate.file.endsWith(
                      ".pdf"
                    ) && (
                      <Image
                        loading="lazy"
                        src={course.courseProgress.certificate.file}
                        alt={course.title}
                        width={600}
                        height={600}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </a>
                ) : (
                  <div className="flex items-center self-center group gap-3">
                    <PlayIcon />
                    <div className="flex flex-col">
                      <h3 className="font-medium text-primary group-hover:underline">
                        Fundamental Analysis
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Week 1 | Video 34 min
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex absolute items-center justify-center border-none p-0 rounded max-md:absolute top-4 end-4 bg-clear-ground aspect-square">
                    <BsThreeDotsVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel asChild>
                    <Link
                      href={`/dashboard/learn/exams-history/${course._id}`}
                      className="flex items-center gap-2 text-xs"
                    >
                      <PiExam size={18} /> {text("examsHistory")}
                    </Link>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default DisplayCourses;
