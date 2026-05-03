import { getMetadataLearningPathPage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICoursePackage } from "@/types";
import { useTranslations } from "next-intl";
import { FiPlayCircle } from "react-icons/fi";
import { PiExam } from "react-icons/pi";
import { CiMobile2 } from "react-icons/ci";
import { GoInfinity } from "react-icons/go";
import { GrCertificate } from "react-icons/gr";
import { LevelsIcons } from "@/components/icons";
import BuyLearningPath from "./components/BuyLearningPath";
import PopularLearningPaths from "../../components/PopularLearningPaths";
import PathContent from "./components/PathContent";
import { cn, getDynamicString } from "@/lib/utils";
import MobileAppHero from "../../components/MobileAppHero";
import ItemImage from "../../courses/[courseId]/components/ItemImage";
import CouponAwarePrice from "@/components/CouponAwarePrice";
import { getCouponCodeFromSearchParams, getItemBasePrice } from "@/lib/coupons";
import SectionBlock from "@/components/SectionBlock";
import ItemPageLayout from "@/components/ItemPageLayout";
import ItemDetailList from "@/components/ItemDetailList";
import {
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
} from "react-icons/hi2";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; learningPathId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
  const learningPathRes = await axiosInstance.get(
    "/coursePackages/" + params.learningPathId,
  );
  const learningPathData = learningPathRes.data.data as ICoursePackage;

  return getMetadataLearningPathPage({
    params,
    learningPath: {
      title: getDynamicString(learningPathData.title),
      description: getDynamicString(learningPathData.description),
    },
  });
}

const LearningPathPage = async (props: {
  params: Promise<{ locale: string; learningPathId: string }>;
  searchParams: Promise<{ coupon?: string | string[]; code?: string | string[] }>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const couponCode = getCouponCodeFromSearchParams(searchParams);

  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
  const learningPathRes = await axiosInstance.get(
    "/coursePackages/" + params.learningPathId,
  );
  const learningPathData = learningPathRes.data.data as ICoursePackage;
  const learningPathText = await getTranslations("learningPathPage");
  return (
    <main>
      <ItemPageLayout
        aside={
          <LearningPathCard
            learningPathData={learningPathData}
            couponCode={couponCode}
          />
        }
      >
          <LearningPathHeading
            learningPathData={learningPathData}
            className="max-lg:hidden"
          />
          <LearningPathCard
            learningPathData={learningPathData}
            couponCode={couponCode}
            className="lg:hidden relative overflow-hidden"
          />
          {learningPathData.whoThisCourseFor &&
            learningPathData.whoThisCourseFor.length > 0 && (
              <SectionBlock
                tone="secondary"
                eyebrow={learningPathText("whoThisLearningPathFor")}
                icon={<HiOutlineUserGroup className="size-5" />}
                title={learningPathText("whoThisLearningPathFor")}
              >
                <ItemDetailList
                  items={learningPathData.whoThisCourseFor}
                  tone="secondary"
                  icon={<HiOutlineUserGroup className="size-4" />}
                />
              </SectionBlock>
            )}
          {learningPathData.whatWillLearn &&
            learningPathData.whatWillLearn.length > 0 && (
              <SectionBlock
                tone="primary"
                eyebrow={learningPathText("whatYouWillLearn")}
                icon={<HiOutlineCheckCircle className="size-5" />}
                title={learningPathText("whatYouWillLearn")}
              >
                <ItemDetailList
                  items={learningPathData.whatWillLearn}
                  tone="primary"
                  icon={<HiOutlineCheckCircle className="size-4" />}
                />
              </SectionBlock>
            )}
          {learningPathData.coursePrerequisites &&
            learningPathData.coursePrerequisites.length > 0 && (
              <SectionBlock
                tone="gold"
                eyebrow={learningPathText("learningPathPrerequisites")}
                icon={<HiOutlineClipboardDocumentList className="size-5" />}
                title={learningPathText("learningPathPrerequisites")}
              >
                <ItemDetailList
                  items={learningPathData.coursePrerequisites}
                  tone="gold"
                  icon={<HiOutlineClipboardDocumentList className="size-4" />}
                />
              </SectionBlock>
            )}

          <PathContent courses={learningPathData.courses} />
      </ItemPageLayout>
      <MobileAppHero />
      <PopularLearningPaths />
    </main>
  );
};

const LearningPathHeading: React.FC<{
  learningPathData: ICoursePackage;
  className?: string;
}> = ({ learningPathData, className }) => {
  const popularText = useTranslations("popularCourses");

  const getDifficultyLevel = (type: string) => {
    switch (type?.toLowerCase()) {
      case "beginnertointermediate":
        return popularText("beginnerToIntermediate");
      case "intermediatetoadvanced":
        return popularText("intermediateToAdvanced");
      case "beginnertoadvanced":
        return popularText("beginnerToAdvanced");
      default:
        return popularText("beginnerToIntermediate");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20">
        <LevelsIcons />
        <span className="text-xs sm:text-sm font-medium text-primary">
          {getDifficultyLevel(learningPathData.type)}
        </span>
      </div>
      <h1 className="font-bold leading-tight tracking-tight text-text-1">
        {getDynamicString(learningPathData.title)}
      </h1>
      <div
        style={{
          fontWeight: 400,
        }}
        className="my-4 text-text-2 md:my-8 prose prose-sm md:prose-base max-w-none prose-headings:font-semibold prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5"
        dangerouslySetInnerHTML={{
          __html: getDynamicString(learningPathData.description) ?? "",
        }}
      />
    </div>
  );
};

const LearningPathCard: React.FC<{
  learningPathData: ICoursePackage;
  couponCode?: string;
  className?: string;
}> = ({ learningPathData, couponCode, className }) => {
  const text = useTranslations("learningPathPage");

  // Calculate total duration from all courses
  const totalDuration = learningPathData.courses.reduce(
    (total, course) => total + (course.courseDuration || 0),
    0,
  );

  const items = [
    {
      icon: <FiPlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "nHourOfVideos",
      params: { n: (totalDuration / 60).toFixed(1) },
      tone: "primary" as const,
    },
    {
      icon: <HiOutlineBookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "nCourses",
      params: { n: learningPathData.courses.length },
      tone: "secondary" as const,
    },
    {
      icon: <PiExam className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "quizes",
      tone: "gold" as const,
    },
    {
      icon: <CiMobile2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "accessOnMobile",
      tone: "primary" as const,
    },
    {
      icon: <GoInfinity className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "lifetimeAccess",
      tone: "secondary" as const,
    },
    {
      icon: <GrCertificate className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "certificatesOfCompletion",
      tone: "gold" as const,
    },
  ];

  const toneToBg: Record<"primary" | "secondary" | "gold", string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    gold: "bg-gold/15 text-gold",
  };

  return (
    <div className={className}>
      <div
        aria-hidden
        className="absolute max-lg:hidden -bottom-16 -end-16 size-48 rounded-full bg-secondary/30 dark:bg-secondary/40 blur-[100px] opacity-60 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute max-lg:hidden -top-16 -start-16 size-40 rounded-full bg-gold/25 dark:bg-gold/35 blur-[100px] opacity-60 pointer-events-none"
      />
      <ItemImage
        image={learningPathData.image || "/images/hero.png"}
        title={learningPathData.title}
        promotionVideo={learningPathData.promotionVideo}
      />
      <CouponAwarePrice
        item={learningPathData}
        itemId={learningPathData._id}
        itemType="learning-path"
        couponCode={couponCode}
        freeLabel={text("free")}
        discountedLabel={text("discounted")}
      />
      <LearningPathHeading
        learningPathData={learningPathData}
        className="lg:hidden"
      />
      <BuyLearningPath
        id={learningPathData._id}
        price={getItemBasePrice(learningPathData)}
        couponCode={couponCode}
      />
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4 md:mb-5">
          <span className="size-1.5 rounded-full bg-primary" />
          <h4 className="font-bold text-text-1">
            {text("thisLearningPathIncludes")}
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
  );
};

export default LearningPathPage;
