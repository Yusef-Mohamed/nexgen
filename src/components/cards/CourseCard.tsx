import { ICourse } from "@/types";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { FaStar } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const CourseCard: React.FC<ICourse> = ({
  image,
  title,
  ratingsAverage,
  ratingsQuantity,
  price,
  priceAfterDiscount,
  _id,
}) => {
  const text = useTranslations("popularCourses");
  return (
    <div className="flex flex-col p-4 bg-white border shadow-md sm:p-6 rounded-2xl">
      <Image
        loading="lazy"
        src={image}
        alt={title}
        width={381}
        height={292}
        className="object-cover max-w-full aspect-[1.29] rounded-xl"
      />
      <div className="w-full my-4 sm:my-5">
        <h4 className="font-semibold text-text-3">STATIC</h4>
        <h3 className="font-semibold sm:mt-1">{title}</h3>
        <div className="flex items-center gap-2 my-2 sm:my-3 whitespace-nowrap">
          <FaStar className="text-xl text-gold" />
          <div className="text-xs sm:text-base text-text-3">
            ({ratingsQuantity})
          </div>
          <div className="text-base font-medium sm:text-xl">
            {ratingsAverage}
          </div>
        </div>
        <div className="flex items-end gap-1 font-medium whitespace-nowrap">
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
      <Button size={"lg"}>
        <Link href={`/courses/${_id}`}>{text("learnMore")}</Link>
      </Button>
    </div>
  );
};

export default CourseCard;
