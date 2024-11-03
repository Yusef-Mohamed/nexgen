import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICourse } from "@/types";
import { notFound } from "next/navigation";
import { CourseReviewOverView } from "@/components/cards/CourseCard";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CiDiscount1 } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { FiPlayCircle } from "react-icons/fi";
import { PiExam } from "react-icons/pi";
import { CiMobile2 } from "react-icons/ci";
import { GoInfinity } from "react-icons/go";
import { GrCertificate } from "react-icons/gr";
import { Link } from "@/i18n/routing";
import PromoBanner from "../../components/PromoBanner";
import PopularCourses from "../../components/PopularCourses";
import ReviewsGrid from "@/components/ReviewsGrid";
import CourseContent from "./components/CourseContent";
export async function generateMetadata({
  params,
}: {
  params: { locale: string; courseId: string };
}): Promise<Metadata> {
  const axiosInstance = createServerAxiosInstance();
  const courseRes = await axiosInstance.get("/courses/" + params.courseId);
  const courseData = courseRes.data.data as ICourse;
  return getMetadataCoursePage({
    params,
    course: courseData,
  });
}

const CoursesPage = async ({
  params,
}: {
  params: { locale: string; courseId: string };
}) => {
  unstable_setRequestLocale(params.locale);
  try {
    const text = await getTranslations("coursePage");
    const axiosInstance = createServerAxiosInstance();
    const courseRes = await axiosInstance.get("/courses/" + params.courseId);
    const courseData = courseRes.data.data as ICourse;
    return (
      <main>
        <section className="container flex gap-20 secPadding">
          <div className="flex-1 w-full">
            <CourseHeading courseData={courseData} className="max-lg:hidden" />
            <CourseCard courseData={courseData} className="lg:hidden" />
            <div className="my-4 md:my-8">
              <h3 className="mb-4 md:mb-8">{text("whatYouWillLearn")}</h3>
              <ul className="grid gap-4 md:grid-cols-2 md:gap-8">
                {courseData.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-text-2 md:text-base"
                  >
                    <div className="w-1 h-1 mt-2 rounded-full bg-text-2"></div>
                    <p className="flex-1 ">{highlight}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="my-4 md:my-8">
              <h3 className="mb-4 md:mb-8">{text("requirements")}</h3>
              <ul className="grid gap-4 md:grid-cols-2 md:gap-8">
                {courseData.accessibleCourses &&
                courseData.accessibleCourses.length ? (
                  courseData.accessibleCourses.map((course, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-text-1 md:text-base"
                    >
                      <div className="w-1.5 h-1.5 mt-3 rounded-full bg-text-1"></div>
                      <Link
                        href={`/courses/${course._id}`}
                        target="_blank"
                        className="flex-1 font-semibold underline md:text-lg"
                      >
                        {course.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2 text-sm text-text-1 md:text-base">
                    <div className="w-1.5 h-1.5 mt-3 rounded-full bg-text-1"></div>
                    <p className="flex-1 font-semibold md:text-lg">
                      {text("noExperienceRequired")}
                    </p>
                  </li>
                )}
              </ul>
            </div>
            <CourseContent />
          </div>
          <div className="max-w-[29rem] hidden  h-fit lg:block rounded-3xl  basis-[40%] bg-clear-ground cardShadow p-6">
            <CourseCard courseData={courseData} />
          </div>
        </section>
        <PromoBanner />
        <section className="container secPadding">
          <h2 className="mb-6 md:mb-12">{text("studentsReviews")}</h2>
          <ReviewsGrid reviews={courseData.reviews.slice(0, 6)} />
        </section>
        <PopularCourses />
      </main>
    );
  } catch (e) {
    console.log(e);
    return notFound();
  }
};
const CourseHeading: React.FC<{
  courseData: ICourse;
  className?: string;
}> = ({ courseData, className }) => {
  return (
    <div className={className}>
      <h1>{courseData.title}</h1>
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
        {courseData.description}
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
      params: { n: 55 },
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
    <div className={className}>
      <Image
        src={courseData.image}
        width={1000}
        height={1000}
        className="aspect-[41/31] object-cover w-full rounded-2xl"
        alt={courseData.title}
      />{" "}
      <div className="flex items-center justify-between my-4 md:my-8">
        <div className="flex items-end gap-1 font-medium whitespace-nowrap">
          {courseData.priceAfterDiscount ? (
            <>
              <div className="h2">${courseData.priceAfterDiscount}</div>
              <del className="h3 text-text-3">${courseData.price}</del>
            </>
          ) : (
            <div className="h2">${courseData.price}</div>
          )}
        </div>
        {courseData.priceAfterDiscount && (
          <div
            style={{
              fontWeight: 400,
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-md h5 text-green bg-fadedGreen"
          >
            <CiDiscount1 className="w-6 h-6" />
            <span>
              {text("discounted")}{" "}
              {(
                ((courseData.price - courseData.priceAfterDiscount) /
                  courseData.price) *
                100
              ).toFixed(0)}
              %
            </span>
          </div>
        )}
      </div>
      <CourseHeading courseData={courseData} className="lg:hidden" />
      <Button className="w-full mb-4 md:mb-8">{text("startNow")}</Button>
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
