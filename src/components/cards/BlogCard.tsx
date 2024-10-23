import { IBlog } from "@/types";
import { useLocale } from "next-intl";
import Image from "next/image";
import React from "react";
import { GiSandsOfTime } from "react-icons/gi";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { Link } from "@/i18n/routing";
import UserAvatar from "../UserAvatar";
const BlogCard: React.FC<IBlog> = ({ _id, title, imageCover, createdAt }) => {
  const locale = useLocale();
  return (
    <article className="flex flex-col w-full h-full">
      <Link href={`/blogs/${_id}`} className="w-full">
        <Image
          src={imageCover}
          alt={title}
          width={430}
          height={240}
          className="object-cover w-full rounded-2xl aspect-[1.79]"
        />
      </Link>
      <div className="flex flex-col justify-between flex-grow px-3 mt-5 sm:px-4 sm:mt-6">
        <Link href={`/blogs/${_id}`} className="w-full">
          <h3 className="h5">{title}</h3>
        </Link>
        <div className="flex flex-row-reverse items-center justify-between w-full gap-4 mt-3 text-sm sm:text-base sm:gap-6 sm:mt-4 text-text-2">
          <div className="flex items-center gap-2 sm:gap-3 ">
            <GiSandsOfTime />
            <div>5 MIN</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
            <CiCalendarDate />
            <div>
              {new Date(createdAt).toLocaleDateString(
                locale === "ar" ? "ar-EG" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 ">
            <FaRegUser /> <div>AUTHOR</div>
          </div>
        </div>
      </div>
    </article>
  );
};
export const BlogCard2: React.FC<IBlog> = ({
  _id,
  title,
  imageCover,
  createdAt,
  description,
}) => {
  const locale = useLocale();
  return (
    <article className="flex flex-col w-full h-full">
      <Link href={`/blogs/${_id}`} className="w-full">
        <Image
          src={imageCover}
          alt={title}
          width={430}
          height={240}
          className="object-cover w-full rounded-2xl aspect-[1.79]"
        />
      </Link>
      <div className="flex flex-col justify-between flex-grow px-3 mt-5 sm:px-4 sm:mt-6">
        <Link href={`/blogs/${_id}`} className="w-full">
          <h3 className="h5">{title}</h3>
        </Link>
        <p className="mt-1 text-text-2 sm:mt-2">{description}</p>
        <div className="flex items-center gap-2 mt-2 sm:mt-4">
          <UserAvatar className="w-12 h-12" />
          <div>
            <div className="text-sm text-text-1 sm:text-base">AUTHOR</div>
            <div className="text-xs sm:text-sm text-text-3">
              <span>5 د</span> .{" "}
              <span>
                {new Date(createdAt).toLocaleDateString(
                  locale === "ar" ? "ar-EG" : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
