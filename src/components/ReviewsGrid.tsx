"use client";
import { IReview } from "@/types";
import { TestimonialCard2 } from "./cards/TestimonialCard";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

const ReviewsGrid = ({
  reviews,
  isAll,
  dialogHeader,
}: {
  reviews: IReview[];
  isAll?: boolean;
  dialogHeader?: string;
}) => {
  const text = useTranslations("coursePage");
  const [isShowAll, setIsShowAll] = useState(false);
  return reviews?.length === 0 ? (
    <div>
      <h3 className="text-center text-text-2">{text("thereIsNoReview")}</h3>
    </div>
  ) : (
    <div>
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 ">
        {reviews?.slice(0, 6).map((review) => (
          <TestimonialCard2
            reviewType="course"
            key={review._id}
            review={review}
          />
        ))}
      </div>
      {isAll && (
        <>
          <Button
            onClick={() => setIsShowAll(true)}
            className="mx-auto mt-6 text-center exploreAllReviews w-80"
            variant={"outline"}
            size={"lg"}
          >
            {text("viewAllReviews")}
          </Button>
          <Dialog open={isShowAll} onOpenChange={setIsShowAll}>
            <DialogContent className="sm:w-120 overflow-auto max-h-[80vh] rounded-e-none sm:rounded-e-none">
              <DialogHeader>
                <DialogTitle>{dialogHeader}</DialogTitle>
                <DialogDescription className="sr-only">
                  {text("reviews")}
                </DialogDescription>
              </DialogHeader>
              {reviews?.map((review) => (
                <TestimonialCard2
                  reviewType="course"
                  key={review._id}
                  review={review}
                />
              ))}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ReviewsGrid;
