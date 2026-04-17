import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import ReviewsGrid from "@/components/ReviewsGrid";
import { IReview } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

const ReviewsSection = async () => {
  const text = await getTranslations("reviewsSectionAboutPage");
  const locale = await getLocale();
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: locale,
  });
  const reviewsRes = await axiosInstance.get("/systemReviews?limit=3");
  const reviewsData = reviewsRes.data.data as IReview[];
  return (
    <section className="container secPadding">
      <h2 className="text-center">{text("heading")}</h2>
      <p className="mt-6 mb-8 text-sm text-center text-text-2 sm:text-base">
        {text("description")}
      </p>
      <ReviewsGrid reviews={reviewsData} />
    </section>
  );
};

export default ReviewsSection;
