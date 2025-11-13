import { getMetadataLearningPathPage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { ICoursePackage } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CiDiscount1 } from "react-icons/ci";
import { FiPlayCircle } from "react-icons/fi";
import { PiExam } from "react-icons/pi";
import { CiMobile2 } from "react-icons/ci";
import { GoInfinity } from "react-icons/go";
import { GrCertificate } from "react-icons/gr";
import PromoBanner from "../../components/PromoBanner";
import { LevelsIcons } from "@/components/icons";
import BuyLearningPath from "./components/BuyLearningPath";
import PopularLearningPaths from "../../components/PopularLearningPaths";
import PathContent from "./components/PathContent";
import { getDynamicString } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; learningPathId: string };
}): Promise<Metadata> {
  const axiosInstance = createServerAxiosInstance();
  const learningPathRes = await axiosInstance.get(
    "/coursePackages/" + params.learningPathId
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

const LearningPathPage = async ({
  params,
}: {
  params: { locale: string; learningPathId: string };
}) => {
  unstable_setRequestLocale(params.locale);
  try {
    const text = await getTranslations("learningPathPage");
    const axiosInstance = createServerAxiosInstance();
    const learningPathRes = await axiosInstance.get(
      "/coursePackages/" + params.learningPathId
    );
    const learningPathData = learningPathRes.data.data as ICoursePackage;

    return (
      <main>
        <section className="container flex gap-20 secPadding">
          <div className="flex-1 w-full">
            <LearningPathHeading
              learningPathData={learningPathData}
              className="max-lg:hidden"
            />
            <LearningPathCard
              learningPathData={learningPathData}
              className="lg:hidden"
            />
            <div className="my-4 md:my-8">
              <h3 className="mb-4 md:mb-8">{text("whatYouWillLearn")}</h3>
              <ul className="grid gap-4 md:grid-cols-2 md:gap-8">
                {learningPathData.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-text-2 md:text-base"
                  >
                    <div className="w-1 h-1 mt-2 rounded-full bg-text-2"></div>
                    <p className="flex-1 ">
                      {typeof highlight === "string" ? highlight : null}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <PathContent courses={learningPathData.courses} />
          </div>
          <div className="max-w-[29rem] hidden  h-fit lg:block rounded-3xl  basis-[40%] bg-clear-ground cardShadow p-6">
            <LearningPathCard learningPathData={learningPathData} />
          </div>
        </section>
        <PromoBanner />
        <PopularLearningPaths />
      </main>
    );
  } catch (e) {
    console.log(e);
    return notFound();
  }
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
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <LevelsIcons />
        <span className="text-primary font-medium">
          {getDifficultyLevel(learningPathData.type)}
        </span>
      </div>
      <h1>{getDynamicString(learningPathData.title)}</h1>
      <p
        style={{
          fontWeight: 400,
        }}
        className="my-4 text-text-2 h3 md:my-8"
      >
        {getDynamicString(learningPathData.description)}
      </p>
    </div>
  );
};

const LearningPathCard: React.FC<{
  learningPathData: ICoursePackage;
  className?: string;
}> = ({ learningPathData, className }) => {
  const text = useTranslations("learningPathPage");

  // Calculate total duration from all courses
  const totalDuration = learningPathData.courses.reduce(
    (total, course) => total + (course.courseDuration || 0),
    0
  );

  const items = [
    {
      icon: <FiPlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "nHourOfVideos",
      params: { n: (totalDuration / 60).toFixed(1) },
    },
    {
      icon: <FiPlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "nCourses",
      params: { n: learningPathData.courses.length },
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
      text: "certificatesOfCompletion",
    },
  ];
  return (
    <div className={className}>
      <Image
        src={learningPathData.image || "/images/hero.png"}
        width={1000}
        height={1000}
        className="aspect-[41/31] object-cover w-full rounded-2xl"
        alt={getDynamicString(learningPathData.title)}
      />{" "}
      <div className="flex items-center justify-between my-4 md:my-8">
        <div className="flex items-end gap-1 font-medium whitespace-nowrap">
          {learningPathData.priceAfterDiscount ? (
            <>
              <div className="h2">${learningPathData.priceAfterDiscount}</div>
              <del className="h3 text-text-3">${learningPathData.price}</del>
            </>
          ) : (
            <div className="h2">
              {learningPathData.price && learningPathData.price !== 0 ? (
                <>${learningPathData.price}</>
              ) : (
                text("free")
              )}
            </div>
          )}
        </div>
        {learningPathData.priceAfterDiscount &&
        learningPathData.priceAfterDiscount !== learningPathData.price ? (
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
                ((learningPathData.price -
                  learningPathData.priceAfterDiscount) /
                  learningPathData.price) *
                100
              ).toFixed(0)}
              %
            </span>
          </div>
        ) : null}
      </div>
      <LearningPathHeading
        learningPathData={learningPathData}
        className="lg:hidden"
      />
      <BuyLearningPath
        id={learningPathData._id}
        price={learningPathData.price.toString()}
      />
      <div className="mt-6">
        <h4 className="mb-4 md:mb-6">{text("thisLearningPathIncludes")}</h4>
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

export default LearningPathPage;
