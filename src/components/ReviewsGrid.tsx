import { IReview } from "@/types";
import { TestimonialCard2 } from "./cards/TestimonialCard";

const ReviewsGrid = ({ reviews }: { reviews: IReview[] }) => {
  return (
    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 ">
      {reviews.map((review) => (
        <TestimonialCard2 key={review._id} {...review} />
      ))}
    </div>
  );
};

export default ReviewsGrid;
