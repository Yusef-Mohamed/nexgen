import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ICoursePackage } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const LearningPath: React.FC<ICoursePackage> = ({
  title,
  description,
  courses,
  price,
  priceAfterDiscount,
  _id,
  type,
}) => {
  const levels = [];
  if (type === "beginnerToIntermediate") {
    levels.push("beginner", "intermediate");
  } else if (type === "intermediateToAdvanced") {
    levels.push("intermediate", "advanced");
  } else if (type === "beginnerToAdvanced") {
    levels.push("beginner", "advanced");
  }

  const locale = useLocale();
  const text = useTranslations("learningPaths");
  return (
    <div
      className={
        "flex flex-col cardShadow justify-between self-stretch sm:p-8 p-6 bg-background rounded-2xl border-4 border-solid border-primary/10 hover:border-primary/50 transition-colors shadow-[2px_8px_40px] shadow-primary/10 "
      }
    >
      <div>
        <h3 className="h2-5">{title}</h3>
        <div className="mt-4 sm:mt-6">
          {levels.length ? (
            <div
              style={{
                fontWeight: 500,
              }}
              className="flex items-center gap-2 sm:gap-4 text-text-1 h4 whitespace-nowrap"
            >
              {levels.map((level, index) => (
                <React.Fragment key={index}>
                  <div className="self-stretch my-auto">{text(level)}</div>
                  {index < levels.length - 1 && (
                    <div>
                      {locale === "ar" ? (
                        <FaArrowLeftLong />
                      ) : (
                        <FaArrowRightLong />
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : null}
          <p className={`sm:mt-4 text-text-2 `}>{description}</p>
          <div className="mt-4">
            <h4>{text("coursesCount", { count: courses.length })}</h4>
            <ul className="flex flex-col sm:mt-3 mt-1.5">
              {courses.map((course, index) => (
                <li key={index}>
                  <Link
                    className="flex sm:gap-3 gap-1.5 items-center group sm:mt-2 mt-1"
                    href={`/courses/${course._id}`}
                  >
                    <div className="text-primary group-hover:underline">
                      {index + 1} - {course.title}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>{" "}
          <div className="flex items-end gap-1 mt-4 font-medium sm:mt-6 whitespace-nowrap">
            {priceAfterDiscount ? (
              <>
                {" "}
                <div className="h3">${priceAfterDiscount}</div>
                <del className="h4 text-text-3">${price}</del>
              </>
            ) : (
              <div className="h3">${price}</div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Button asChild size="lg" className="w-full mt-4 sm:mt-6 ">
          <Link href={`/checkout/learning-path/${_id}`}>
            {text("showDetails")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LearningPath;
