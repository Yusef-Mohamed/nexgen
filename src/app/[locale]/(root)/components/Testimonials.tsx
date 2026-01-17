"use client";

import React, { useState, useEffect } from "react";
import TestimonialCard, {
  TestimonialCard2,
} from "@/components/cards/TestimonialCard";
import { useTranslations } from "next-intl";
import GridSection from "@/components/GridSection";
import { Button } from "@/components/ui/button";
import { IReview } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/app/lib/utils";

const Testimonials: React.FC = () => {
  const text = useTranslations("learnerReviews");
  const commonT = useTranslations("common");
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const fetchReviews = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/systemReviews?page=${pageNumber}&limit=4`
      );
      const newReviews = response.data.data;

      if (pageNumber === 1) {
        setReviews(newReviews);
      } else {
        setReviews((prev) => [...prev, ...newReviews]);
      }
      setHasMore(response.data.paginationResult.numberOfPages > pageNumber);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  return (
    <>
      <GridSection
        button={text("exploreAllReviews")}
        heading={text("heading")}
        onClick={() => setShowDialog(true)}
      >
        {reviews?.slice(0, 3).map((testimonial, index) => (
          <TestimonialCard
            reviewType="system"
            key={testimonial._id || index}
            review={testimonial}
          />
        ))}
      </GridSection>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:w-120 overflow-auto max-h-[80vh] rounded-e-none sm:rounded-e-none">
          <DialogHeader>
            <DialogTitle>{text("heading")}</DialogTitle>
            <DialogDescription className="sr-only">
              {commonT("dialog.testimonials_description")}
            </DialogDescription>
          </DialogHeader>
          {reviews?.map((testimonial, index) => (
            <TestimonialCard2
              reviewType="system"
              key={testimonial._id || index}
              review={testimonial}
            />
          ))}
          {hasMore && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleLoadMore}
                isLoading={loading}
                variant="outline"
                size="lg"
                className="w-full mx-auto sm:w-80"
              >
                {text("loadMore")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Testimonials;
