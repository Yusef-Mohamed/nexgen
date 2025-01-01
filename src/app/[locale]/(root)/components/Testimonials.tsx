import React from "react";
import TestimonialCard from "../../../../components/cards/TestimonialCard";
import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IReview } from "@/types";
import GridSection from "@/components/GridSection";

const Testimonials: React.FC = async () => {
  const text = await getTranslations("learnerReviews");
  const axiosInstance = createServerAxiosInstance();
  const reviewsRes = await axiosInstance.get("/systemReviews?limit=3");
  const reviewsData = reviewsRes.data.data as IReview[];
  return (
    <GridSection
      // button={text("exploreAllReviews")}
      // href="/reviews"
      heading={text("heading")}
    >
      {reviewsData.map((testimonial, index) => (
        <TestimonialCard key={index} {...testimonial} />
      ))}
    </GridSection>
  );
};

export default Testimonials;
