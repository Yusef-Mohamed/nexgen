import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICourse } from "@/types";
import { notFound } from "next/navigation";
import { CourseReviewOverView } from "@/components/cards/CourseCard";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CiDiscount1 } from "react-icons/ci";
import { FiPlayCircle } from "react-icons/fi";
import { PiExam } from "react-icons/pi";
import { CiMobile2 } from "react-icons/ci";
import { GoInfinity } from "react-icons/go";
import { GrCertificate } from "react-icons/gr";
import { Link } from "@/i18n/navigation";
import PopularCourses from "../../components/PopularCourses";
import ReviewsGrid from "@/components/ReviewsGrid";
import CourseContent from "./components/CourseContent";
import BuyCourse from "./components/BuyCourse";
import { cn, getDynamicString } from "@/lib/utils";
import MobileAppHero from "../../components/MobileAppHero";
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string; courseId: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const axiosInstance = await createServerAxiosInstance();
  const courseRes = await axiosInstance.get("/courses/" + params.courseId);
  const courseData = courseRes.data.data as ICourse;

  return getMetadataCoursePage({
    params,
    course: {
      title: getDynamicString(courseData.title),
      description: getDynamicString(courseData.description),
    },
  });
}

const CoursesPage = async (
  props: {
    params: Promise<{ locale: string; courseId: string }>;
  }
) => {
  const params = await props.params;
  let courseData: ICourse | null = null;
  try {
    const axiosInstance = await createServerAxiosInstance();
    const courseRes = await axiosInstance.get("/courses/" + params.courseId);
    courseData = courseRes.data.data as ICourse;

  } catch (e) {
    console.log(e);
    return notFound();
  }
  const text = await getTranslations("coursePage");
  return (
    <main>
      <section className="container flex gap-20 secPadding">
        <div className="flex-1 w-full">
          <CourseHeading courseData={courseData} className="max-lg:hidden" />
          <CourseCard
            courseData={courseData}
            className="lg:hidden relative overflow-hidden"
          />
          {courseData.whoThisCourseFor &&
            courseData.whoThisCourseFor.length > 0 && (
              <div className="my-4 md:my-8">
                <h3 className="mb-4 md:mb-8">{text("whoThisCourseFor")}</h3>
                <ul className="grid gap-4 list-disc md:grid-cols-2 md:gap-8">
                  {courseData.whoThisCourseFor.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-text-2 md:text-base"
                    >
                      <p className="flex-1">{getDynamicString(item)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {courseData.whatWillLearn &&
            courseData.whatWillLearn.length > 0 && (
              <div className="my-4 md:my-8">
                <h3 className="mb-4 md:mb-8">{text("whatYouWillLearn")}</h3>
                <ul className="grid gap-4 md:grid-cols-2 md:gap-8">
                  {courseData.whatWillLearn.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-text-2 md:text-base"
                    >
                      <p className="flex-1"> {getDynamicString(item)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {courseData.coursePrerequisites && (
            <div className="my-4 md:my-8">
              <h3 className="mb-4 md:mb-8">{text("coursePrerequisites")}</h3>
              <ul className="grid gap-4 md:grid-cols-2 md:gap-8">
                {courseData.coursePrerequisites.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-text-2 md:text-base"
                  >
                    <p className="flex-1"> {getDynamicString(item)}</p>
                  </li>
                ))}{" "}
                {courseData.accessibleCourses &&
                  courseData.accessibleCourses.length > 0 &&
                  courseData.accessibleCourses.map((course, index) => (
                    <li
                      key={`accessible-${index}`}
                      className="flex items-start gap-2 text-sm text-text-1 md:text-base"
                    >
                      <p className="flex-1 font-semibold md:text-lg">
                        {text("recommendedToSee")}{" "}
                        <Link
                          href={`/courses/${course._id}`}
                          target="_blank"
                          className="underline"
                        >
                          {getDynamicString(course.title)}
                        </Link>
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <CourseContent />
        </div>
        <div className="max-w-[29rem] hidden  relative overflow-hidden h-fit lg:block rounded-3xl  basis-[40%] bg-clear-ground cardShadow p-6">
          <CourseCard courseData={courseData} />
        </div>
      </section>
      <MobileAppHero />
      <section className="container secPadding">
        <h2 className="mb-6 md:mb-12">{text("studentsReviews")}</h2>
        <ReviewsGrid
          reviews={courseData.reviews}
          isAll
          dialogHeader={`${courseData.title} - ${text("reviews")}`}
        />
      </section>
      <PopularCourses />
    </main>
  );
};
const CourseHeading: React.FC<{
  courseData: ICourse;
  className?: string;
}> = ({ courseData, className }) => {
  return (
    <div className={className}>
      <h1>{getDynamicString(courseData.title)}</h1>
      <CourseReviewOverView
        ratingsAverage={courseData.ratingsAverage}
        ratingsQuantity={courseData.ratingsQuantity}
      />
      <p
        style={{
          fontWeight: 400,
        }}
        className="my-4 text-text-2 h3 md:my-8"
      >
        {getDynamicString(courseData.description)}
      </p>
    </div>
  );
};
const CourseCard: React.FC<{
  courseData: ICourse;
  className?: string;
}> = ({ courseData, className }) => {
  const text = useTranslations("coursePage");
  const items = [
    {
      icon: <FiPlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "nHourOfVideos",
      params: { n: (courseData.courseDuration / 60).toFixed(1) },
    },
    { icon: <PiExam className="w-4 h-4 sm:w-5 sm:h-5" />, text: "quizes" },
    {
      icon: <CiMobile2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "accessOnMobile",
    },
    {
      icon: <GoInfinity className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "lifetimeAccess",
    },
    {
      icon: <GrCertificate className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "certificateOfCompletion",
    },
  ];
  return (
    <div className={cn(className)}>
      <div
        style={{
          filter: "blur(100px)",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
        }}
        className="absolute  max-lg:hidden dark:bg-purple-400 bg-purple-200  opacity-70 bottom-0 right-0 translate-x-1/4 translate-y-1/4 size-20"
      ></div>
      <Image
        src={courseData.image}
        width={1000}
        height={1000}
        className="aspect-[41/31] object-cover w-full rounded-2xl"
        alt={getDynamicString(courseData.title)}
      />{" "}
      <div className="flex items-center justify-between my-4 md:my-8">
        <div className="flex items-end gap-1 font-medium whitespace-nowrap">
          {courseData.priceAfterDiscount ? (
            <>
              <div className="h2">${courseData.priceAfterDiscount}</div>
              <del className="h3 text-text-3">${courseData.price}</del>
            </>
          ) : (
            <div className="h2">
              {courseData.price ? <>${courseData.price}</> : text("free")}
            </div>
          )}
        </div>
        {courseData.priceAfterDiscount ? (
          <div
            style={{
              fontWeight: 400,
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-md h5 text-green bg-fadedGreen"
          >
            <CiDiscount1 className="w-6 h-6" />
            <span>
              <span className="!text-sm">{text("discounted")} </span>
              {(
                ((courseData.price - courseData.priceAfterDiscount) /
                  courseData.price) *
                100
              ).toFixed(0)}
              %
            </span>
          </div>
        ) : null}
      </div>
      <CourseHeading courseData={courseData} className="lg:hidden" />
      <BuyCourse id={courseData._id} price={courseData.price} />
      <div>
        <h4 className="mb-4 md:mb-6">{text("thisCourseIncludes")}</h4>
        <ul className="space-y-2 md:space-y-4">
          {items.map((item, index) => (
            <li
              className="flex items-center gap-2 text-sm md:text-base"
              key={index}
            >
              {item.icon}
              {item.params ? text(item.text, item.params) : text(item.text)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default CoursesPage;
