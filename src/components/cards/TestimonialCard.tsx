import { IReview } from "@/types";
import React from "react";
import UserAvatar from "../UserAvatar";
import { useLocale } from "next-intl";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";
const TestimonialCard: React.FC<IReview> = ({ ratings, title, user }) => {
  const locale = useLocale();
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-6 text-center sm:gap-5 sm:px-6 sm:py-8 bg-muted rounded-3xl">
      <UserAvatar user={user} size="lg" className="w-20 h-20" />
      <h4>{user?.name}</h4>
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => {
          const starFillPercentage = Math.max(
            0,
            Math.min(100, (ratings - index) * 100)
          );
          return (
            <div key={index} className="relative w-5 h-5 sm:w-6 sm:h-6">
              <FaStar className="sm:w-6 w-5 sm:h-6 h-5 text-gray-300 p-0.5" />
              <div
                className={cn("absolute top-0 overflow-hidden", {
                  "right-0": locale === "ar",
                  "left-0": locale,
                })}
                style={{ width: `${starFillPercentage}%` }}
              >
                <FaStar className="sm:w-6 w-5 sm:h-6 h-5 text-gold p-0.5" />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-sm sm:text-base text-text-2">{title}</p>
    </div>
  );
};
export const TestimonialCard2: React.FC<IReview> = ({
  ratings,
  title,
  user,
}) => {
  return (
    <div className="flex flex-col gap-2 px-4 py-2 border sm:gap-3 sm:px-6 sm:p-4 rounded-xl">
      <div className="flex items-center gap-2">
        <UserAvatar className="w-12 h-12" user={user} />
        <div className="flex flex-col">
          <h4
            className="h6"
            style={{
              fontWeight: 400,
            }}
          >
            {user?.name}
          </h4>
          <DisplayReviewsStarts
            className="w-4 h-4 sm:w-5 sm:h-5"
            ratings={ratings}
            parentClassName="gap-0.5"
          />
        </div>
      </div>
      <p className="text-sm sm:text-base text-text-2">{title}</p>
    </div>
  );
};
const DisplayReviewsStarts = ({
  ratings,
  className = "w-5 h-5 sm:w-6 sm:h-6",
  parentClassName = "gap-2",
}: {
  ratings: number;
  className?: string;
  parentClassName?: string;
}) => {
  const locale = useLocale();
  return (
    <div className={cn("flex items-center", parentClassName)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starFillPercentage = Math.max(
          0,
          Math.min(100, (ratings - index) * 100)
        );
        return (
          <div key={index} className={cn("relative ", className)}>
            <FaStar className={cn("text-gray-300 p-0.5", className)} />
            <div
              className={cn("absolute top-0 overflow-hidden", {
                "right-0": locale === "ar",
                "left-0": locale,
              })}
              style={{ width: `${starFillPercentage}%` }}
            >
              <FaStar className={cn("text-gold p-0.5", className)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default TestimonialCard;
