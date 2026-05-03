import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import ReviewsGrid from "@/components/ReviewsGrid";
import SectionHeader from "@/components/SectionHeader";
import { IReview } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

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
      <div className="relative overflow-hidden rounded-3xl bg-primary-faded border border-primary/10 px-4 py-10 sm:px-8 sm:py-12 md:px-10">
        <div
          aria-hidden
          className="absolute -top-20 -end-20 size-60 rounded-full bg-secondary/20 blur-[90px] pointer-events-none"
        />
        <div className="relative">
          <SectionHeader
            eyebrow={text("heading")}
            heading={text("heading")}
            description={text("description")}
            align="center"
            tone="primary"
            icon={<HiOutlineChatBubbleLeftRight className="size-4 text-primary" />}
          />
          <div className="mt-8 sm:mt-10">
            <ReviewsGrid reviews={reviewsData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
