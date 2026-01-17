"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useCourseReviewStore } from "@/stores/CourseReview";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CreateCourseReviewProps {
  courseId: string;
}

const CreateCourseReview: React.FC<CreateCourseReviewProps> = ({
  courseId,
}) => {
  const { token } = useAuth();
  const router = useRouter();
  const text = useTranslations("learn");
  const {
    data,
    idToEdit,
    isLoading,
    setData,
    fetchReview,
    submitReview,
    deleteReview,
  } = useCourseReviewStore();

  useEffect(() => {
    if (token) {
      fetchReview(courseId, token);
    }
  }, [courseId, token, fetchReview]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {
      await submitReview(courseId, token);
      toast.success(
        idToEdit
          ? text("reviewUpdatedSuccessfully")
          : text("reviewCreatedSuccessfully")
      );
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (token) {
      await deleteReview(token);
      toast.success(text("reviewDeletedSuccessfully"));
      router.refresh();
    }
  };

  return (
    <div>
      <h3 className="mt-6 mb-4 font-semibold">
        {idToEdit ? text("editYourReview") : text("addReview")}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            {text("shareWithUsYourOpinionAndHelpUsImprove")}
          </Label>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setData({ ratings: index + 1 })}
                disabled={isLoading}
                className={cn(`text-2xl`, {
                  "text-primary": index < data.ratings,
                  "text-input": !(index < data.ratings),
                  "opacity-50": isLoading,
                })}
              >
                <FaStar />
              </button>
            ))}
          </div>
          <Textarea
            disabled={isLoading}
            id="title"
            name="title"
            value={data.title}
            placeholder={text("writeYourFeedbackExample")}
            className="min-h-20"
            required
            onChange={(e) => setData({ title: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          {idToEdit && (
            <Button
              onClick={handleDelete}
              isLoading={isLoading}
              variant="destructive"
              className="w-[200px]"
            >
              {text("delete")}
            </Button>
          )}
          <Button
            isLoading={isLoading}
            type="submit"
            className="w-[200px] flex items-center justify-center"
          >
            {text("saveMyReview")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseReview;
