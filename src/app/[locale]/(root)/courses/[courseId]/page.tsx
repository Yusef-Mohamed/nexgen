import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICourse } from "@/types";
import { notFound } from "next/navigation";
import { CourseReviewOverView } from "@/components/cards/CourseCard";
import { useTranslations } from "next-intl";
import { FiPlayCircle } from "react-icons/fi";
import { PiExam } from "react-icons/pi";
import { CiMobile2 } from "react-icons/ci";
import { GoInfinity } from "react-icons/go";
import { GrCertificate } from "react-icons/gr";
import {
  HiOutlineCheckCircle,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentList,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineBookOpen,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { Link } from "@/i18n/navigation";
import PopularCourses from "../../components/PopularCourses";
import ReviewsGrid from "@/components/ReviewsGrid";
import CourseContent from "./components/CourseContent";
import BuyCourse from "./components/BuyCourse";
import { cn, getDynamicString } from "@/lib/utils";
import MobileAppHero from "../../components/MobileAppHero";
import CourseMetadata from "./components/CourseMetadata";
import ItemImage from "./components/ItemImage";
import CouponAwarePrice from "@/components/CouponAwarePrice";
import { getCouponCodeFromSearchParams, getItemBasePrice } from "@/lib/coupons";
import SectionBlock from "@/components/SectionBlock";
import ItemPageLayout from "@/components/ItemPageLayout";
import ItemDetailList from "@/components/ItemDetailList";
export async function generateMetadata(props: {
  params: Promise<{ locale: string; courseId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
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

const CoursesPage = async (props: {
  params: Promise<{ locale: string; courseId: string }>;
  searchParams: Promise<{
    coupon?: string | string[];
    code?: string | string[];
  }>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const couponCode = getCouponCodeFromSearchParams(searchParams);

  let courseData: ICourse | null = null;
  try {
    const axiosInstance = await createServerAxiosInstance({
      overRideLocale: params.locale,
    });
    const courseRes = await axiosInstance.get("/courses/" + params.courseId);
    courseData = courseRes.data.data as ICourse;
  } catch (e) {
    console.log(e);
    return notFound();
  }
  const text = await getTranslations("coursePage");
  return (
    <main>
      {/* Decorative top accent strip — mirrors landing page hero blobs */}
      <ItemPageLayout
        aside={<CourseCard courseData={courseData} couponCode={couponCode} />}
      >
        <CourseHeading courseData={courseData} className="max-lg:hidden" />
        <CourseCard
          courseData={courseData}
          couponCode={couponCode}
          className="lg:hidden relative overflow-hidden"
        />
        <CourseMetadata courseData={courseData} />

        {courseData.whatWillLearn && courseData.whatWillLearn.length > 0 && (
          <SectionBlock
            tone="primary"
            eyebrow={text("whatYouWillLearn")}
            icon={<HiOutlineCheckCircle className="size-5" />}
            title={text("whatYouWillLearn")}
          >
            <ItemDetailList
              items={courseData.whatWillLearn}
              tone="primary"
              icon={<HiOutlineCheckCircle className="size-4" />}
            />
          </SectionBlock>
        )}

        {courseData.whoThisCourseFor &&
          courseData.whoThisCourseFor.length > 0 && (
            <SectionBlock
              tone="secondary"
              eyebrow={text("whoThisCourseFor")}
              icon={<HiOutlineUserGroup className="size-5" />}
              title={text("whoThisCourseFor")}
            >
              <ItemDetailList
                items={courseData.whoThisCourseFor}
                tone="secondary"
                icon={<HiOutlineUserGroup className="size-4" />}
              />
            </SectionBlock>
          )}

        {(courseData.coursePrerequisites.length > 0 ||
          courseData.accessibleCourses.length > 0) && (
          <SectionBlock
            tone="primary"
            eyebrow={text("coursePrerequisites")}
            icon={<HiOutlineClipboardDocumentList className="size-5" />}
            title={text("coursePrerequisites")}
          >
            <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
              <ItemDetailList
                items={courseData.coursePrerequisites}
                tone="primary"
                icon={<HiOutlineClipboardDocumentList className="size-4" />}
                asFragment
              />
              {courseData.accessibleCourses &&
                courseData.accessibleCourses.length > 0 &&
                courseData.accessibleCourses.map((course, index) => (
                  <li
                    key={`accessible-${index}`}
                    className="md:col-span-2 flex items-start gap-3 rounded-xl bg-primary/10 border border-primary/20 p-3 sm:p-4"
                  >
                    <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <HiOutlineSparkles className="size-4" />
                    </span>
                    <p className="flex-1 text-sm md:text-base text-text-1 font-medium">
                      {text("recommendedToSee")}{" "}
                      <Link
                        href={`/courses/${course._id}`}
                        target="_blank"
                        className="text-primary underline underline-offset-2 hover:text-primary-main inline-flex items-center gap-1"
                      >
                        {getDynamicString(course.title)}
                        <HiOutlineArrowRight className="size-3.5 rtl:rotate-180" />
                      </Link>
                    </p>
                  </li>
                ))}
            </ul>
          </SectionBlock>
        )}

        {courseData.nextCourses && courseData.nextCourses.length > 0 && (
          <SectionBlock
            tone="secondary"
            eyebrow={text("whatIsNext")}
            icon={<HiOutlineSparkles className="size-5" />}
            title={
              getDynamicString(courseData.whatIsNextTitle) || text("whatIsNext")
            }
          >
            {getDynamicString(courseData.whatIsNextDescription) && (
              <p className="text-sm md:text-base text-text-2 mb-5">
                {getDynamicString(courseData.whatIsNextDescription)}
              </p>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {courseData.nextCourses.map((course) => (
                <Link
                  key={course._id}
                  href={`/courses/${course.slug || course._id}`}
                  className="group rounded-xl bg-clear-ground border border-secondary/15 p-4 transition-colors hover:border-secondary/40"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <HiOutlineBookOpen className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-text-1 line-clamp-2 group-hover:text-secondary">
                        {getDynamicString(course.title)}
                      </h3>
                      {getDynamicString(course.description) && (
                        <p className="mt-1 text-sm text-text-2 line-clamp-2">
                          {getDynamicString(course.description)}
                        </p>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-secondary">
                        {text("viewCourse")}
                        <HiOutlineArrowRight className="size-3.5 rtl:rotate-180" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </SectionBlock>
        )}

        <CourseContent />
      </ItemPageLayout>

      <MobileAppHero />

      <section className="container secPadding">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20">
            <HiOutlineChatBubbleLeftRight className="size-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              {text("studentsReviews")}
            </span>
          </div>
          <h2 className="text-text-1 font-bold">{text("studentsReviews")}</h2>
        </div>
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
    <div className={cn("relative", className)}>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20">
        <HiOutlineBookOpen className="size-4 text-primary" />
        <span className="text-xs sm:text-sm font-medium text-primary">
          {courseData.category && typeof courseData.category === "object"
            ? getDynamicString(courseData.category.title)
            : "Course"}
        </span>
      </div>
      <h1 className="font-bold leading-tight tracking-tight text-text-1">
        {getDynamicString(courseData.title)}
      </h1>
      <CourseReviewOverView
        ratingsAverage={courseData.ratingsAverage}
        ratingsQuantity={courseData.ratingsQuantity}
      />
      <div
        style={{
          fontWeight: 400,
        }}
        className="my-4 text-text-2 md:my-6 prose prose-sm md:prose-base max-w-none prose-headings:font-semibold prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5"
        dangerouslySetInnerHTML={{
          __html: getDynamicString(courseData.description) ?? "",
        }}
      />
    </div>
  );
};

const CourseCard: React.FC<{
  courseData: ICourse;
  couponCode?: string;
  className?: string;
}> = ({ courseData, couponCode, className }) => {
  const text = useTranslations("coursePage");
  const items = [
    {
      icon: <FiPlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "nHourOfVideos",
      params: { n: (courseData.courseDuration / 60).toFixed(1) },
      tone: "primary" as const,
    },
    {
      icon: <PiExam className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "quizes",
      tone: "secondary" as const,
    },
    {
      icon: <CiMobile2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "accessOnMobile",
      tone: "primary" as const,
    },
    {
      icon: <GoInfinity className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "lifetimeAccess",
      tone: "primary" as const,
    },
    {
      icon: <GrCertificate className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "certificateOfCompletion",
      tone: "secondary" as const,
    },
  ];

  const toneToBg: Record<"primary" | "secondary", string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
  };

  return (
    <div className={cn(className)}>
      {/* Decorative blob — palette aligned */}
      <div
        aria-hidden
        className="absolute max-lg:hidden -bottom-16 -right-16 size-48 rounded-full bg-secondary/30 dark:bg-secondary/40 blur-[100px] opacity-60 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute max-lg:hidden -top-16 -left-16 size-40 rounded-full bg-primary/15 dark:bg-primary/25 blur-[100px] opacity-60 pointer-events-none"
      />

      <div className="relative">
        <ItemImage
          image={courseData.image}
          title={courseData.title}
          promotionVideo={courseData.promotionVideo}
        />

        <CouponAwarePrice
          item={courseData}
          itemId={courseData._id}
          itemType="course"
          couponCode={couponCode}
          freeLabel={text("free")}
          discountedLabel={text("discounted")}
        />
        <CourseHeading courseData={courseData} className="lg:hidden" />
        <BuyCourse
          id={courseData._id}
          price={getItemBasePrice(courseData)}
          couponCode={couponCode}
        />
        <div>
          <div className="flex items-center gap-2 mb-4 md:mb-5">
            <span className="size-1.5 rounded-full bg-primary" />
            <h4 className="font-bold text-text-1">
              {text("thisCourseIncludes")}
            </h4>
          </div>
          <ul className="space-y-2.5 md:space-y-3">
            {items.map((item, index) => (
              <li
                className="flex items-center gap-3 text-sm md:text-base text-text-2"
                key={index}
              >
                <span
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-xl",
                    toneToBg[item.tone],
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex-1">
                  {item.params ? text(item.text, item.params) : text(item.text)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default CoursesPage;
