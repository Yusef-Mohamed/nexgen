import { IReview } from "@/types";
import { TestimonialCard2 } from "./cards/TestimonialCard";
import { useTranslations } from "next-intl";

const ReviewsGrid = ({ reviews }: { reviews: IReview[] }) => {
  const text = useTranslations("coursePage");
  return reviews.length === 0 ? (
    <div>
      <h3 className="text-center text-text-2">{text("thereIsNoReview")}</h3>
    </div>
  ) : (
    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 ">
      {reviews.map((review) => (
        <TestimonialCard2 key={review._id} {...review} />
      ))}
    </div>
  );
};

export default ReviewsGrid;
