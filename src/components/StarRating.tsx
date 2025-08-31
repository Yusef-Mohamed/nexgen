import React from "react";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

// Star Rating Component
interface StarRatingProps {
  rating: number;
  containerClassName?: string;
  iconClassName?: string;
  showRating?: boolean;
  showCount?: boolean;
  count?: number;
  countClassName?: string;
  ratingClassName?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  containerClassName = "flex items-center gap-1",
  iconClassName = "text-sm",
  showRating = true,
  showCount = true,
  count = 0,
  countClassName = "text-sm",
  ratingClassName = "font-bold",
}) => {
  return (
    <div className={containerClassName}>
      {[...Array(5)].map((_, index) => {
        const starNumber = index + 1;
        const isFullStar = starNumber <= Math.floor(rating);
        const isPartialStar =
          starNumber === Math.ceil(rating) && rating % 1 !== 0;
        const partialPercentage = isPartialStar ? (rating % 1) * 100 : 0;

        return (
          <div key={index} className="relative">
            {/* Gray background star */}
            <FaStar className={`${iconClassName} text-gray-300`} />
            {/* Gold overlay star */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{
                width: isFullStar
                  ? "100%"
                  : isPartialStar
                  ? `${partialPercentage}%`
                  : "0%",
              }}
            >
              <FaStar className={`${iconClassName} text-yellow-400`} />
            </div>
          </div>
        );
      })}
      {showRating && <span className={cn(ratingClassName)}>{rating}</span>}
      {showCount && count > 0 && (
        <span className={cn("text-text-3", countClassName)}>({count})</span>
      )}
    </div>
  );
};

export default StarRating;
