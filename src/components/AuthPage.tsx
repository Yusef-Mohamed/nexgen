import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IReview } from "@/types";
import Image from "next/image";
import React from "react";
import AuthReviewSlider from "./AuthReviewsSlider";
interface AuthPageProps {
  children: React.ReactNode;
  heading: string;
  description?: string;
}
const AuthPage: React.FC<AuthPageProps> = async ({
  children,
  heading,
  description,
}) => {
  const axiosInstance = createServerAxiosInstance();
  const reviewsRes = await axiosInstance.get("/systemReviews?limit=5");
  const reviewsData = reviewsRes.data.data as IReview[];
  return (
    <main className="py-12">
      <section className="container grid items-center w-full gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="mb-4 sm:mb-6 h2">{heading}</h1>
            {description && (
              <p
                className="h5 text-text-2"
                style={{
                  fontWeight: 400,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {children}
        </div>
        <div className="relative w-full  xl:aspect-[.9/1] rounded-2xl overflow-hidden   md:aspect-[.7/1] sm:aspect-[.6.5/1] aspect-[.6/1] lg:aspect-[.8/1]">
          <Image
            width={2000}
            height={2000}
            className="object-cover w-full h-full "
            src="/images/auth.jpeg"
            alt="Auth background"
          />
          <div
            className="absolute top-0 right-0 flex flex-col items-center justify-end w-full h-full p-8 sm:p-16 "
            style={{
              background:
                "linear-gradient(180deg, #0E121600 0%, #142C57CC 100.39%)",
            }}
          >
            <AuthReviewSlider reviews={reviewsData} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
