"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { IReview } from "@/types";
import { useLocale } from "next-intl";
import UserAvatar from "./UserAvatar";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

const AuthReviewSlider = ({ reviews }: { reviews: IReview[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  const locale = useLocale();
  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 10000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {reviews.map((review, index) => (
          <CarouselItem
            className="flex flex-col items-center justify-center text-background"
            dir={locale === "ar" ? "rtl" : "ltr"}
            style={{
              userSelect: "none",
            }}
            key={index}
          >
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const starFillPercentage = Math.max(
                  0,
                  Math.min(100, (review.ratings - index) * 100)
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
            <p className="my-4">{review.title}</p>
            <div className="flex items-center gap-2">
              <UserAvatar user={review.user} />
              {review.user.name}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center w-full gap-2 mt-6 ">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`h-2.5  w-2.5 transition-all rounded-full ${
              index === current - 1 ? "bg-background" : "bg-muted/40"
            }`}
            onClick={() => api?.scrollTo(index)}
          ></button>
        ))}
      </div>
    </Carousel>
  );
};

export default AuthReviewSlider;
